
export class CharSlice {
    #set: Uint32Array;
    #offset: number;
    #length: number;

    constructor(set: Uint32Array, offset = 0, length?: number) {
        this.#set = set;
        this.#offset = offset;
        this.#length = length ?? set.length - offset;
    }

    get length(): number {
        return this.#length;
    }

    at(index: number) {
        return this.#set[this.#offset + index];
    }

    slice(start: number, end?: number): CharSlice {
        const next = this.#offset + start;
        if (end === undefined) {
            end = this.#set.length - next;
        }

        if (start < 0 || end < 0 || start > this.length || end > this.length || start > end) {
            throw new Error("Invalid slice");
        }

        return new CharSlice(this.#set, next, end);
    }

    startsWith(other: CharSlice | Uint32Array | string): boolean {
        if (typeof other === "string") {
            if (other.length > this.#length) {
                return false;
            }

            for (let i = 0; i < other.length; i++) {
                if (this.#set[this.#offset + i] !== other.codePointAt(i)) {
                    return false;
                }
            }

            return true;
        }

        if (other instanceof Uint32Array) {
            if (other.length > this.#length) {
                return false;
            }

            for (let i = 0; i < other.length; i++) {
                if (this.#set[this.#offset + i] !== other[i]) {
                    return false;
                }
            }

            return true;
        }

        if (other.length > this.#length) {
            return false;
        }

        for (let i = 0; i < other.length; i++) {
            if (this.#set[this.#offset + i] !== other.at(i)) {
                return false;
            }
        }

        return true;
    }

    indexOf(other: CharSlice | Uint32Array | string, fromIndex = 0): number {
        if (typeof other === "string") {
            for(let i = fromIndex; i < this.#length; i++) {
                if (this.#set[this.#offset + i] === other.codePointAt(0)) {
                    let j = 1;
                    while (j < other.length && this.#set[this.#offset + i + j] === other.codePointAt(j)) {
                        j++;
                    }

                    if (j === other.length) {
                        return i;
                    }
                }
            }

            return -1;
        }

        if (other instanceof Uint32Array) {
            for (let i = fromIndex; i < this.#length; i++) {
                if (this.#set[this.#offset + i] === other[0]) {
                    let j = 1;
                    while (j < other.length && this.#set[this.#offset + i + j] === other[j]) {
                        j++;
                    }

                    if (j === other.length) {
                        return i;
                    }
                }
            }

            return -1;
        }

        for (let i = fromIndex; i < this.#length; i++) {
            if (this.#set[this.#offset + i] === other.at(0)) {
                let j = 1;
                while (j < other.length && this.#set[this.#offset + i + j] === other.at(j)) {
                    j++;
                }

                if (j === other.length) {
                    return i;
                }
            }
        }

        return -1;
    }


    equals(other: CharSlice | Uint32Array): boolean {
        if (other instanceof Uint32Array) {
            if (this.#length !== other.length) {
                return false;
            }

            for (let i = 0; i < this.#length; i++) {
                if (this.#set[this.#offset + i] !== other[i]) {
                    return false;
                }
            }

            return true;
        }

        if (this.#length !== other.length) {
            return false;
        }

        for (let i = 0; i < this.#length; i++) {
            if (this.#set[this.#offset + i] !== other.at(i)) {
                return false;
            }
        }

        return true;
    }

    toString(): string {
        return String.fromCodePoint(...this.#set.slice(this.#offset, this.#offset + this.#length));
    }

    [Symbol.iterator]() {
        return this.#set.slice(this.#offset, this.#offset + this.#length)[Symbol.iterator]();
    }
}