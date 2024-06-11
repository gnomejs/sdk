# Gnome SDK

The gnome SDK provides cross runtime modules for javascript/typescript
with a focus automation and the backend.  The SDK builds on top of
Deno's standard ("STD") library.

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Modules

- [ansi](./ansi/README.md)
- [char](./char/README.md)
- [ci-piplines](./ci-pipelines/README.md)
- [env](./env/README.md)
- [errors](./errors/README.md)
- [exec](./exec/README.md)
- [fs](./fs/README.md)
- [optional](./optional/README.md)
- [os-constants](./os-constants/README.md)
- [random](./random/README.md)
- [runtime-constants](./runtime-constants/README.md)
- [secrets](./secrets/README.md)
- [strings](./strings/README.md)

## Road to 1.0

The modules will stay below 1.0 until the public API surface
area is stable and there are no plans for major breaking changes.

Since JSR and deno modules in general tend to be immutable, you may
use older versions of the modules until there a need to upgrade them.

Releasing the modules as 1.0 will need additional infrastructure
for testing the modules across different runtimes and detailed
documentation.

The all gnome modules should hit compatibility with runtimes other
than Deno where it makes sense. To handle other runtimes such as bun, node
browers or cloudflare, runtime specific files should be loaded
dynamically during execution.

## Why Deno

Deno's capabilities to import remote files, compile, all-in-one
tooling, sandboxing capabilities, and foreign function interface ("FFI") support
makes it a strong candidate for automation.

The FFI does not require gyp or writing native code.  While bun
is faster, it lacks the native ESM remote import and instead relies on packages.

## LICENSE

Unless otherwise noted @gnome code is released under the [MIT license](./LICENSE.md).
