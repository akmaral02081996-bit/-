// Ролик №2 (стиль «спокойный, дорогой»): только казахский, белый + кремовый.
// Времена — по голосу (work/words2.json).
import { Shot } from "../edit/data";

export const FPS = 60;
export const DURATION = 24.79;

export const SHOTS: Shot[] = [
  { from: 0, to: 2.5, z0: 2.4, z1: 1.9, faceY: 760, ease: "fastOut" },
  { from: 2.5, to: 5.45, z0: 1.8, z1: 1.9, faceY: 760 },
  { from: 5.45, to: 7.6, z0: 1.6, z1: 1.0, faceY: 700, ease: "inOut" },
  { from: 7.6, to: 8.9, z0: 1.0, z1: 1.06, faceY: 700 },
  { from: 8.9, to: 11.6, z0: 1.7, z1: 1.8, faceY: 760 },
  { from: 11.6, to: 14.3, z0: 2.3, z1: 2.4, faceY: 720 },
  { from: 14.3, to: 15.28, z0: 1.5, z1: 1.55, faceY: 740 },
  { from: 15.28, to: 16.06, z0: 1.8, z1: 1.85, faceY: 740 },
  { from: 16.06, to: 16.82, z0: 2.1, z1: 2.15, faceY: 740 },
  { from: 16.82, to: 17.9, z0: 2.4, z1: 2.5, faceY: 740 },
  { from: 17.9, to: 19.8, z0: 1.4, z1: 1.0, faceY: 700, ease: "inOut" },
  { from: 19.8, to: 22.4, z0: 1.8, z1: 1.9, faceY: 760 },
  { from: 22.4, to: DURATION, z0: 2.0, z1: 1.0, faceY: 700, ease: "inOut" },
];

export type Item =
  | { kind: "head"; text: string; at: number; size: number; y: number; x?: number; cream?: boolean }
  | { kind: "script"; text: string; at: number; size: number; y: number; x?: number; dur?: number }
  | { kind: "num"; n: string; at: number; text: string[] }
  | { kind: "words"; words: [string, number][]; y: number; until?: number };

export type Block = { from: number; to: number; items: Item[] };

export const BLOCKS: Block[] = [
  { from: 0.0, to: 2.5, items: [
    { kind: "words", words: [["негізі", 0.02], ["мен", 0.54]], y: 1300, until: 0.7 },
    { kind: "head", text: "ОҚЫРМАНДАРЫМ", at: 0.7, size: 96, y: 1150 },
    { kind: "head", text: "[әріптестерім]", at: 1.64, size: 80, y: 1262 },
  ] },
  { from: 2.5, to: 5.45, items: [
    { kind: "words", words: [["идея", 2.52], ["айтыңызшы", 2.7]], y: 1480, until: 3.38 },
    { kind: "head", text: "ИДЕЯНЫ", at: 3.38, size: 120, y: 1140 },
    { kind: "head", text: "?", at: 3.62, size: 120, y: 1140, x: 700, cream: true },
    { kind: "head", text: "[қайдан аласыз]", at: 3.78, size: 82, y: 1272 },
    { kind: "words", words: [["деп", 4.5], ["сұрап жатады", 4.86]], y: 1480 },
  ] },
  { from: 5.45, to: 7.6, items: [
    { kind: "words", words: [["менің", 5.76]], y: 1480, until: 6.06 },
    { kind: "script", text: "идея алатын жерім", at: 6.06, size: 74, y: 1170, x: 110, dur: 0.75 },
    { kind: "head", text: "ОСЫНДАЙ", at: 7.0, size: 150, y: 1250, cream: true },
  ] },
  { from: 7.6, to: 8.9, items: [
    { kind: "head", text: "[тауларға]", at: 7.68, size: 104, y: 300 },
    { kind: "script", text: "келіп осылай", at: 8.24, size: 74, y: 430, x: 330, dur: 0.5 },
  ] },
  { from: 8.9, to: 11.6, items: [
    { kind: "words", words: [["таза", 8.92], ["ауада", 9.14], ["серуендеп", 9.3], ["демалып", 10.16]], y: 1400, until: 10.5 },
    { kind: "script", text: "миыма", at: 10.5, size: 80, y: 1150, x: 110, dur: 0.3 },
    { kind: "head", text: "[тыныштық]", at: 10.78, size: 112, y: 1250, cream: true },
    { kind: "words", words: [["беремін", 11.12]], y: 1420 },
  ] },
  { from: 11.6, to: 14.3, items: [
    { kind: "head", text: "МҰҒАЛІМДЕР", at: 11.84, size: 104, y: 1140 },
    { kind: "words", words: [["білмеймін", 12.16], ["бір", 12.38], ["тыныштықты", 12.52], ["жақсы", 13.06], ["көретін", 13.3], ["сияқтымыз", 13.58]], y: 1330 },
  ] },
  { from: 14.3, to: 15.28, items: [
    { kind: "words", words: [["солай", 14.4], ["мен", 14.76], ["өзімнің", 14.92]], y: 1400 },
  ] },
  { from: 15.28, to: 16.06, items: [{ kind: "num", n: "1", at: 15.28, text: ["жұмысыма"] }] },
  { from: 16.06, to: 16.82, items: [{ kind: "num", n: "2", at: 16.06, text: ["мектептегі", "жұмыстарыма"] }] },
  { from: 16.82, to: 17.9, items: [
    { kind: "num", n: "3", at: 16.82, text: ["блогыма"] },
    { kind: "script", text: "шабыттанамын", at: 17.34, size: 70, y: 1420, x: 250, dur: 0.5 },
  ] },
  { from: 17.9, to: 19.8, items: [
    { kind: "head", text: "КЕРЕМЕТ", at: 18.0, size: 140, y: 1140 },
    { kind: "head", text: "[таза ауада демалу]", at: 18.84, size: 66, y: 1290 },
    { kind: "words", words: [["жақсы", 19.46], ["көремін", 19.64]], y: 1440 },
  ] },
  { from: 19.8, to: 22.4, items: [
    { kind: "words", words: [["әттең", 19.86], ["сабағым", 20.14], ["негізі", 20.52], ["биыл", 20.78]], y: 1400, until: 20.96 },
    { kind: "head", text: "[бірінші сынып]", at: 20.96, size: 88, y: 1200, cream: true },
    { kind: "script", text: "таңертең", at: 21.64, size: 80, y: 1330, x: 360, dur: 0.45 },
  ] },
  { from: 22.4, to: DURATION, items: [
    { kind: "words", words: [["әйтпесе", 22.44]], y: 1400, until: 23.2 },
    { kind: "head", text: "КҮНДЕ", at: 23.2, size: 124, y: 1120 },
    { kind: "head", text: "ТАҢЕРТЕҢ", at: 23.38, size: 124, y: 1240, cream: true },
    { kind: "script", text: "келіп жүрер едім", at: 23.82, size: 72, y: 1385, x: 190, dur: 0.8 },
  ] },
];
