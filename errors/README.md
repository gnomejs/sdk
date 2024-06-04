# @gnome/errors

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

All errors in @gnome will inherit from `SystemError`

The errors module extends the built-in Error class to provide
additional functionality such as:

- `toObject()` method to convert an error to JSON
   object.
- `set()` method to set multiple properties of the error.
- `stackTrace` property to get the stack trace as an array of strings.
- `code` property to get or set the error code.
- `target` property to get or set the target of the error
   such as the name of the method that threw the error.

The module also provides a number of error classes that extend
and utility functions to work with errors:

- `collect()` function to collect all the errors from an error object.
- `walk()` function to walk through an error and its inner errors.
- `printError()` function to print an error to the console.

## Basic Usage

```typescript
import { SystemError } from '@gnome/errors'

try {
   throw new SystemError("message");
} catch (e) {
   console.log(e.stackTrace)
   console.log(e.code)
}

```

[MIT License](./LICENSE.md)
