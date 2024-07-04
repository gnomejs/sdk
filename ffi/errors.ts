import { SystemError } from "@gnome/errors";

/**
 * Represents an error that occurs when a symbol is missing in a library.
 */
export class MissingSymbolError extends SystemError {
    /**
     * Creates a new instance of the MissingSymbolError class.
     * @param symbol The name of the missing symbol.
     * @param library The name of the library where the symbol is missing.
     */
    constructor(public symbol: string, public library: string) {
        super(`Symbol ${symbol} not found in library ${library}`);
    }
}
