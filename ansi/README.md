# @gnome/ansi

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

The `ansi` module provides color detection, writing ansi
codes, and an ansi writer.

## Basic Usage

```typescript
import { blue, ansiWriter, bgBlue, green, bold, apply } from "@gnome/ansi";


ansiWriter.write("Hello, World!").writeLine();
ansiWriter.debug("Hello, World!");
ansiWriter.info("Hello, World!");
ansiWriter.success("Hello, World!");
ansiWriter.writeLine(apply("Hello, World!", bold, green, bgBlue) + " test");
writer.info("An informational message");
writer.writeLine(blue("My message"));
writer.writeLine(apply("Multiple Styles", bgBlue, bold));
```

## License

[MIT License](./LICENSE.md) and code from other sources
are detailed in the [License File](./LICENSE.md)
