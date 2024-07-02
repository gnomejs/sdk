import { SystemError } from "@gnome/errors";

export class MissingSymbolError extends SystemError {
    constructor(public symbol: string, public library: string) {
        super(`Symbol ${symbol} not found in library ${library}`);
    }
}
