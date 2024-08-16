
export interface CharacterSlice {
    at(index: number): number;
    set(index: number, value: number): void;
    length: number;
}

export interface CharSliceLike {
    at(index: number): number  | undefined;
    length: number;
}