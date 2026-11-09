"""Тихий музыкальный фон: мягкие аккорды (пэд) + лёгкий перебор. Без сэмплов — чистый синтез.
Использование: python3 music_bed.py <out.wav> <длительность_с> [bpm]"""
import sys, wave
import numpy as np

out, dur = sys.argv[1], float(sys.argv[2])
bpm = float(sys.argv[3]) if len(sys.argv) > 3 else 84
sr = 48000
n = int(dur * sr)
t = np.arange(n) / sr
beat = 60 / bpm
bar = beat * 4

def hz(m):  # MIDI -> Гц
    return 440 * 2 ** ((m - 69) / 12)

# Fmaj7 – Cmaj7/E – Am7 – Gsus2 (тёплая, спокойная гармония)
chords = [[53, 57, 60, 64], [52, 55, 59, 64], [45, 55, 60, 64], [43, 55, 57, 62]]
L = np.zeros(n); R = np.zeros(n)

def env_ar(length, a, r):
    e = np.ones(length)
    ai = int(a * sr); ri = int(r * sr)
    e[:ai] = np.linspace(0, 1, ai) ** 2
    e[-ri:] *= np.linspace(1, 0, ri) ** 2
    return e

# Пэд: каждая нота — 3 гармоники, лёгкая расстройка влево/вправо
for i in range(int(np.ceil(dur / bar)) + 1):
    s = int(i * bar * sr); e = min(n, int((i + 1) * bar * sr + 0.8 * sr))
    if s >= n: break
    seg = t[s:e] - t[s]
    env = env_ar(e - s, 0.9, 1.0)
    for m in chords[i % 4]:
        f = hz(m)
        for h, amp in ((1, 1.0), (2, 0.28), (3, 0.1)):
            L[s:e] += amp * env * np.sin(2 * np.pi * f * h * 1.0015 * seg) * 0.05
            R[s:e] += amp * env * np.sin(2 * np.pi * f * h * 0.9985 * seg + 0.7) * 0.05
    # бас
    fb = hz(chords[i % 4][0] - 12)
    bass = env * np.sin(2 * np.pi * fb * seg) * 0.09
    L[s:e] += bass; R[s:e] += bass

# Перебор: восьмые ноты из аккорда на октаву выше, мягкая атака, быстрое затухание
step = beat / 2
k = 0
while k * step < dur - 0.3:
    s = int(k * step * sr)
    ch = chords[int(k * step / bar) % 4]
    m = ch[[0, 2, 1, 3, 2, 1, 3, 2][k % 8]] + 12
    ln = min(int(1.2 * sr), n - s)
    seg = np.arange(ln) / sr
    tone = np.sin(2 * np.pi * hz(m) * seg) + 0.25 * np.sin(2 * np.pi * hz(m) * 2 * seg)
    env = (1 - np.exp(-seg / 0.006)) * np.exp(-seg / 0.35)
    pan = 0.5 + 0.3 * np.sin(k * 0.9)
    v = (0.9 if k % 4 == 0 else 0.6) * 0.045
    L[s:s + ln] += tone * env * v * (1 - pan) * 2
    R[s:s + ln] += tone * env * v * pan * 2
    k += 1

# Мягкий фильтр (одно-полюсный ФНЧ) и простая «комната» (две задержки)
def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / sr); y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc; y[i] = acc
    return y
L = lowpass(L, 3500); R = lowpass(R, 3500)
for d, g in ((0.043, 0.25), (0.071, 0.18)):
    di = int(d * sr)
    L[di:] += g * R[:-di]; R[di:] += g * L[:-di]

fade = np.ones(n); fi = int(1.0 * sr); fo = int(2.0 * sr)
fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
L *= fade; R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
st = (np.stack([L, R], 1) / peak * 0.7 * 32767).astype(np.int16)
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(st.tobytes())
print("ok", out, dur, "s")
