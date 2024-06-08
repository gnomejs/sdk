import { emptyDirSync } from "../empty-dir.ts";

try {
    emptyDirSync("fs/testdata/testfolder");
    console.log("success");
} catch (error) {
    console.log(error);
}
