import { err, ok } from "./result.ts";
import { assert as yes, assertEquals as equals, assertThrows as throws } from "@std/assert";

Deno.test("Result: ok", () => {
    const result = ok(42);
    yes(result.isOk);
    yes(result.unwrap() === 42);
});

Deno.test("Result: err", () => {
    const result = err("Error");
    yes(result.isError);
    yes(() => result.unwrap(), "Error");
});

Deno.test("Result: ok property", () => {
    const result = ok(42);
    yes(result.isOk);
    yes(result.ok().isSome);
    yes(result.ok().unwrap() === 42);
    yes(result.error().isNone);

    const other = err("Error");
    yes(other.isError);
    yes(() => other.unwrap(), "Error");
    yes(other.ok().isNone);
    yes(other.error().isSome);
});

Deno.test("Result: and", () => {
    const result = ok(42);
    const other = ok(43);
    yes(result.and(other).unwrap() === 43);
});

Deno.test("Result: andThen", () => {
    const result = ok(42);
    const other = ok(43);
    yes(result.andThen(() => other).unwrap() === 43);
});

Deno.test("Result: or", () => {
    const result = ok(42);
    const other = ok(43);
    yes(result.or(other).unwrap() === 42);
});

Deno.test("Result: orElse", () => {
    const result = ok(42);
    const other = ok(43);
    yes(result.orElse(() => other).unwrap() === 42);
});

Deno.test("Result: expect", () => {
    const result = ok(42);
    equals(result.expect("Result is Error"), 42);

    const other = err("Error");

    throws(() => other.expect("Result is Error"), Error, "Result is Error");
});

Deno.test("Result: map", () => {
    const result = ok(42);
    const other = result.map((value) => value + 1);
    yes(other.unwrap() === 43);
});

Deno.test("Result: mapOr", () => {
    const result = ok(42);
    const other = result.mapOr(0, (value) => value + 1);
    yes(other === 43);

    const otherResult = err("Error");
    const otherOther = otherResult.mapOr(0, (value) => value + 1);
    yes(otherOther === 0);
});

Deno.test("Result: mapOrElse", () => {
    const result = ok(42);
    const other = result.mapOrElse(() => 0, (value) => value + 1);
    yes(other === 43);

    const otherResult = err("Error");
    const otherOther = otherResult.mapOrElse(() => 0, (value) => value + 1);
    yes(otherOther === 0);
});

Deno.test("Result: mapError", () => {
    const result = err("Error");
    const other = result.mapError((error) => error + "!");
    yes(other.unwrapError() === "Error!");
});

Deno.test("Result: mapErrorOr", () => {
    const result = err("Error");
    const other = result.mapErrorOr("Default", (error) => error + "!");
    yes(other === "Error!");

    const otherResult = ok(42);
    const otherOther = otherResult.mapErrorOr("Default", (error) => error + "!");
    yes(otherOther === "Default");
});

Deno.test("Result: mapErrorOrElse", () => {
    const result = err("Error");
    const other = result.mapErrorOrElse(() => "Default", (error) => error + "!");
    yes(other === "Error!");

    const otherResult = ok(42);
    const otherOther = otherResult.mapErrorOrElse(() => "Default", (error) => error + "!");
    yes(otherOther === "Default");
});

Deno.test("Result: inspect", () => {
    let value = 0;
    const result = ok(42);
    result.inspect((v) => value = v);
    yes(value === 42);

    value = 0;
    const other = err("Error");
    other.inspect((v) => value = v);
    yes(value === 0);
});

Deno.test("Result: unwrap", () => {
    const result = ok(42);
    equals(result.unwrap(), 42);

    const other = err("Error");
    throws(() => other.unwrap(), Error, "Error");
});

Deno.test("Result: unwrapOr", () => {
    const result = ok(42);
    equals(result.unwrapOr(0), 42);

    const other = err<number, string>("Error");
    equals(other.unwrapOr(0), 0);
});

Deno.test("Result: unwrapOrElse", () => {
    const result = ok(42);
    equals(result.unwrapOrElse(() => 0), 42);

    const other = err<number, string>("Error");
    equals(other.unwrapOrElse(() => 0), 0);
});

Deno.test("Result: unwrapError", () => {
    const result = err("Error");
    equals(result.unwrapError(), "Error");

    const other = ok(42);
    throws(() => other.unwrapError(), Error, "Result is Ok");
});

Deno.test("Result: expectError", () => {
    const result = err("Error");
    equals(result.expectError("Result is Ok"), "Error");

    const other = ok(42);
    throws(() => other.expectError("Result is Ok"), Error, "Result is Ok");
});
