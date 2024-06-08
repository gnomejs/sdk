# @gnome/optional

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

The optional module provides the types `Option<T>` and `Result<T, E>`.

## Basic Usage

```typescript
import { ok, err, some, none } from "@gnome/optional";

const r = ok(10);
console.log(r.isOk);
console.log(r.isError);

console.log(r.map((v) => v.toString()))

const o1 = none<number>();
console.log(o1.isSome);
console.log(o1.isNone);

const o = some(10);
console.log(o.isSome);
console.log(o.isNone);

```

[MIT License](./LICENSE.md)
