# @gnome/runtime-constants

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

The runtime-constants module is helpful for JavaScript runtime detection
which is useful for writing compatability layers in modules for
different runtimes.

## Basic Usage

```typescript
import { RUNTIME, BUN, DENO, NODE, BROWSER, CLOUDFLARE } from "@gnome/runtime-constants";

console.log(RUNTIME);
console.log("bun", BUN);
console.log("deno", DENO);
console.log("node", NODE);
console.log("browser", BROWSER);
console.log("cloudflare", CLOUDFLARE);
```

[MIT License](./LICENSE.md)
