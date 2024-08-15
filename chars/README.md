# @gnome/chars

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

In JavaScript, characters are represented as codes or code points returned
by the string `charCodeAt` and `codePointAt` functions.

The char module provides functions to evaluate characters (integers)
such as `isLetter`, `isLetterAt`, `isDigit`, `isWhitespace`,
`isUpper`, `isLower`.

## Basic Usage

```typescript
import { 
    isUpperAt, 
    isLowerAt, 
    isDigit, 
    isAscii, 
    isLatin1, 
    isSpaceAt
} from "@gnome/chars";

const str = "Hello, World 123";
console.log(isUpperAt(str, 0)); // true
console.log(isUpperAt(str, 1)); // false
console.log(isLowerAt(str, 1)); // false
console.log(isDigit(str, 1)); // false 
console.log(isDigit(str, 14)); // true

console.log(isAsciiAt("⇼", 0)); // false
console.log(isLatin1At("⇼", 0)); // false

const str2 = " \n\r\t"
console.log(isWhitespaceAt(str2, 0)); // true
console.log(isWhitespaceAt(str2, 1)); // true
console.log(isWhitespaceAt(str2, 2)); // true
console.log(isWhitespaceAt(str2, 3)); // true
```

## Notes

The overall goal for the char module to enable inspecting
characters and avoid string allocations where possible.



## License

[MIT License](./LICENSE.md) and the BSD style License
from [go](https://go.dev/LICENSE) as the updated version
of this library is adapted from go's unicode package.
