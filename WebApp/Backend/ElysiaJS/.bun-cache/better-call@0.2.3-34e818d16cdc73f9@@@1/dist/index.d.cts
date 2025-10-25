import { E as Endpoint, a as EndpointOptions, b as EndpointResponse, P as Prettify, C as Context, I as InferUse, c as ContextTools, H as HasRequiredKeys, M as Method, d as Handler, e as InferBody, f as InferRequest, g as InferHeaders, h as InferUseOptions, R as Router, i as CookiePrefixOptions, j as CookieOptions } from './router-DhpmtodN.cjs';
export { A as APIError, u as Cookie, v as CookieConstraint, t as EndpointBody, p as InferMethod, r as InferParam, n as InferParamPath, o as InferParamWildCard, q as InferQuery, S as SignedCookie, k as createRouter, l as getBody, w as parse, x as parseSigned, y as serialize, z as serializeSigned, s as shouldSerialize, m as statusCode } from './router-DhpmtodN.cjs';
import { IncomingMessage, ServerResponse } from 'node:http';
import 'zod';

interface EndpointConfig {
    /**
     * Throw when the response isn't in 200 range
     */
    throwOnError?: boolean;
}
declare function createEndpointCreator<E extends {
    use?: Endpoint[];
}>(opts?: E): <Path extends string, Opts extends EndpointOptions, R extends EndpointResponse>(path: Path, options: Opts, handler: (ctx: Prettify<Context<Path, Opts> & InferUse<Opts["use"]> & InferUse<E["use"]> & Omit<ContextTools, "_flag">>) => Promise<R>) => {
    (...ctx: HasRequiredKeys<Context<Path, Opts>> extends true ? [Context<Path, Opts>] : [(Context<Path, Opts> | undefined)?]): Promise<R extends {
        _flag: "json";
    } ? R extends {
        body: infer B;
    } ? B : null : Awaited<Awaited<R>>>;
    path: Path;
    options: Opts;
    method: Method | Method[];
    headers: Headers;
};
declare function createEndpoint<Path extends string, Opts extends EndpointOptions, R extends EndpointResponse>(path: Path, options: Opts, handler: Handler<Path, Opts, R>): {
    (...ctx: HasRequiredKeys<Context<Path, Opts>> extends true ? [Context<Path, Opts>] : [Context<Path, Opts>?]): Promise<R extends {
        _flag: "json";
    } ? R extends {
        body: infer B;
    } ? B : null : Awaited<Awaited<R>>>;
    path: Path;
    options: Opts;
    method: Method | Method[];
    headers: Headers;
};

type MiddlewareHandler<Opts extends EndpointOptions, R extends EndpointResponse, Extra extends Record<string, any> = {}> = (ctx: Prettify<InferBody<Opts> & InferRequest<Opts> & InferHeaders<Opts> & {
    params?: Record<string, string>;
    query?: Record<string, string>;
} & ContextTools> & Extra) => Promise<R>;
declare function createMiddleware<Opts extends EndpointOptions, R extends EndpointResponse>(optionsOrHandler: MiddlewareHandler<Opts, R>): Endpoint<Handler<string, Opts, R>, Opts>;
declare function createMiddleware<Opts extends Omit<EndpointOptions, "method">, R extends EndpointResponse>(optionsOrHandler: Opts, handler: MiddlewareHandler<Opts & {
    method: "*";
}, R>): Endpoint<Handler<string, Opts & {
    method: "*";
}, R>, Opts & {
    method: "*";
}>;
declare const createMiddlewareCreator: <E extends {
    use?: Endpoint[];
}>(opts?: E) => {
    <Opts extends EndpointOptions, R extends EndpointResponse>(optionsOrHandler: (ctx: InferBody<Opts, Opts["body"] & (undefined extends InferUseOptions<Opts>["body"] ? {} : InferUseOptions<Opts>["body"])> & InferUse<E["use"]> & InferRequest<Opts, Opts["requireRequest"]> & InferHeaders<Opts, Opts["requireHeaders"]> & {
        params?: Record<string, string>;
        query?: Record<string, string>;
    } & ContextTools extends infer T ? { [key in keyof T]: (InferBody<Opts, Opts["body"] & (undefined extends InferUseOptions<Opts>["body"] ? {} : InferUseOptions<Opts>["body"])> & InferUse<E["use"]> & InferRequest<Opts, Opts["requireRequest"]> & InferHeaders<Opts, Opts["requireHeaders"]> & {
        params?: Record<string, string>;
        query?: Record<string, string>;
    } & ContextTools)[key]; } : never) => Promise<R>): Endpoint<Handler<string, Opts, R>, Opts>;
    <Opts extends Omit<EndpointOptions, "method">, R_1 extends EndpointResponse>(optionsOrHandler: Opts, handler: (ctx: InferBody<Opts & {
        method: "*";
    }, (Opts & {
        method: "*";
    })["body"] & (undefined extends InferUseOptions<Opts & {
        method: "*";
    }>["body"] ? {} : InferUseOptions<Opts & {
        method: "*";
    }>["body"])> & InferUse<E["use"]> & InferRequest<Opts & {
        method: "*";
    }, (Opts & {
        method: "*";
    })["requireRequest"]> & InferHeaders<Opts & {
        method: "*";
    }, (Opts & {
        method: "*";
    })["requireHeaders"]> & {
        params?: Record<string, string>;
        query?: Record<string, string>;
    } & ContextTools extends infer T ? { [key in keyof T]: (InferBody<Opts & {
        method: "*";
    }, (Opts & {
        method: "*";
    })["body"] & (undefined extends InferUseOptions<Opts & {
        method: "*";
    }>["body"] ? {} : InferUseOptions<Opts & {
        method: "*";
    }>["body"])> & InferUse<E["use"]> & InferRequest<Opts & {
        method: "*";
    }, (Opts & {
        method: "*";
    })["requireRequest"]> & InferHeaders<Opts & {
        method: "*";
    }, (Opts & {
        method: "*";
    })["requireHeaders"]> & {
        params?: Record<string, string>;
        query?: Record<string, string>;
    } & ContextTools)[key]; } : never) => Promise<R_1>): Endpoint<Handler<string, Opts & {
        method: "*";
    }, R_1>, Opts & {
        method: "*";
    }>;
};
type Middleware<Opts extends EndpointOptions = EndpointOptions, R extends EndpointResponse = EndpointResponse> = (opts: Opts, handler: (ctx: {
    body?: InferBody<Opts>;
    params?: Record<string, string>;
    query?: Record<string, string>;
}) => Promise<R>) => Endpoint;

declare function getRequest({ request, base, bodySizeLimit, }: {
    base: string;
    bodySizeLimit?: number;
    request: IncomingMessage;
}): Request;
declare function setResponse(res: ServerResponse, response: Response): Promise<void>;

declare function toNodeHandler(handler: Router["handler"]): (req: IncomingMessage, res: ServerResponse) => Promise<void>;

declare const getCookie: (cookie: string, key: string, prefix?: CookiePrefixOptions) => string | undefined;
declare const setCookie: (header: Headers, name: string, value: string, opt?: CookieOptions) => void;
declare const setSignedCookie: (header: Headers, name: string, value: string, secret: string | BufferSource, opt?: CookieOptions) => Promise<void>;
declare const getSignedCookie: (header: Headers, secret: string, key: string, prefix?: CookiePrefixOptions) => Promise<string | false | undefined>;

export { Context, ContextTools, CookieOptions, CookiePrefixOptions, Endpoint, type EndpointConfig, EndpointOptions, EndpointResponse, Handler, InferBody, InferHeaders, InferRequest, InferUse, InferUseOptions, Method, type Middleware, type MiddlewareHandler, Prettify, Router, createEndpoint, createEndpointCreator, createMiddleware, createMiddlewareCreator, getCookie, getRequest, getSignedCookie, setCookie, setResponse, setSignedCookie, toNodeHandler };
