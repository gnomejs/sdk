import { ArgumentRangeError } from "@gnome/errors/argument-range-error"

export class Slice<T> implements Iterable<T> {
    #set: Array<T>;
    #offset: number;
    #length: number;

    constructor(set: Array<T>, offset = 0, length?: number) {
        this.#set = set;
        if (offset < 0 || offset >= set.length) {
            throw new ArgumentRangeError("offset", offset);
        }

        length = length ?? set.length - offset;
        if (length < 0 || offset + length > set.length) {
            throw new ArgumentRangeError("length", length);
        }

        this.#offset = offset;
        this.#length = length ?? set.length - offset;
    }
 
    get length(): number {
        return this.#length;
    }

    at(index: number): T {
        if (index < 0 || index >= this.#length) {
            throw new ArgumentRangeError("index", index);
        }
        return this.#set[this.#offset + index];
    }

    indexOf(value: T): number {
        const set = this.#set;
        const offset = this.#offset;
        const length = this.#length;
        for (let i = 0; i < length; i++) {
            if (set[offset + i] === value) {
                return i;
            }
        }
        return -1;
    }

    slice(start: number, end?: number): Slice<T> {
        
        if (start < 0 || start >= this.#length) {
            throw new ArgumentRangeError("start", start);
        }

        const offset = start + this.#offset;
        if (end === undefined) {
            end = this.#length - offset;
        }      
        return new Slice(this.#set, offset, end);
    }


    find(predicate: (value: T, index: number, set: Array<T>) => boolean): T | undefined {
        const set = this.#set;
        const offset = this.#offset;
        const length = this.#length;
        
        for (let i = 0; i < length; i++) {
            if (predicate(set[offset + i], i, set)) {
                return set[offset + i];
            }
        }
        return undefined;
    }

    findIndex(predicate: (value: T, index: number, set: Array<T>) => boolean): number {
        const set = this.#set;
        const offset = this.#offset;
        const length = this.#length;
        
        this.#set.sort
        for (let i = 0; i < length; i++) {
            if (predicate(set[offset + i], i, set)) {
                return i;
            }
        }
        return -1;
    }


    includes(value: T): boolean {
        return this.indexOf(value) !== -1;
    }

    [Symbol.iterator](): Iterator<T> {
        
        let index = 0;
        const set = this.#set;
        const offset = this.#offset;
        const length = this.#length;
        return {
            next(): IteratorResult<T> {
                if (index < length) {
                    return { done: false, value: set[offset + index++] };
                }
                return { done: true, value: undefined };
            }
        };
    }

}