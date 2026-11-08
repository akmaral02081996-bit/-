"""Убирает лишние паузы по аудио, не трогая речь.
Использование: python3 cut_pauses.py <out_dir> <video1> <words1.json> [<video2> <words2.json> ...]
Пишет: <out_dir>/plan.json (что оставить), <out_dir>/report.txt, <out_dir>/segments.txt (для concat)."""
import json, subprocess, sys, os
import numpy as np

FPS = 25
HOP = 0.01            # шаг анализа громкости, с
OVER_FLOOR_DB = 8.0   # «звук» = громче шумового фона на 8 дБ (дыхание тоже проходит)
KEEP_MAX = 0.35       # паузы до 0.35 с не трогаем (естественный ритм)
THINK_MIN = 0.8       # внутри предложения режем только паузы от 0.8 с (задумался)
PAD_AFTER = 0.12      # тишина после последнего звука фразы
PAD_BEFORE = 0.08     # тишина перед началом следующей фразы
PAD_THINK = (0.15, 0.10)  # для пауз внутри мысли оставляем чуть больше: 0.25 с
LEAD, TAIL = 0.15, 0.25   # в начале и в конце каждого клипа

def audio(path, sr=16000):
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(sr), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(pcm, np.int16).astype(np.float32) / 32768, sr

def sound_mask(a, sr):
    hop = int(HOP * sr); win = hop * 2
    n = len(a) // hop
    db = np.array([20 * np.log10(np.sqrt(np.mean(a[i * hop:i * hop + win] ** 2)) + 1e-9) for i in range(n)])
    floor = np.percentile(db, 8)
    m = db > floor + OVER_FLOOR_DB
    return m, db, floor

def runs(mask):
    out, i, n = [], 0, len(mask)
    while i < n:
        if mask[i]:
            j = i
            while j < n and mask[j]: j += 1
            out.append([i * HOP, j * HOP]); i = j
        else: i += 1
    return out

def vad_speech(a, sr):
    """Речь по нейросетевому детектору Silero VAD (встроен в faster-whisper)."""
    from faster_whisper.vad import VadOptions, get_speech_timestamps
    ts = get_speech_timestamps(a, vad_options=VadOptions(threshold=0.35, min_silence_duration_ms=120, speech_pad_ms=40), sampling_rate=sr)
    return [[t["start"] / sr, t["end"] / sr] for t in ts]

def voiced(a, sr, floor, over=5, rmin=0.55, minlen=0.06):
    """Голос по высоте тона: автокорреляция в диапазоне 75–450 Гц + энергия выше фона.
    Ловит «ммм», «ааа», протяжные и затухающие окончания, которые пропускает VAD."""
    win, hop = int(0.04 * sr), int(0.01 * sr)
    lo, hi = sr // 450, sr // 75
    n = (len(a) - win) // hop
    flags = np.zeros(n, bool)
    for i in range(n):
        x = a[i * hop:i * hop + win]
        e = 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
        if e < floor + over: continue
        x = x - x.mean()
        ac = np.correlate(x, x, "full")[win - 1:]
        if ac[0] <= 0: continue
        r = ac[lo:hi] / ac[0]
        flags[i] = r.max() > rmin
    # сглаживание: склеиваем разрывы < 0.08 с, убираем куски < 0.12 с
    out = []
    for s0, e0 in runs(flags):
        if out and s0 - out[-1][1] < 0.08: out[-1][1] = e0
        else: out.append([s0, e0])
    return [r for r in out if r[1] - r[0] >= minlen]

def plan_clip(video, words_path):
    a, sr = audio(video)
    dur = len(a) / sr
    m, db, floor = sound_mask(a, sr)
    snd = runs(m)
    # 1) основа: нейросетевой детектор речи + сильные голосовые звуки («ммм», «ааа»)
    base = vad_speech(a, sr) + voiced(a, sr, floor, over=12, rmin=0.65, minlen=0.15)
    # 2) слабые признаки (тихие окончания, вдох, начальные согласные) — только вплотную к основе (≤0.3 с)
    weak = voiced(a, sr, floor) + [r for r in snd if r[1] - r[0] <= 0.5]
    near = lambda r: any(-0.3 < b[0] - r[1] < 0.3 or -0.3 < r[0] - b[1] < 0.3 or (r[0] < b[1] and b[0] < r[1]) for b in base)
    regs = base + [r for r in weak if near(r)]
    # защищаем слова из распознавания (тихие окончания), но только там, где VAD тоже слышит речь рядом
    words = json.load(open(words_path))["words"]
    vad = vad_speech(a, sr)
    words = [w for w in words if any(r[0] - 0.3 <= w["start"] <= r[1] + 0.3 for r in vad)]
    # слова из распознавания НЕ расширяют речь (Whisper растягивает их на паузы) — только для отчёта
    regs.sort()
    # склеиваем пересечения и микро-разрывы < 0.06 с, выбрасываем щелчки < 0.05 с
    merged = []
    for s, e in regs:
        if merged and s - merged[-1][1] < 0.06: merged[-1][1] = max(merged[-1][1], e)
        else: merged.append([s, e])
    merged = [r for r in merged if r[1] - r[0] >= 0.05 or any(w["start"] - 0.05 <= r[0] <= w["end"] + 0.05 for w in words)]

    def sentence_end_before(t):
        prev = [w for w in words if w["end"] <= t + 0.05]
        if not prev: return True
        w = prev[-1]
        return w["w"].rstrip().endswith((".", "?", "!", "…")) or (t - w["end"]) > 0.6

    keep = [[max(0, merged[0][0] - LEAD), None]]
    gaps = []
    for (s0, e0), (s1, e1) in zip(merged, merged[1:]):
        L = s1 - e0
        if L <= KEEP_MAX:
            continue
        sent = sentence_end_before(e0)
        if sent:
            pa, pb = PAD_AFTER, PAD_BEFORE
        elif L >= THINK_MIN:
            pa, pb = PAD_THINK
        else:
            gaps.append({"at": round(e0, 2), "len": round(L, 2), "action": "оставлена (смысловая)"}); continue
        keep[-1][1] = e0 + pa
        keep.append([s1 - pb, None])
        gaps.append({"at": round(e0, 2), "len": round(L, 2), "action": f"сокращена до {pa + pb:.2f}", "sentence": sent})
    keep[-1][1] = min(dur, merged[-1][1] + TAIL)
    # привязка к кадрам
    snapped = []
    for s, e in keep:
        s = np.floor(s * FPS) / FPS; e = np.ceil(e * FPS) / FPS
        if snapped and s <= snapped[-1][1]: snapped[-1][1] = max(snapped[-1][1], e)
        else: snapped.append([round(s, 3), round(e, 3)])
    kept = sum(e - s for s, e in snapped)
    return {"video": video, "dur": round(dur, 2), "floor_db": round(float(floor), 1), "keep": snapped, "kept": round(kept, 2), "gaps": gaps}

if __name__ == "__main__":
    out = sys.argv[1]; args = sys.argv[2:]
    os.makedirs(out, exist_ok=True)
    plans = [plan_clip(args[i], args[i + 1]) for i in range(0, len(args), 2)]
    json.dump(plans, open(f"{out}/plan.json", "w"), ensure_ascii=False, indent=1)
    with open(f"{out}/report.txt", "w") as r:
        tot0 = sum(p["dur"] for p in plans); tot1 = sum(p["kept"] for p in plans)
        r.write(f"Было {tot0:.1f} с, стало {tot1:.1f} с, убрано {tot0 - tot1:.1f} с тишины\n")
        for p in plans:
            cut = [g for g in p["gaps"] if g["action"].startswith("сокращ")]
            r.write(f"\n{os.path.basename(p['video'])}: {p['dur']} → {p['kept']} с, склеек {len(p['keep']) - 1}, фон {p['floor_db']} дБ\n")
            for g in p["gaps"]:
                r.write(f"  {g['at']:7.2f} с  пауза {g['len']:.2f} с — {g['action']}\n")
    print(open(f"{out}/report.txt").read().split("\n")[0])
