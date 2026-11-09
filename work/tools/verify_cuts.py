"""Проверяет вырезанные куски: есть ли там голос (речь) по звуку.
Подозрительно = кадр с уровнем > фон+14 дБ ИЛИ (голос r>0.6 при уровне > фон+5 дБ)."""
import json, sys
import numpy as np
sys.path.insert(0, __file__.rsplit("/", 1)[0])
import cut_pauses as C
plan = json.load(open(sys.argv[1]))
bad = 0
for p in plan:
    a, sr = C.audio(p["video"]); _, _, floor = C.sound_mask(a, sr)
    k = p["keep"]; removed = [[0, k[0][0]]] + [[k[i][1], k[i + 1][0]] for i in range(len(k) - 1)] + [[k[-1][1], p["dur"]]]
    win, hop = 640, 160; lo, hi = sr // 450, sr // 75
    for r0, r1 in removed:
        x = a[int(r0 * sr):int(r1 * sr)]; hits = []
        for i in range(0, max(0, (len(x) - win) // hop)):
            y = x[i * hop:i * hop + win]; e = 20 * np.log10(np.sqrt(np.mean(y ** 2)) + 1e-9) - floor
            if e < 5: continue
            y = y - y.mean(); ac = np.correlate(y, y, "full")[win - 1:]; r = (ac[lo:hi] / max(ac[0], 1e-9)).max()
            if e > 14 or r > 0.6: hits.append((round(r0 + i * 0.01, 2), round(e, 1), round(r, 2)))
        voiced = [h for h in hits if h[2] > 0.6]
        if len(voiced) >= 3:
            bad += 1
            print(f"{p['video'][5:13]} вырезано {r0:.2f}-{r1:.2f}: голосовых кадров {len(voiced)}, пример {voiced[:4]}")
print("подозрительных вырезов:", bad)
