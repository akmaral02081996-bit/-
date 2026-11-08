// Монтаж «Идеяны қайдан аласыз?» — все времена в секундах по голосу (work/words.json).
export const FPS = 60;
export const DURATION = 32.62;

export type Shot = {
  from: number;
  to: number;
  z0: number; // зум в начале (1 = весь кадр)
  z1: number; // зум в конце
  faceY?: number; // где держать лицо по высоте экрана, px
  ease?: "out" | "inOut" | "fastOut";
};

// Наезды вместо склеек: один план, разная крупность.
export const SHOTS: Shot[] = [
  { from: 0, to: 3.3, z0: 2.3, z1: 1.12, faceY: 1010, ease: "fastOut" },
  { from: 3.3, to: 6.4, z0: 1.75, z1: 1.85, faceY: 1060 },
  { from: 6.4, to: 10.3, z0: 1.0, z1: 1.06, faceY: 900, ease: "inOut" },
  { from: 10.3, to: 13.6, z0: 1.45, z1: 1.52, faceY: 1040 },
  { from: 13.6, to: 17.6, z0: 2.2, z1: 2.3, faceY: 1080 },
  { from: 17.6, to: 18.96, z0: 1.12, z1: 1.16, faceY: 980 },
  { from: 18.96, to: 19.86, z0: 1.5, z1: 1.55, faceY: 1060 },
  { from: 19.86, to: 21.66, z0: 1.9, z1: 1.98, faceY: 1080 },
  { from: 21.66, to: 22.22, z0: 2.35, z1: 2.4, faceY: 1100 },
  { from: 22.22, to: 23.25, z0: 1.3, z1: 1.34, faceY: 1040 },
  { from: 23.25, to: 25.9, z0: 1.3, z1: 1.0, faceY: 900, ease: "inOut" },
  { from: 25.9, to: 29.3, z0: 1.6, z1: 1.68, faceY: 1060 },
  { from: 29.3, to: DURATION, z0: 1.9, z1: 1.25, faceY: 900, ease: "inOut" },
];

export type Line = {
  text: string;
  at: number;
  color: "red" | "white";
  size?: number; // макс. размер, подгоняется под ширину
  indent?: number;
};
type Words = { words: string; at: number; step?: number };
export type Cue = {
  from: number;
  to: number;
  top: number; // верх блока, px
  lines: Line[];
  above?: Words; // мелкая строка над заголовком
  below?: Words; // мелкая строка под заголовком
  icon?: { kind: "bulb" | "sun"; at: number; x: number; y: number };
  stickers?: { text: string; at: number; rot: number }[];
  behindRidge?: boolean; // текст за хребтом (в мировых координатах)
};

// Только казахский; цвета — белый и красный, чередуются по строкам.
export const CUES: Cue[] = [
  {
    from: 0.03, to: 1.6, top: 300,
    lines: [{ text: "идея?", at: 0.03, color: "red", size: 300 }],
    icon: { kind: "bulb", at: 0.2, x: 900, y: 300 },
  },
  {
    from: 1.62, to: 3.3, top: 300,
    lines: [
      { text: "Оқырмандарым", at: 1.62, color: "white" },
      { text: "әріптестерім", at: 2.5, color: "red", indent: 40 },
    ],
  },
  {
    from: 3.34, to: 6.4, top: 290,
    lines: [
      { text: "Идеяны", at: 4.14, color: "white" },
      { text: "қайдан", at: 4.7, color: "red", indent: 120 },
      { text: "аласыз?", at: 5.08, color: "white", indent: 40 },
    ],
    icon: { kind: "bulb", at: 3.34, x: 860, y: 300 },
  },
  {
    from: 7.06, to: 8.95, top: 300,
    above: { words: "менің идея алатын жерім", at: 7.06, step: 0.22 },
    lines: [{ text: "осындай", at: 8.16, color: "red", size: 210 }],
  },
  {
    from: 8.98, to: 10.3, top: 0, behindRidge: true,
    lines: [{ text: "ТАУЛАР", at: 8.98, color: "red", size: 230 }],
  },
  {
    from: 9.1, to: 10.3, top: 330, lines: [],
    below: { words: "тауларға келіп осылай", at: 9.1, step: 0.35 },
  },
  {
    from: 10.36, to: 12.6, top: 300,
    lines: [{ text: "таза ауа", at: 10.36, color: "white", size: 200 }],
    below: { words: "серуендеп, демалып", at: 10.88, step: 0.94 },
  },
  {
    from: 12.62, to: 13.6, top: 300,
    above: { words: "миыма", at: 12.62 },
    lines: [{ text: "тыныштық", at: 12.62, color: "red", size: 200 }],
    below: { words: "беремін", at: 13.02 },
  },
  {
    from: 13.94, to: 17.6, top: 280,
    lines: [{ text: "мұғалімдер", at: 13.94, color: "white", size: 190 }],
    below: { words: "тыныштықты жақсы көретін сияқтымыз", at: 14.68, step: 0.4 },
  },
  {
    from: 17.64, to: 18.96, top: 300,
    lines: [{ text: "солай", at: 17.64, color: "white", size: 200 }],
    below: { words: "мен өзімнің", at: 18.36, step: 0.18 },
  },
  {
    from: 18.96, to: 22.22, top: 300,
    lines: [],
    stickers: [
      { text: "жұмыс", at: 18.96, rot: -3 },
      { text: "мектеп", at: 19.86, rot: 2.5 },
      { text: "блог", at: 21.66, rot: -1.5 },
    ],
  },
  {
    from: 22.22, to: 23.25, top: 300,
    lines: [{ text: "шабыт", at: 22.22, color: "red", size: 260 }],
  },
  {
    from: 23.32, to: 25.9, top: 300,
    lines: [{ text: "керемет", at: 23.32, color: "white", size: 220 }],
    below: { words: "таза ауада демалуды жақсы көрем", at: 24.04, step: 0.3 },
  },
  {
    from: 25.96, to: 29.3, top: 300,
    lines: [{ text: "әттең...", at: 25.96, color: "white", size: 170 }],
    stickers: [{ text: "1-сынып", at: 27.32, rot: -2 }],
    icon: { kind: "sun", at: 28.1, x: 880, y: 360 },
  },
  {
    from: 30.04, to: DURATION, top: 250,
    lines: [
      { text: "күнде", at: 30.04, color: "white", size: 150 },
      { text: "таңертең", at: 30.22, color: "red", size: 150, indent: 60 },
    ],
    below: { words: "келіп жүрер едім", at: 30.78, step: 0.25 },
  },
];
