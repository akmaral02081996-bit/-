/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { existsSync } from "fs";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// 3D (three.js): программный WebGL, работает и без видеокарты.
Config.setChromiumOpenGlRenderer("swangle");

// Облачная среда Claude Code: используем предустановленный браузер,
// т.к. скачивание браузера Remotion там заблокировано. На своём компьютере
// этого файла нет — Remotion скачает браузер сам.
const LOCAL_SHELL =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (existsSync(LOCAL_SHELL)) {
  Config.setBrowserExecutable(LOCAL_SHELL);
}
