/**
 * Represents an error information object.
 */
export interface ErrorInfo extends Record<string, unknown> {
    /**
     * The error message.
     */
    message: string;

    /**
     * The code that identifies the error. This is typically the error name.
     */
    code: string;

    /**
     * A descriptor for associated target for the error.
     */
    target?: string;

    /**
     * The inner error, if available. If `cause` is available and it
     * is an instance of `Error`, then it is converted to an error information object.
     */
    innerError?: ErrorInfo;

    /**
     * Additional details about the error. This is typically used for aggregate errors.
     */
    details?: ErrorInfo[];

    /**
     * A link to help documentation.
     */
    link?: string;
}

/***
 * Represents an argument error information object.
 */
export interface ArgumentErrorInfo extends ErrorInfo {
    /**
     * The name of the invalid argument.
     */
    name: string;
}

/**
 * A stack frame in the stack trace.
 */
export interface StackFrame {
    /**
     * The name of the function, if available.
     */
    functionName?: string;

    /**
     * The name of the file, if available.
     */
    fileName?: string;

    /**
     * The line number in the file, if available.
     */
    lineNumber?: number;

    /**
     * The column number in the file, if available.
     */
    columnNumber?: number;
}

/**
 * The options for creating an enhanced error.
 */
export interface EnhancedErrorOptions extends ErrorOptions {
    /**
     * The descriptor for the associated target for the error.
     */
    target?: string;

    /**
     * A link to help documentation.
     */
    link?: string;

    /**
     * The message of the error.
     */
    message?: string;
}

/**
 * The options for creating an argument error.
 */
export interface ArgumentErrorOptions extends EnhancedErrorOptions {
    /**
     * The name of the invalid argument.
     */
    name: string;
}

/**
 * The options for creating an argument range error.
 */
export interface ArgumentRangeErrorOptions extends ArgumentErrorOptions {
    /**
     * The value that is out of range.
     */
    value?: unknown;
}

export interface ResponseErrorOptions extends EnhancedErrorOptions {
    /**
     * The URL of the request.
     */
    url?: string;

    /**
     * The HTTP method of the request.
     */
    method?: string;

    /**
     * The HTTP status code of the response.
     */
    status?: number;

    /**
     * The HTTP status text of the response.
     */
    statusText?: string;

    /**
     * The headers of the request.
     */
    headers?: Record<string, string | undefined>;
}

/**
 * Represents an error information object for a request error.
 *
 * The headers are not included in the error information object
 * because they may contain sensitive information.
 */
export interface RespsonseErrorInfo extends ErrorInfo {
    /**
     * The URL of the request.
     */
    url?: string;

    /**
     * The HTTP method of the request.
     */
    method?: string;

    /**
     * The HTTP status code of the response.
     */
    status?: number;

    /**
     * The HTTP status text of the response.
     */
    statusText?: string;
}
