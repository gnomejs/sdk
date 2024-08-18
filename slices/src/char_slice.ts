import { ArgumentRangeError } from "@gnome/errors/argument-range-error";
import { isSpace, toLower, toUpper } from "@gnome/chars";
import { equalFold } from "./equal_fold.ts";
import { toCharSliceLike } from "./to_char_array.ts";
import type { CharSliceLike } from "./types.ts";
import { endsWithFold } from "./ends_with_fold.ts";
import { startsWithFold } from "./starts_with_fold.ts";
import { indexOfFold } from "./index_of_fold.ts";

/** */
export class ReadOnlyCharSlice {
    #buffer: Uint32Array;
    #start: number;
    #end: number;

    constructor(buffer: Uint32Array, start = 0, end?: number) {
        this.#buffer = buffer;
        this.#start = start;
        this.#end = end ?? buffer.length - start;
    }

    get length(): number {
        return this.#end;
    }

    get isEmpty(): boolean {
        return this.length === 0;
    }

    static fromString(s: string): ReadOnlyCharSlice {
        const buffer = new Uint32Array(s.length);
        for (let i = 0; i < s.length; i++) {
            buffer[i] = s.codePointAt(i) ?? 0;
        }
        return new ReadOnlyCharSlice(buffer);
    }

    at(index: number): number {
        if (index < 0 || index >= this.#end) {
            throw new ArgumentRangeError("index", index);
        }
        return this.#buffer[this.#start + index];
    }

    forEach(callback: (value: number, index: number) => void): this {
        for (let i = 0; i < this.length; i++) {
            callback(this.#buffer[this.#start + i], i);
        }

        return this;
    }

    map(callback: (value: number, index: number) => number): ReadOnlyCharSlice {
        const buffer = new Uint32Array(this.length);
        for (let i = 0; i < this.length; i++) {
            buffer[i] = callback(this.#buffer[this.#start + i], i);
        }

        return new ReadOnlyCharSlice(buffer);
    }

    captialize(): ReadOnlyCharSlice {
        const buffer = new Uint32Array(this.length);
        buffer.set(this.#buffer, this.#start);
        buffer[0] = toUpper(buffer[0]);
        return new ReadOnlyCharSlice(buffer);
    }

    includes(value: number | string | CharSliceLike, index = 0) : boolean {
        return this.indexOf(value, index) !== -1;
    }

    includesFold(value: CharSliceLike | string, index = 0) : boolean {
        return this.indexOfFold(value, index) !== -1;
    }

    indexOf(value: number | string | CharSliceLike, index = 0) : number {
        if (index < 0 || index >= this.length) {
            throw new ArgumentRangeError("index", index);
        }

        if (typeof value === "number") {
            if (!Number.isInteger(value) && value < 0 && value > 0x10FFFF) {
                throw new RangeError("Invalid code point");
            }

            for (let i = index; i < this.length; i++) {
                if (this.#buffer[this.#start + i] === value) {
                    return i;
                }
            }

            return -1;
        }

        if (typeof value === "string") {
            value = toCharSliceLike(value);
        }

        let f = 0;
        let i = index;
        for (; i < this.length; i++) {
            if (this.#buffer[this.#start + i] === value.at(f)) {
                f++;
                if (f === value.length) {
                    return i - f + 1;
                }
            } else {
                f = 0;
            }
        }

        return -1;
    }

    indexOfFold(value: CharSliceLike | string, index = 0) : number {
        if (index < 0 || index >= this.length) {
            throw new ArgumentRangeError("index", index);
        }

        if (typeof value === "string") {
            value = toCharSliceLike(value);
        }

        return indexOfFold(this, value, index);
    }

    equals(other: CharSlice | Uint32Array | string) : boolean {
        let get: (index: number) => number;
        if (this.length !== other.length) {
            return false;
        }

        if (other instanceof CharSlice) {
            get = other.at.bind(other);
        } else if (other instanceof Uint32Array) {
            get = (index: number) => other[index];
        } else {
            get = (index: number) => other.codePointAt(index) ?? -1;
        }

        for (let i = 0; i < this.length; i++) {
            if (this.#buffer[this.#start + i] !== get(i)) {
                return false;
            }
        }

        return true;
    }

    equalsFold(other: CharSliceLike | string) : boolean {
        if (this.length !== other.length) {
            return false;
        }

        if (typeof other === "string") {
            other === toCharSliceLike(other);
        }

        return equalFold(this, other as CharSliceLike);
    }

    endsWith(suffix: CharSliceLike | string): boolean {
        if (this.length < suffix.length) {
            return false;
        }

        if (typeof suffix === "string") {
            suffix = toCharSliceLike(suffix);
        }

        for (let i = 0; i < suffix.length; i++) {
            if (this.#buffer[this.#start + this.length - suffix.length + i] !== suffix.at(i)) {
                return false;
            }
        }

        return true;
    }

    endsWithFold(suffix: CharSliceLike | string): boolean {
        if (this.length < suffix.length) {
            return false;
        }

        if (typeof suffix === "string") {
            suffix = toCharSliceLike(suffix);
        }

        return endsWithFold(this, suffix as CharSliceLike);
    }

    slice(start = 0, end = this.length): ReadOnlyCharSlice {
        if (start < 0 || start >= this.length) {
            throw new ArgumentRangeError("start", start);
        }

        if (end < 0 || end > this.length) {
            throw new ArgumentRangeError("end", end);
        }

        return new ReadOnlyCharSlice(this.#buffer, this.#start + start, this.#start + end);
    }

    startsWith(prefix: CharSliceLike | string): boolean {
        if (this.length < prefix.length) {
            return false;
        }

        if (typeof prefix === "string") {
            prefix = toCharSliceLike(prefix);
        }

        for (let i = 0; i < prefix.length; i++) {
            if (this.#buffer[this.#start + i] !== prefix.at(i)) {
                return false;
            }
        }

        return true;
    }

    startsWithFold(prefix: CharSliceLike | string): boolean {
        if (this.length < prefix.length) {
            return false;
        }

        if (typeof prefix === "string") {
            prefix = toCharSliceLike(prefix);
        }

        return startsWithFold(this, prefix as CharSliceLike);
    }

    /**
     * Returns new `CharSlice` that has lower characters
     * @returns a new charslices with all lower characters.
     */
    get toLower(): ReadOnlyCharSlice {
        const buffer = new Uint32Array(this.length);

        let i = 0;
        for (let j = this.#start; j < this.#end; j++) {
            buffer[i++] = toLower(this.#buffer[j]);
        }

        return new ReadOnlyCharSlice(buffer);
    }

    get toUpper(): ReadOnlyCharSlice {
        const buffer = new Uint32Array(this.length);

        let i = 0;
        for (let j = this.#start; j < this.#end; j++) {
            buffer[i++] = toLower(this.#buffer[j]);
        }

        return new ReadOnlyCharSlice(buffer);
    }

    trimStartSpace(): ReadOnlyCharSlice {
        let start = this.#start;
        const end = this.#end;
        while (start < end && isSpace(this.#buffer[start])) {
            start++;
        }

        return new ReadOnlyCharSlice(this.#buffer, start, end);
    }

    trimStartChar(c: number): ReadOnlyCharSlice {
        let start = this.#start;
        const end = this.#end;
        while (start < end && this.#buffer[start] === c) {
            start++;
        }

        return new ReadOnlyCharSlice(this.#buffer, start, end);
    }

    trimStartSlice(t: CharSliceLike): ReadOnlyCharSlice {
        let start = this.#start;
        const end = this.#end;
        while (start < end) {
            let match = false;
            for (let i = 0; i < t.length; i++) {
                if (this.#buffer[start] === t.at(i)) {
                    start++;
                    match = true;
                    break;
                }
            }

            if (!match) {
                break;
            }
        }

        return new ReadOnlyCharSlice(this.#buffer, start, end);
    }

    trimStart(t?: CharSliceLike): ReadOnlyCharSlice {
        if (t === undefined) {
            return this.trimStartSpace();
        }

        if (t.length === 1) {
            return this.trimStartChar(t.at(0) ?? -1);
        }

        return this.trimStartSlice(t);
    }

    trimEndSpace(): ReadOnlyCharSlice {
        const start = this.#start;
        let end = this.#end;
        while (start < end && isSpace(this.#buffer[end - 1])) {
            end--;
        }

        return new ReadOnlyCharSlice(this.#buffer, start, end);
    }

    trimEndChar(c: number): ReadOnlyCharSlice {
        const start = this.#start;
        let end = this.#end;
        while (start < end && this.#buffer[end - 1] === c) {
            end--;
        }

        return new ReadOnlyCharSlice(this.#buffer, start, end);
    }

    trimEndSlice(t: CharSliceLike): ReadOnlyCharSlice {
        const start = this.#start;
        let end = this.#end;
        while (start < end) {
            let match = false;
            for (let i = 0; i < t.length; i++) {
                if (this.#buffer[end - 1] === t.at(i)) {
                    end--;
                    match = true;
                    break;
                }
            }

            if (!match) {
                break;
            }
        }

        return new ReadOnlyCharSlice(this.#buffer, start, end);
    }

    trimEnd(t?: CharSliceLike): ReadOnlyCharSlice {
        if (t === undefined) {
            return this.trimEndSpace();
        }

        if (t.length === 1) {
            return this.trimEndChar(t.at(0) ?? -1);
        }

        return this.trimEndSlice(t);
    }

    trimSpace(): ReadOnlyCharSlice {
        let start = this.#start;
        let end = this.#end;
        while (start < end && isSpace(this.#buffer[start])) {
            start++;
        }

        while (start < end && isSpace(this.#buffer[end - 1])) {
            end--;
        }

        return new ReadOnlyCharSlice(this.#buffer, start, end);
    }

    trimChar(c: number): ReadOnlyCharSlice {
        let start = this.#start;
        let end = this.#end;
        while (start < end && this.#buffer[start] === c) {
            start++;
        }

        while (start < end && this.#buffer[end - 1] === c) {
            end--;
        }

        return new ReadOnlyCharSlice(this.#buffer, start, end);
    }

    trimSlice(t: CharSliceLike): ReadOnlyCharSlice {
        let start = this.#start;
        let end = this.#end;
        while (start < end) {
            let match = false;
            for (let i = 0; i < t.length; i++) {
                if (this.#buffer[start] === t.at(i)) {
                    start++;
                    match = true;
                    break;
                }
            }

            if (!match) {
                break;
            }
        }

        while (start < end) {
            let match = false;
            for (let i = 0; i < t.length; i++) {
                if (this.#buffer[end - 1] === t.at(i)) {
                    end--;
                    match = true;
                    break;
                }
            }

            if (!match) {
                break;
            }
        }

        return new ReadOnlyCharSlice(this.#buffer, start, end);
    }

    trim(t?: CharSliceLike): ReadOnlyCharSlice {
        if (t === undefined) {
            return this.trimSpace();
        }

        if (t.length === 1) {
            return this.trimChar(t.at(0) ?? -1);
        }

        return this.trimSlice(t);
    }

    toString() : string {
        return String.fromCodePoint(...this.#buffer.slice(this.#start, this.#end));
    }
}

export class CharSlice {
    #buffer: Uint32Array;
    #start: number;
    #end: number;

    constructor(buffer: Uint32Array, start = 0, end?: number) {
        this.#buffer = buffer;
        this.#start = start;
        this.#end = end ?? buffer.length - start;
    }

    get length(): number {
        return this.#end;
    }

    get isEmpty(): boolean {
        return this.length === 0;
    }

    static fromString(s: string): CharSlice {
        const buffer = new Uint32Array(s.length);
        for (let i = 0; i < s.length; i++) {
            buffer[i] = s.codePointAt(i) ?? 0;
        }
        return new CharSlice(buffer);
    }

    at(index: number): number {
        if (index < 0 || index >= this.#end) {
            throw new ArgumentRangeError("index", index);
        }
        return this.#buffer[this.#start + index];
    }

    set(index: number, value: number) {
        if (index < 0 || index >= this.#end) {
            throw new ArgumentRangeError("index", index);
        }
        this.#buffer[this.#start + index] = value;
    }

    forEach(callback: (value: number, index: number) => void): this {
        for (let i = 0; i < this.length; i++) {
            callback(this.#buffer[this.#start + i], i);
        }

        return this;
    }

    map(callback: (value: number, index: number) => number): this {
        for (let i = 0; i < this.length; i++) {
            this.#buffer[i] = callback(this.#buffer[this.#start + i], i);
        }

        return this;
    }

    replace(index: number, value: string | CharSliceLike): this {
        if (index < 0 || index >= this.#end) {
            throw new ArgumentRangeError("index", index);
        }

        if (typeof value === "string") {
            value = toCharSliceLike(value);
        }

        if (index + value.length > this.#end) {
            throw new ArgumentRangeError("value", value);
        }

        for (let i = 0; i < value.length; i++) {
            this.#buffer[this.#start + index + i] = value.at(i) ?? 0;
        }

        return this;
    }

    captialize(): this {
        this.#buffer[this.#start] = toUpper(this.#buffer[this.#start]);

        for (let i = this.#start + 1; i < this.#end; i++) {
            this.#buffer[i] = toLower(this.#buffer[i]);
        }

        return this;
    }

    findIndex(predicate: (value: number, index: number, set: Uint32Array) => boolean): number {
        for (let i = 0; i < this.length; i++) {
            if (predicate(this.#buffer[this.#start + i], i, this.#buffer)) {
                return i;
            }
        }
        return -1;
    }

    includes(value: number | string | CharSliceLike, index = 0) : boolean {
        return this.indexOf(value, index) !== -1;
    }

    includesFold(value: CharSliceLike | string, index = 0) : boolean {
        return this.indexOfFold(value, index) !== -1;
    }

    indexOf(value: number | string | CharSliceLike, index = 0) : number {
        if (index < 0 || index >= this.length) {
            throw new ArgumentRangeError("index", index);
        }

        if (typeof value === "number") {
            if (!Number.isInteger(value) && value < 0 && value > 0x10FFFF) {
                throw new RangeError("Invalid code point");
            }

            for (let i = index; i < this.length; i++) {
                if (this.#buffer[this.#start + i] === value) {
                    return i;
                }
            }

            return -1;
        }

        if (typeof value === "string") {
            value = toCharSliceLike(value);
        }

        let f = 0;
        let i = index;
        for (; i < this.length; i++) {
            if (this.#buffer[this.#start + i] === value.at(f)) {
                f++;
                if (f === value.length) {
                    return i - f + 1;
                }
            } else {
                f = 0;
            }
        }

        return -1;
    }

    indexOfFold(value: CharSliceLike | string, index = 0) : number {
        if (index < 0 || index >= this.length) {
            throw new ArgumentRangeError("index", index);
        }

        if (typeof value === "string") {
            value = toCharSliceLike(value);
        }

        return indexOfFold(this, value, index);
    }

    lastIndexOf(value: number | string | CharSliceLike, index = 0) : number {
        if (index < 0 || index >= this.length) {
            throw new ArgumentRangeError("index", index);
        }

        if (typeof value === "number") {
            if (!Number.isInteger(value) && value < 0 && value > 0x10FFFF) {
                throw new RangeError("Invalid code point");
            }

            for (let i = this.length - 1; i >= index; i--) {
                if (this.#buffer[this.#start + i] === value) {
                    return i;
                }
            }

            return -1;
        }

        if (typeof value === "string") {
            value = toCharSliceLike(value);
        }

        let f = 0;
        let i = this.length - 1;
        for (; i >= index; i--) {
            if (this.#buffer[this.#start + i] === value.at(f)) {
                f++;
                if (f === value.length) {
                    return i - f + 1;
                }
            } else {
                f = 0;
            }
        }

        return -1;
    }

    equals(other: CharSlice | Uint32Array | string) : boolean {
        let get: (index: number) => number;
        if (this.length !== other.length) {
            return false;
        }

        if (other instanceof CharSlice) {
            get = other.at.bind(other);
        } else if (other instanceof Uint32Array) {
            get = (index: number) => other[index];
        } else {
            get = (index: number) => other.codePointAt(index) ?? -1;
        }

        for (let i = 0; i < this.length; i++) {
            if (this.#buffer[this.#start + i] !== get(i)) {
                return false;
            }
        }

        return true;
    }

    equalsFold(other: CharSliceLike | string) : boolean {
        if (this.length !== other.length) {
            return false;
        }

        if (typeof other === "string") {
            other === toCharSliceLike(other);
        }

        return equalFold(this, other as CharSliceLike);
    }

    endsWith(suffix: CharSliceLike | string): boolean {
        if (this.length < suffix.length) {
            return false;
        }

        if (typeof suffix === "string") {
            suffix = toCharSliceLike(suffix);
        }

        for (let i = 0; i < suffix.length; i++) {
            if (this.#buffer[this.#start + this.length - suffix.length + i] !== suffix.at(i)) {
                return false;
            }
        }

        return true;
    }

    endsWithFold(suffix: CharSliceLike | string): boolean {
        if (this.length < suffix.length) {
            return false;
        }

        if (typeof suffix === "string") {
            suffix = toCharSliceLike(suffix);
        }

        return endsWithFold(this, suffix as CharSliceLike);
    }

    slice(start = 0, end = this.length): CharSlice {
        if (start < 0 || start >= this.length) {
            throw new ArgumentRangeError("start", start);
        }

        if (end < 0 || end > this.length) {
            throw new ArgumentRangeError("end", end);
        }

        return new CharSlice(this.#buffer, this.#start + start, this.#start + end);
    }

    startsWith(prefix: CharSliceLike | string): boolean {
        if (this.length < prefix.length) {
            return false;
        }

        if (typeof prefix === "string") {
            prefix = toCharSliceLike(prefix);
        }

        for (let i = 0; i < prefix.length; i++) {
            if (this.#buffer[this.#start + i] !== prefix.at(i)) {
                return false;
            }
        }

        return true;
    }

    startsWithFold(prefix: CharSliceLike | string): boolean {
        if (this.length < prefix.length) {
            return false;
        }

        if (typeof prefix === "string") {
            prefix = toCharSliceLike(prefix);
        }

        return startsWithFold(this, prefix as CharSliceLike);
    }

    toArray(): Uint32Array {
        return this.#buffer.slice(this.#start, this.#end);
    }

    /**
     * Returns new `CharSlice` that has lower characters
     * @returns a new charslices with all lower characters.
     */
    toLower(): this {
        for (let j = this.#start; j < this.#end; j++) {
            this.#buffer[j] = toLower(this.#buffer[j]);
        }

        return this;
    }

    toUpper(): this {
        for (let j = this.#start; j < this.#end; j++) {
            this.#buffer[j] = toLower(this.#buffer[j]);
        }

        return this;
    }

    trimStartSpace(): CharSlice {
        let start = this.#start;
        const end = this.#end;
        while (start < end && isSpace(this.#buffer[start])) {
            start++;
        }

        return new CharSlice(this.#buffer, start, end);
    }

    trimStartChar(c: number): CharSlice {
        let start = this.#start;
        const end = this.#end;
        while (start < end && this.#buffer[start] === c) {
            start++;
        }

        return new CharSlice(this.#buffer, start, end);
    }

    trimStartSlice(t: CharSliceLike | string): CharSlice {
        if (typeof t === "string") {
            t = toCharSliceLike(t);
        }

        let start = this.#start;
        const end = this.#end;
        while (start < end) {
            let match = false;
            for (let i = 0; i < t.length; i++) {
                if (this.#buffer[start] === t.at(i)) {
                    start++;
                    match = true;
                    break;
                }
            }

            if (!match) {
                break;
            }
        }

        return new CharSlice(this.#buffer, start, end);
    }

    trimStart(t?: CharSliceLike | string): CharSlice {
        if (t === undefined) {
            return this.trimStartSpace();
        }

        if (t.length === 1) {
            if (typeof t === "string") {
                t = toCharSliceLike(t);
            }

            return this.trimStartChar(t.at(0) ?? -1);
        }

        return this.trimStartSlice(t);
    }

    trimEndSpace(): CharSlice {
        const start = this.#start;
        let end = this.#end;
        while (start < end && isSpace(this.#buffer[end - 1])) {
            end--;
        }

        return new CharSlice(this.#buffer, start, end);
    }

    trimEndChar(c: number): CharSlice {
        const start = this.#start;
        let end = this.#end;
        while (start < end && this.#buffer[end - 1] === c) {
            end--;
        }

        return new CharSlice(this.#buffer, start, end);
    }

    trimEndSlice(t: CharSliceLike | string): CharSlice {
        if (typeof t === "string") {
            t = toCharSliceLike(t);
        }

        const start = this.#start;
        let end = this.#end;
        while (start < end) {
            let match = false;
            for (let i = 0; i < t.length; i++) {
                if (this.#buffer[end - 1] === t.at(i)) {
                    end--;
                    match = true;
                    break;
                }
            }

            if (!match) {
                break;
            }
        }

        return new CharSlice(this.#buffer, start, end);
    }

    trimEnd(t?: CharSliceLike | string): CharSlice {
        if (t === undefined) {
            return this.trimEndSpace();
        }

        if (t.length === 1) {
            if (typeof t === "string") {
                t = toCharSliceLike(t);
            }

            return this.trimEndChar(t.at(0) ?? -1);
        }

        return this.trimEndSlice(t);
    }

    trimSpace(): CharSlice {
        let start = this.#start;
        let end = this.#end;
        while (start < end && isSpace(this.#buffer[start])) {
            start++;
        }

        while (start < end && isSpace(this.#buffer[end - 1])) {
            end--;
        }

        return new CharSlice(this.#buffer, start, end);
    }

    trimChar(c: number): CharSlice {
        let start = this.#start;
        let end = this.#end;
        while (start < end && this.#buffer[start] === c) {
            start++;
        }

        while (start < end && this.#buffer[end - 1] === c) {
            end--;
        }

        return new CharSlice(this.#buffer, start, end);
    }

    trimSlice(t: CharSliceLike | string): CharSlice {
        if (typeof t === "string") {
            t = toCharSliceLike(t);
        }

        let start = this.#start;
        let end = this.#end;
        while (start < end) {
            let match = false;
            for (let i = 0; i < t.length; i++) {
                if (this.#buffer[start] === t.at(i)) {
                    start++;
                    match = true;
                    break;
                }
            }

            if (!match) {
                break;
            }
        }

        while (start < end) {
            let match = false;
            for (let i = 0; i < t.length; i++) {
                if (this.#buffer[end - 1] === t.at(i)) {
                    end--;
                    match = true;
                    break;
                }
            }

            if (!match) {
                break;
            }
        }

        return new CharSlice(this.#buffer, start, end);
    }

    trim(t?: CharSliceLike | string): CharSlice {
        if (t === undefined) {
            return this.trimSpace();
        }

        if (t.length === 1) {
            if (typeof t === "string") {
                t = toCharSliceLike(t);
            }
            return this.trimChar(t.at(0) ?? -1);
        }

        return this.trimSlice(t);
    }

    toString() : string {
        return String.fromCodePoint(...this.#buffer.slice(this.#start, this.#end));
    }
}
