import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const SANS = "Montserrat";
export const SERIF = "Playfair Display";
export const SCRIPT = "Bad Script";

loadFont({ family: SANS, url: staticFile("fonts/Montserrat.ttf"), weight: "100 900" });
loadFont({ family: SERIF, url: staticFile("fonts/PlayfairDisplay.ttf"), weight: "400 900" });
loadFont({ family: SCRIPT, url: staticFile("fonts/BadScript.ttf"), weight: "400" });

export const P = {
  white: "#FFFFFF",
  cream: "#EAD9BF", // тёплый бежевый акцент
};
export const SHADOW = "0 2px 4px rgba(0,0,0,0.25), 0 6px 24px rgba(0,0,0,0.35)";
