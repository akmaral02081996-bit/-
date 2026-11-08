"""Распознаёт речь и сохраняет слова с таймингом в JSON.
Использование: python3 transcribe.py <видео> <out.json> [модель]"""
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

src, out = sys.argv[1], sys.argv[2]
model_name = sys.argv[3] if len(sys.argv) > 3 else "medium"
model = WhisperModel(model_name, device="cpu", compute_type="int8")
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                     check=True, capture_output=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768.0
segments, info = model.transcribe(audio, language="ru", word_timestamps=True, vad_filter=True)
words, text = [], []
for seg in segments:
    text.append(seg.text.strip())
    for w in seg.words:
        words.append({"w": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
json.dump({"text": " ".join(text), "words": words}, open(out, "w"), ensure_ascii=False, indent=1)
print(" ".join(text))
print(len(words), "words")
