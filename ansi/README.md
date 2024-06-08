# @gnome/ansi

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

The `ansi` module provides color detection, writing ansi
codes, and an ansi writer.

The module relies upon the @gnome/exec module and
has the same basic usage as the `Command` class.

The code for the ansi.ts is from deno @std/fmt/color.ts
and is in under the MIT license from deno.

## Basic Usage

```typescript
import { blue, writer, bgBlue, bold, apply } from "@gnome/ansi";

writer.info("An informational message");
writer.writeLine(blue("My message"));

writer.writeLine(apply("Multiple Styles", bgBlue, bold));
```

[MIT License](./LICENSE.md)
