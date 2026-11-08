"""Покадровый анализ исходника: положение лица и линия неба (хребет).
Выход: JSON {fps, faces:[[t,cx,cy,size]...], ridge:[[t, [y по 54 колонкам]]...]} в координатах 1080x1920.
Использование: python3 analyze.py <video 1080x1920> <out.json> [шаг_сек]"""
import json, sys, os
import cv2, numpy as np

src, out = sys.argv[1], sys.argv[2]
step = float(sys.argv[3]) if len(sys.argv) > 3 else 1 / 15
det_net = cv2.FaceDetectorYN.create(os.path.join(os.path.dirname(__file__), "models/yunet.onnx"), "", (540, 960), 0.7)
cap = cv2.VideoCapture(src)
fps = cap.get(cv2.CAP_PROP_FPS); n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
every = max(1, round(step * fps))
faces, ridge = [], []
COLS = 54
prev = None
for i in range(n):
    ok, fr = cap.read()
    if not ok: break
    if i % every: continue
    t = i / fps
    small = cv2.resize(fr, (540, 960))
    _, det = det_net.detect(small)
    if det is not None and len(det):
        # ближайшее к прошлому положению лицо
        cand = [(d[0] + d[2] / 2, d[1] + d[3] / 2, d[2]) for d in det]
        best = min(cand, key=lambda c: 0 if prev is None else (c[0] - prev[0]) ** 2 + (c[1] - prev[1]) ** 2)
        if prev is None or abs(best[0] - prev[0]) < 120:
            prev = best
            faces.append([round(t, 3), round(float(best[0]) * 2, 1), round(float(best[1]) * 2, 1), round(float(best[2]) * 2, 1)])
    # небо: голубое и яркое; идём сверху вниз по колонке до первого «не неба»
    b, gch, r = [small[:, :, k].astype(int) for k in range(3)]
    sky = (b > 150) & (b - r > 35) & (b >= gch)
    ys = []
    for c in range(COLS):
        x0 = int(c * 540 / COLS); x1 = int((c + 1) * 540 / COLS)
        col = sky[:, x0:x1].mean(axis=1) > 0.6
        y = 0
        while y < 960 and col[y]: y += 1
        ys.append(y * 2)
    ys = np.convolve(np.pad(ys, 2, mode="edge"), np.ones(5) / 5, mode="valid")
    ridge.append([round(t, 3), [int(v) for v in ys]])
json.dump({"fps": fps, "faces": faces, "ridge": ridge}, open(out, "w"))
print(len(faces), "faces /", len(ridge), "samples")
