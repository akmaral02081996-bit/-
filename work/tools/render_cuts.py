"""Собирает видео по plan.json: каждый кусок вырезается точно по кадрам, звук с микро-переходом 8 мс.
Использование: python3 render_cuts.py <plan.json> <map: исходник=нормализованный ...> <out.mov>"""
import json, subprocess, sys, os

plan = json.load(open(sys.argv[1]))
mp = dict(x.split("=", 1) for x in sys.argv[2:-1])
out = sys.argv[-1]
tmp = os.path.join(os.path.dirname(out), "segs"); os.makedirs(tmp, exist_ok=True)
lst = []
k = 0
for p in plan:
    src = mp[p["video"]]
    for s, e in p["keep"]:
        d = e - s
        f = os.path.join(tmp, f"s{k:04d}.mov")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.3f}", "-i", src, "-t", f"{d:.3f}",
                        "-af", f"afade=t=in:d=0.008,afade=t=out:st={max(0, d - 0.008):.3f}:d=0.008",
                        "-c:v", "libx264", "-preset", "fast", "-crf", "14", "-pix_fmt", "yuv420p", "-r", "25",
                        "-c:a", "pcm_s16le", "-ar", "48000", "-ac", "2", f], check=True)
        lst.append(f); k += 1
with open(os.path.join(tmp, "list.txt"), "w") as fh:
    for f in lst: fh.write(f"file '{os.path.abspath(f)}'\n")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", os.path.join(tmp, "list.txt"), "-c", "copy", out], check=True)
print("segments:", k, "->", out)
