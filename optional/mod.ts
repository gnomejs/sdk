/**
 * The optional module provides the types `Option<T>` and `Result<T, E>`.
 * The functions `some`, `none`, and `from` are provided to create `Option<T>` instances.
 * The functions `ok`, `err`, and `from` are provided to create `Result<T, E>` instances.
 *
 * ## Basic Usage
 *
 * ```typescript
 * import { ok, err, some, none } from "@gnome/optional";
 *
 * const r = ok(10);
 * console.log(r.isOk);
 * console.log(r.isError);
 *
 * console.log(r.map((v) => v.toString()))
 *
 * const o1 = none<number>();
 * console.log(o1.isSome);
 * console.log(o1.isNone);
 *
 * const o = some(10);
 * console.log(o.isSome);
 * console.log(o.isNone);
 *
 * ```
 *
 * @module
 */

export * from "./option.ts";
export * from "./result.ts";
