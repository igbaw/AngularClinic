import { ZodSchema, ZodOptional, z } from 'zod';

type UnionToIntersection<Union> = (Union extends unknown ? (distributedUnion: Union) => void : never) extends (mergedIntersection: infer Intersection) => void ? Intersection & Union : never;
type RequiredKeysOf<BaseType extends object> = Exclude<{
    [Key in keyof BaseType]: BaseType extends Record<Key, BaseType[Key]> ? Key : never;
}[keyof BaseType], undefined>;
type HasRequiredKeys<BaseType extends object> = RequiredKeysOf<BaseType> extends never ? false : true;
/**
 * this function will return a json response and
 * infers the type of the body
 */
declare const json: <T>(body: T, option?: {
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    /**
     * this body will take precedence over the body in the options if both are provided.
     * This is useful if you want to return body without inferring the type.
     */
    body?: any;
}) => {
    response: {
        body: any;
        status: number;
        statusText: string;
        headers: Record<string, string> | undefined;
    };
    body: T;
    _flag: "json";
};

type Cookie = Record<string, string>;
type SignedCookie = Record<string, string | false>;
type PartitionCookieConstraint = {
    partition: true;
    secure: true;
} | {
    partition?: boolean;
    secure?: boolean;
};
type SecureCookieConstraint = {
    secure: true;
};
type HostCookieConstraint = {
    secure: true;
    path: "/";
    domain?: undefined;
};
type CookieOptions = {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    secure?: boolean;
    signingSecret?: string;
    sameSite?: "Strict" | "Lax" | "None" | "strict" | "lax" | "none";
    partitioned?: boolean;
    prefix?: CookiePrefixOptions;
} & PartitionCookieConstraint;
type CookiePrefixOptions = "host" | "secure";
type CookieConstraint<Name> = Name extends `__Secure-${string}` ? CookieOptions & SecureCookieConstraint : Name extends `__Host-${string}` ? CookieOptions & HostCookieConstraint : CookieOptions;
declare const parse: (cookie: string, name?: string) => Cookie;
declare const parseSigned: (cookie: string, secret: string | BufferSource, name?: string) => Promise<SignedCookie>;
declare const serialize: <Name extends string>(name: Name, value: string, opt?: CookieConstraint<Name>) => string;
declare const serializeSigned: (name: string, value: string, secret: string | BufferSource, opt?: CookieOptions) => Promise<string>;

declare function getBody(request: Request): Promise<any>;
declare function shouldSerialize(body: any): boolean;
declare const statusCode: {
    OK: number;
    CREATED: number;
    ACCEPTED: number;
    NO_CONTENT: number;
    MULTIPLE_CHOICES: number;
    MOVED_PERMANENTLY: number;
    FOUND: number;
    SEE_OTHER: number;
    NOT_MODIFIED: number;
    TEMPORARY_REDIRECT: number;
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    PAYMENT_REQUIRED: number;
    FORBIDDEN: number;
    NOT_FOUND: number;
    METHOD_NOT_ALLOWED: number;
    NOT_ACCEPTABLE: number;
    PROXY_AUTHENTICATION_REQUIRED: number;
    REQUEST_TIMEOUT: number;
    CONFLICT: number;
    GONE: number;
    LENGTH_REQUIRED: number;
    PRECONDITION_FAILED: number;
    PAYLOAD_TOO_LARGE: number;
    URI_TOO_LONG: number;
    UNSUPPORTED_MEDIA_TYPE: number;
    RANGE_NOT_SATISFIABLE: number;
    EXPECTATION_FAILED: number;
    "I'M_A_TEAPOT": number;
    MISDIRECTED_REQUEST: number;
    UNPROCESSABLE_ENTITY: number;
    LOCKED: number;
    FAILED_DEPENDENCY: number;
    TOO_EARLY: number;
    UPGRADE_REQUIRED: number;
    PRECONDITION_REQUIRED: number;
    TOO_MANY_REQUESTS: number;
    REQUEST_HEADER_FIELDS_TOO_LARGE: number;
    UNAVAILABLE_FOR_LEGAL_REASONS: number;
    INTERNAL_SERVER_ERROR: number;
    NOT_IMPLEMENTED: number;
    BAD_GATEWAY: number;
    SERVICE_UNAVAILABLE: number;
    GATEWAY_TIMEOUT: number;
    HTTP_VERSION_NOT_SUPPORTED: number;
    VARIANT_ALSO_NEGOTIATES: number;
    INSUFFICIENT_STORAGE: number;
    LOOP_DETECTED: number;
    NOT_EXTENDED: number;
    NETWORK_AUTHENTICATION_REQUIRED: number;
};

type Status = keyof typeof statusCode;
declare class APIError extends Error {
    status: Status;
    body: Record<string, any>;
    constructor(status: Status, body?: Record<string, any>);
}

interface EndpointOptions {
    /**
     * Request Method
     */
    method: Method | Method[];
    /**
     * Body Schema
     */
    body?: ZodSchema;
    /**
     * Query Schema
     */
    query?: ZodSchema;
    /**
     * If true headers will be required to be passed in the context
     */
    requireHeaders?: boolean;
    /**
     * If true request object will be required
     */
    requireRequest?: boolean;
    /**
     * List of endpoints that will be called before this endpoint
     */
    use?: Endpoint[];
    /**
     * Endpoint metadata
     */
    metadata?: Record<string, any>;
}
type Endpoint<Handler extends (ctx: any) => Promise<any> = (ctx: any) => Promise<any>, Option extends EndpointOptions = EndpointOptions> = {
    path: string;
    options: Option;
    headers?: Headers;
} & Handler;
type InferParamPath<Path> = Path extends `${infer _Start}:${infer Param}/${infer Rest}` ? {
    [K in Param | keyof InferParamPath<Rest>]: string;
} : Path extends `${infer _Start}:${infer Param}` ? {
    [K in Param]: string;
} : Path extends `${infer _Start}/${infer Rest}` ? InferParamPath<Rest> : undefined;
type InferParamWildCard<Path> = Path extends `${infer _Start}/*:${infer Param}/${infer Rest}` | `${infer _Start}/**:${infer Param}/${infer Rest}` ? {
    [K in Param | keyof InferParamPath<Rest>]: string;
} : Path extends `${infer _Start}/*` ? {
    [K in "_"]: string;
} : Path extends `${infer _Start}/${infer Rest}` ? InferParamPath<Rest> : undefined;
type Prettify<T> = {
    [key in keyof T]: T[key];
} & {};
type ContextTools = {
    /**
     * the current path
     */
    path: string;
    /**
     * Set header
     *
     * If it's called outside of a request it will just be ignored.
     */
    setHeader: (key: string, value: string) => void;
    /**
     * cookie setter.
     *
     * If it's called outside of a request it will just be ignored.
     */
    setCookie: (key: string, value: string, options?: CookieOptions) => void;
    /**
     * Get cookie value
     *
     * If it's called outside of a request it will just be ignored.
     */
    getCookie: (key: string, prefix?: CookiePrefixOptions) => string | undefined;
    /**
     * Set signed cookie
     */
    setSignedCookie: (key: string, value: string, secret: string | BufferSource, options?: CookieOptions) => Promise<void>;
    /**
     * Get signed cookie value
     */
    getSignedCookie: (key: string, secret: string, prefix?: CookiePrefixOptions) => Promise<string | undefined>;
    /**
     * Redirect to url
     */
    redirect: (url: string) => APIError;
    /**
     * json response helper
     */
    json: typeof json;
    /**
     * internal flags
     */
    _flag?: string;
    /**
     * response header
     */
    responseHeader: Headers;
};
type Context<Path extends string, Opts extends EndpointOptions> = InferBody<Opts> & InferParam<Path> & InferMethod<Opts["method"]> & InferHeaders<Opts> & InferRequest<Opts> & InferQuery<Opts["query"]>;
type InferUse<Opts extends EndpointOptions["use"]> = Opts extends Endpoint[] ? {
    context: UnionToIntersection<Awaited<ReturnType<Opts[number]>>>;
} : {};
type InferUseOptions<Opts extends EndpointOptions> = Opts["use"] extends Array<infer U> ? UnionToIntersection<U extends Endpoint ? U["options"] : {
    body?: {};
    requireRequest?: boolean;
    requireHeaders?: boolean;
}> : {
    body?: {};
    requireRequest?: boolean;
    requireHeaders?: boolean;
};
type InferMethod<M extends Method | Method[]> = M extends Array<Method> ? {
    method: M[number];
} : {
    method?: M;
};
type InferHeaders<Opt extends EndpointOptions, HeaderReq = Opt["requireHeaders"]> = HeaderReq extends true ? {
    headers: Headers;
} : InferUseOptions<Opt>["requireHeaders"] extends true ? {
    headers: Headers;
} : {
    headers?: Headers;
};
type InferRequest<Opt extends EndpointOptions, RequestReq = Opt["requireRequest"]> = RequestReq extends true ? {
    request: Request;
} : InferUseOptions<Opt>["requireRequest"] extends true ? {
    request: Request;
} : {
    request?: Request;
};
type InferQuery<Query> = Query extends ZodSchema ? Query extends ZodOptional<any> ? {
    query?: z.infer<Query>;
} : {
    query: z.infer<Query>;
} : {
    query?: undefined;
};
type InferParam<Path extends string, ParamPath extends InferParamPath<Path> = InferParamPath<Path>, WildCard extends InferParamWildCard<Path> = InferParamWildCard<Path>> = ParamPath extends undefined ? WildCard extends undefined ? {
    params?: Record<string, string>;
} : {
    params: WildCard;
} : {
    params: Prettify<ParamPath & (WildCard extends undefined ? {} : WildCard)>;
};
type EndpointBody = Record<string, any> | string | boolean | number | void | undefined | null | unknown;
type EndpointResponse = {
    response: {
        status?: number;
        statusText?: string;
        headers?: Headers;
        body: any;
    };
    body: EndpointBody;
    _flag: "json";
} | EndpointBody;
type Handler<Path extends string, Opts extends EndpointOptions, R extends EndpointResponse> = (ctx: Prettify<Context<Path, Opts> & InferUse<Opts["use"]> & Omit<ContextTools, "_flag">>) => Promise<R>;
type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "*";
type InferBody<Opts extends EndpointOptions, Body extends ZodSchema | undefined = Opts["body"] & (undefined extends InferUseOptions<Opts>["body"] ? {} : InferUseOptions<Opts>["body"])> = Body extends ZodSchema ? Body extends ZodOptional<any> ? {
    body?: Prettify<z.infer<Body>>;
} : {
    body: Prettify<z.infer<Body>>;
} : {
    body?: undefined;
};

interface RouterConfig {
    /**
     * Throw error if error occurred other than APIError
     */
    throwError?: boolean;
    /**
     * Handle error
     */
    onError?: (e: unknown) => void | Promise<void> | Response | Promise<Response>;
    /**
     * Base path for the router
     */
    basePath?: string;
    /**
     * Middlewares for the router
     */
    routerMiddleware?: {
        path: string;
        middleware: Endpoint;
    }[];
    extraContext?: Record<string, any>;
    onResponse?: (res: Response) => any | Promise<any>;
    onRequest?: (req: Request) => any | Promise<any>;
}
declare const createRouter: <E extends Record<string, Endpoint>, Config extends RouterConfig>(endpoints: E, config?: Config) => {
    handler: (request: Request) => Promise<Response>;
    endpoints: E;
};
type Router = ReturnType<typeof createRouter>;

export { APIError as A, type Context as C, type Endpoint as E, type HasRequiredKeys as H, type InferUse as I, type Method as M, type Prettify as P, type Router as R, type SignedCookie as S, type UnionToIntersection as U, type EndpointOptions as a, type EndpointResponse as b, type ContextTools as c, type Handler as d, type InferBody as e, type InferRequest as f, type InferHeaders as g, type InferUseOptions as h, type CookiePrefixOptions as i, type CookieOptions as j, createRouter as k, getBody as l, statusCode as m, type InferParamPath as n, type InferParamWildCard as o, type InferMethod as p, type InferQuery as q, type InferParam as r, shouldSerialize as s, type EndpointBody as t, type Cookie as u, type CookieConstraint as v, parse as w, parseSigned as x, serialize as y, serializeSigned as z };
