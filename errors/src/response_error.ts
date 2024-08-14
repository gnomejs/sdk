import type { ErrorInfo, ResponseErrorOptions, RespsonseErrorInfo } from "./abstractions.ts";
import { errorInfo } from "./error_info.ts";

export class ResponseError extends Error {
    constructor(request: Request);
    constructor(message: string);
    constructor(options: ResponseErrorOptions);
    constructor();
    constructor() {
        let message: string | undefined;
        let options: ResponseErrorOptions | undefined;

        if (arguments.length === 1) {
            if (arguments[0] instanceof Response) {
                const response = arguments[0];
                options = {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                    method: response.url,
                    headers: Array.from(response.headers.entries()).reduce((acc, [key, value]) => {
                        acc[key] = value;
                        return acc;
                    }, {} as Record<string, string | undefined>),
                };
                message = `Request failed with ${response.status} ${response.statusText}`;
            } else if (typeof arguments[0] === "string") {
                message = arguments[0];
                options = { message };
            } else {
                options = arguments[0];
                message = options?.message;
            }
        } else {
            options = {};
        }

        options!.message ??= `Request failed with ${options?.status} ${options?.statusText}.`;
        super(options?.message, options);
        this.name = "ResponseError";
        this.status = options?.status;
        this.statusText = options?.statusText;
        this.url = options?.url;
        this.method = options?.method;
        this.headers = options?.headers;
        this.target = options?.target;
        this.link = options?.link ?? "https://jsr.io/@gnome/errors/doc/response-error/~/ResponseError";
    }

    target?: string;

    link?: string;

    url?: string;

    status?: number;

    statusText?: string;

    method?: string;

    headers?: Record<string, string | undefined>;

    /**
     * Converts the error to an object that can be serialized.
     * @returns The error as a plain object.
     *
     * @example
     * ```ts
     * import { ResponseError } from "@gnome/errors/response-error";
     *
     * try {
     *    throw new ResponseError("Request failed with 404 Not Found.");
     * } catch (error) {
     *    console.log(error.toObject());
     * }
     * ```
     */
    toObject(): RespsonseErrorInfo {
        let innerError: ErrorInfo | undefined = undefined;
        if (this.cause instanceof Error) {
            innerError = errorInfo(this.cause);
        }

        return {
            message: this.message,
            code: this.name,
            stack: this.stack,
            innerError: innerError,
            target: this.target,
            status: this.status,
            statusText: this.statusText,
            url: this.url,
            method: this.method,
            link: this.link,
        };
    }
}
