# @gnome/ci-pipelines

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

The `ci-pipelines` module providers a writer that helps with
writing to stdout within pipelines and includes special logic
for github actions and azure devops.

The `CI` variable returns true when running in a pipeline. The
`CI_PROVIDER` returns the current ci/cd application such as
github, gitlab, azdo, drone, local, etc.

## Basic Usage

```typescript
import { writer } from "@gnome/ci-pipelines";

writer.debug("debug");
writer.info("info");
writer.warn("warn");
writer.error("error");
writer.progress("progress", 10);
writer.progress("progress", 100);
writer.writeLine();
writer.command("az", ["login"]);
writer.success("success");
writer.startGroup("group");
writer.writeLine(" within group");
writer.endGroup();
console.log(writer.interactive);
```

[MIT License](./LICENSE.md)
