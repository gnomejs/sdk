/**
 * ## Overview
 *
 * The `ci-pipelines` module provides a plWriter for
 * writing to stdout within pipelines and includes special logic
 * for github actions and azure devops to handle logging commands.
 *
 * The `CI` variable returns true when running in a pipeline. The
 * `CI_PROVIDER` returns the current ci/cd application such as
 * github, gitlab, azdo, drone, local, etc.
 *
 * ## Basic Usage
 *
 * ```typescript
 * import { plWriter } from "@gnome/ci-pipelines";
 *
 * plWriter.debug("debug");
 * plWriter.info("info");
 * plWriter.warn("warn");
 * plWriter.error("error");
 * plWriter.progress("progress", 10);
 * plWriter.progress("progress", 100);
 * plWriter.writeLine();
 * plWriter.command("az", ["login"]);
 * plWriter.success("success");
 * plWriter.startGroup("group");
 * plWriter.writeLine(" within group");
 * plWriter.endGroup();
 * console.log(plWriter.interactive);
 * ```
 *
 * [MIT License](./LICENSE.md)
 */
export * from "./ci.ts";
export * from "./writer.ts";
