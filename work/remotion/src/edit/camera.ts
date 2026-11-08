import analysis from "../data/analysis.json";
import { Easing, interpolate } from "remotion";
import { SHOTS, Shot } from "./data";

type Face = [number, number, number, number];
const faces = analysis.faces as Face[];
const ridge = analysis.ridge as [number, number[]][];

// Сглаженное положение лица: среднее по окну ±0.45 с (камера «плывёт», а не дёргается)
export const faceAt = (t: number) => {
  let sx = 0, sy = 0, w = 0;
  for (const [ft, x, y] of faces) {
    const d = Math.abs(ft - t);
    if (d > 0.45) continue;
    const k = 1 - d / 0.45;
    sx += x * k; sy += y * k; w += k;
  }
  if (!w) {
    const n = faces.reduce((a, b) => (Math.abs(b[0] - t) < Math.abs(a[0] - t) ? b : a));
    return { x: n[1], y: n[2] };
  }
  return { x: sx / w, y: sy / w };
};

export const ridgeAt = (t: number): number[] => {
  let i = 0;
  while (i < ridge.length - 2 && ridge[i + 1][0] <= t) i++;
  const [t0, a] = ridge[i];
  const [t1, b] = ridge[i + 1];
  const k = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
  return a.map((v, c) => v + (b[c] - v) * k);
};

const EASE = {
  out: Easing.out(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
  fastOut: Easing.out(Easing.exp),
};

export const shotAt = (t: number): Shot => SHOTS.find((s) => t >= s.from && t < s.to) ?? SHOTS[SHOTS.length - 1];

// Камера: зум + центр. Возвращает transform для «мира» 1080×1920.
export const cameraAt = (t: number) => {
  const s = shotAt(t);
  const p = (t - s.from) / (s.to - s.from);
  let zoom = interpolate(p, [0, 1], [s.z0, s.z1], { easing: EASE[s.ease ?? "out"], extrapolateRight: "clamp" });
  // «толчок» на склейке: 0.12 с лёгкого перелёта
  const kick = Math.max(0, 1 - (t - s.from) / 0.12);
  zoom *= 1 + 0.035 * kick * kick;
  const f = faceAt(t);
  const faceY = s.faceY ?? 1000;
  let cx = f.x;
  let cy = f.y - (faceY - 960) / zoom;
  const hw = 540 / zoom, hh = 960 / zoom;
  cx = Math.min(1080 - hw, Math.max(hw, cx));
  cy = Math.min(1920 - hh, Math.max(hh, cy));
  return { zoom, cx, cy, transform: `translate(540px, 960px) scale(${zoom}) translate(${-cx}px, ${-cy}px)` };
};
