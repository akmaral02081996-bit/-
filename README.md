# Motion — моушн-графика кодом в Claude Code

## Установленные скиллы (`.claude/skills/`)

Claude Code подхватывает их автоматически, когда открыт этот репозиторий.

| Скилл | Вызов | Что делает |
|---|---|---|
| **rivera-motion-free** (Георгий Ривера) | `/rivera-motion-free` | Моушн на Remotion (2D/3D) по шагам со стопами на согласование: идея → дизайн словами → раскадровка → ключевые кадры → видео-тест → сборка → финал. Самопроверка по 10 пунктам (проходной: среднее ≥ 8, ни один < 7). |
| **vizavi-motion** v1.6.1 | `/vizavi-motion` | Оригинальные motion-ролики, продуктовая анимация (SaaS/UI), кинетическая типографика. Раскадровка с 3–5 вариантами на сцену, музыка и SFX по умолчанию, обязательная итерация после первой сборки, выдача MP4 1920×1080 60 fps H.264 + AAC. Справочники — в `references/`. |

Инструкция автора rivera-motion-free: `.claude/skills/rivera-motion-free/ИНСТРУКЦИЯ.md`.

## Папки

```
materials/      логотипы, фото, скринкасты, видео-образцы стилей
work/remotion/  проект Remotion (рабочий; черновые рендеры в out/ не коммитятся)
final/          готовые ролики
```

## Запуск проекта Remotion

Нужны Node.js 20+, npm, ffmpeg.

```bash
cd work/remotion
npm install
npx remotion studio                                        # студия в браузере
npx remotion render MyComp out/test.mp4 --frames=0-59      # пробный рендер 2D
npx remotion still ThreeTest out/three.png --frame=20      # проверка 3D
```

Версии: `remotion` / `@remotion/cli` / `@remotion/three` — 4.0.541 (должны совпадать), `three` 0.187, `@react-three/fiber` 9.
Для 3D включён программный WebGL (`swangle`) в `remotion.config.ts`; тяжёлое 3D рендерить с `--concurrency=2`.

Remotion бесплатен для частных лиц и команд до 3 человек; крупнее — нужна лицензия: https://www.remotion.dev/license

## Распознавание речи (тайминг слов для титров)

```bash
pip install faster-whisper
python3 work/tools/transcribe.py materials/<видео>.mp4 work/words.json medium ru   # для казахского: kk
```
Модель (~1,5 ГБ) скачивается с huggingface.co при первом запуске. В облаке Claude Code для этого нужна среда
`akmaral-motion` (в ней открыты huggingface.co и его хранилища).
