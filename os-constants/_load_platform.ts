import { ARCH, PLATFORM } from "./mod.ts";

console.log(`${PLATFORM}_${ARCH}`); // "darwin" on MacOS, "linux" on Linux, "windows" on Windows, etc.
