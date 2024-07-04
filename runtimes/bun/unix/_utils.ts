export function toCString(buf: Uint8Array): string {
    const n = buf.indexOf(0);
    if (n < 0) {
        return new TextDecoder().decode(buf);
    }
    return new TextDecoder().decode(buf.subarray(0, n));
}
