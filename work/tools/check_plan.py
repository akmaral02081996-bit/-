"""Проверка плана без рендера: склеивает звук по плану и меряет оставшиеся паузы и потерянные слова."""
import json, subprocess, sys
import numpy as np
from faster_whisper.vad import VadOptions, get_speech_timestamps
plan = json.load(open(sys.argv[1])); wmap = dict(x.split("=") for x in sys.argv[2:])
sr = 16000; parts = []; lost_all = []
for p in plan:
    a = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", p["video"], "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(np.float32) / 32768
    for s, e in p["keep"]: parts.append(a[int(s * sr):int(e * sr)])
    k = p["keep"]; removed = [[0, k[0][0]]] + [[k[i][1], k[i + 1][0]] for i in range(len(k) - 1)] + [[k[-1][1], p["dur"]]]
    ws = json.load(open(wmap[p["video"]]))["words"]
    lost_all += [(p["video"][5:13], w["w"], w["start"]) for w in ws if any(r[0] < (w["start"] + w["end"]) / 2 < r[1] for r in removed)]
j = np.concatenate(parts)
ts = get_speech_timestamps(j, vad_options=VadOptions(threshold=0.35, min_silence_duration_ms=120, speech_pad_ms=0), sampling_rate=sr)
sp = [(t["start"] / sr, t["end"] / sr) for t in ts]
gaps = [(round(sp[i][1], 2), round(sp[i + 1][0] - sp[i][1], 2)) for i in range(len(sp) - 1)]
print(f"длина {len(j) / sr:.1f} с | пауз >0.6 с: {sum(g[1] > 0.6 for g in gaps)} | >1 с: {[g for g in gaps if g[1] > 1]}")
print("слова из распознавания в вырезанном:", lost_all)
