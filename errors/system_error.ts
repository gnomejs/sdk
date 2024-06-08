/**
 * Represents an inner error.
 */
export interface InnerError extends Record<string, unknown> {
    /**
     * The error message.
     */
    readonly message?: string;

    /**
     * The error code.
     */
    readonly code?: string;

    /**
     * The inner error.
     */
    readonly innerError?: InnerError;
}

/**
 * Represents the properties of an error.
 */
export interface ErrorProps extends InnerError {
    /**
     * The target of the error.
     */
    readonly target?: string;

    /**
     * Additional details about the error.
     */
    details?: ErrorProps[];
}

function from(e: Error): SystemError {
    if (e instanceof globalThis.AggregateError) {
        return SystemAggregateError.from(e);
    }

    const exception = new SystemError(e.message, e.cause);
    exception.stack = e.stack;
    return exception;
}

/**
 * Represents an aggregate error that contains multiple errors.
 */
export class SystemAggregateError extends AggregateError implements ErrorProps {
    #innerError?: SystemError;
    #code?: string;

    #target?: string;

    /**
     * The link to the documentation for the error.
     */
    link?: string | URL;

    #stackLines?: string[];

    /**
     * The errors that occurred.
     */
    errors: SystemError[];

    /**
     * Creates a new instance of the AggregateError class.
     * @param message - The error message.
     * @param errors - The errors that occurred.
     * @param innerError - The inner error.
     */
    constructor(message?: string, errors?: SystemError[], innerError?: Error) {
        super(message ?? "One or more errors occurred.");
        this.name = "AggregateError";
        this.errors = errors ?? [];
        if (innerError) {
            this.#innerError = from(innerError);
        }
    }

    [key: string]: unknown;

    /**
     * The error code.
     */
    get code(): string | undefined {
        return this.#code ?? this.name;
    }

    set code(value: string | undefined) {
        this.#code = value;
    }

    /**
     * The target of the error. Often used to store the
     * name of the method that threw the error.
     */
    get target(): string | undefined {
        return this.#target;
    }

    set target(value: string | undefined) {
        this.#target = value;
    }

    /**
     * The inner error.
     */
    get innerError(): InnerError | undefined {
        return this.#innerError;
    }

    /**
     * Sets the properties of the error.
     * @param props The properties to set.
     * @returns The error instance.
     */
    set(props: Partial<this>): this {
        for (const [key, value] of Object.entries(props)) {
            if (key === "name" || key === "stack") {
                continue;
            }

            if (Object.hasOwn(this, key)) {
                // @ts-ignore. between the Partial and Object.hasOwn, this is a valid property
                this[key] = value;
            }
        }

        return this;
    }

    set stack(value: string | undefined) {
        this.#stackLines = undefined;
        super.stack = value;
    }

    /**
     * The stack trace of the error. This is a read-only property
     * that removes the message and only returns the stack trace
     * as an array of strings.
     */
    get stackTrace(): string[] {
        if (!this.#stackLines) {
            if (this.stack) {
                this.#stackLines = this.stack.split("\n").map((line) => line.trim())
                    .filter((o) => o.startsWith("at "));
            } else {
                this.#stackLines = [];
            }
        }

        return this.#stackLines;
    }

    set stackTrace(value: string[]) {
        this.#stackLines = value;
        super.stack = value.join("\n");
    }

    /**
     * Converts the error to an object.
     * @returns The error as an object.
     */
    toObject(): ErrorProps {
        return {
            message: this.message,
            code: this.code,
            target: this.target,
            innerError: this.#innerError?.toObject(),
            details: this.errors.map((o) => o.toObject()),
        };
    }

    /**
     * Creates an AggregateError instance from an existing AggregateError.
     * @param error - The existing AggregateError instance.
     * @returns A new AggregateError instance.
     */
    static from(error: globalThis.AggregateError): SystemAggregateError {
        return new SystemAggregateError(
            error.message,
            error.errors.map((o) => from(o)),
            error,
        );
    }
}

/**
 * Represents a system error.
 * Extends the built-in Error class.
 */
export class SystemError extends Error implements ErrorProps {
    override name = "SystemError";
    #innerError?: SystemError;
    #code?: string;

    #target?: string;

    /**
     * The link to the documentation for the error.
     */
    link?: string | URL;

    #stackLines?: string[];

    constructor(message: string, innerError?: Error | unknown) {
        super(message);

        this.cause = innerError;
        if (innerError === undefined) {
            return;
        }

        if (this.cause instanceof SystemError) {
            this.#innerError = this.cause;
            return;
        }

        if (this.cause instanceof Error) {
            this.#innerError = from(this.cause);
        }
    }

    [key: string]: unknown;

    /**
     * The error code.
     */
    get code(): string | undefined {
        return this.#code ?? this.name;
    }

    set code(value: string | undefined) {
        this.#code = value;
    }

    /**
     * The target of the error. Often used to store the
     * name of the method that threw the error.
     */
    get target(): string | undefined {
        return this.#target;
    }

    set target(value: string | undefined) {
        this.#target = value;
    }

    /**
     * The inner error.
     */
    get innerError(): InnerError | undefined {
        return this.#innerError;
    }

    /**
     * Sets the properties of the error.
     * @param props The properties to set.
     * @returns The error instance.
     */
    set(props: Partial<this>): this {
        for (const [key, value] of Object.entries(props)) {
            if (key === "name" || key === "stack") {
                continue;
            }

            if (Object.hasOwn(this, key)) {
                // @ts-ignore. between the Partial and Object.hasOwn, this is a valid property
                this[key] = value;
            }
        }

        return this;
    }

    set stack(value: string | undefined) {
        this.#stackLines = undefined;
        super.stack = value;
    }

    /**
     * The stack trace of the error. This is a read-only property
     * that removes the message and only returns the stack trace
     * as an array of strings.
     */
    get stackTrace(): string[] {
        if (!this.#stackLines) {
            if (this.stack) {
                this.#stackLines = this.stack.split("\n").map((line) => line.trim())
                    .filter((o) => o.startsWith("at "));
            } else {
                this.#stackLines = [];
            }
        }

        return this.#stackLines;
    }

    set stackTrace(value: string[]) {
        this.#stackLines = value;
        super.stack = value.join("\n");
    }

    /**
     * Converts the error to an object.
     * @returns The error as an object.
     */
    toObject(): ErrorProps {
        return {
            message: this.message,
            code: this.code,
            target: this.target,
            innerError: this.#innerError?.toObject(),
        };
    }
}
