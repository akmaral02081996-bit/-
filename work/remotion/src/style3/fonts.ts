import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const SUBF = "Rubik"; // субтитры (округлый гротеск, есть казахские буквы)
export const TITLE = "Montserrat";
export const SCRIPT = "Bad Script";

loadFont({ family: SUBF, url: staticFile("fonts/Rubik.ttf"), weight: "300 900" });
loadFont({ family: TITLE, url: staticFile("fonts/Montserrat.ttf"), weight: "100 900" });
loadFont({ family: SCRIPT, url: staticFile("fonts/BadScript.ttf"), weight: "400" });

export const Y = {
  yellow: "#F6D67A", // заголовок и активное слово
  white: "#FFFFFF",
};
export const SH = "0 2px 6px rgba(0,0,0,0.35), 0 4px 18px rgba(0,0,0,0.3)";
