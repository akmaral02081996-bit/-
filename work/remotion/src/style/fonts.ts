import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const HEAD = "Oswald";
export const SUB = "Montserrat";

loadFont({ family: HEAD, url: staticFile("fonts/Oswald.ttf"), weight: "200 700" });
loadFont({ family: SUB, url: staticFile("fonts/Montserrat.ttf"), weight: "100 900" });
