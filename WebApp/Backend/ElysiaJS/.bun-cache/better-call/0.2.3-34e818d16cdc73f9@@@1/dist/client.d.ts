import { R as Router, U as UnionToIntersection, E as Endpoint, H as HasRequiredKeys } from './router-DhpmtodN.js';
import { BetterFetchOption, BetterFetchResponse } from '@better-fetch/fetch';
import 'zod';

type HasRequired<T extends {
    body?: any;
    query?: any;
    params?: any;
}> = HasRequiredKeys<T> extends true ? HasRequiredKeys<T["body"]> extends false ? HasRequiredKeys<T["query"]> extends false ? HasRequiredKeys<T["params"]> extends false ? false : true : true : true : true;
type InferContext<T> = T extends (ctx: infer Ctx) => any ? Ctx extends object ? Ctx : never : never;
interface ClientOptions extends BetterFetchOption {
    baseURL: string;
}
type WithRequired<T, K> = T & {
    [P in K extends string ? K : never]-?: T[P extends keyof T ? P : never];
};
type RequiredOptionKeys<C extends {
    body?: any;
    query?: any;
    params?: any;
}> = (undefined extends C["body"] ? {} : {
    body: true;
}) & (undefined extends C["query"] ? {} : {
    query: true;
}) & (undefined extends C["params"] ? {} : {
    params: true;
});
declare const createClient: <R extends Router | Router["endpoints"]>(options: ClientOptions) => <OPT extends UnionToIntersection<(R extends {
    handler: (request: Request) => Promise<Response>;
    endpoints: Record<string, Endpoint>;
} ? R["endpoints"] : R) extends {
    [key: string]: infer T_1;
} ? T_1 extends Endpoint ? { [key_1 in T_1["options"]["method"] extends "GET" ? T_1["path"] : `@${T_1["options"]["method"] extends string ? Lowercase<T_1["options"]["method"]> : never}${T_1["path"]}`]: T_1; } : {} : {}> extends infer T ? { [key in keyof T]: UnionToIntersection<(R extends {
    handler: (request: Request) => Promise<Response>;
    endpoints: Record<string, Endpoint>;
} ? R["endpoints"] : R) extends {
    [key: string]: infer T_1;
} ? T_1 extends Endpoint ? { [key_1 in T_1["options"]["method"] extends "GET" ? T_1["path"] : `@${T_1["options"]["method"] extends string ? Lowercase<T_1["options"]["method"]> : never}${T_1["path"]}`]: T_1; } : {} : {}>[key]; } : never, K extends keyof OPT, C extends InferContext<OPT[K]>>(path: K, ...options: HasRequired<C> extends true ? [WithRequired<BetterFetchOption<C["body"], C["query"], C["params"]>, keyof RequiredOptionKeys<C>>] : [BetterFetchOption<C["body"], C["query"], C["params"]>?]) => Promise<BetterFetchResponse<Awaited<ReturnType<OPT[K] extends Endpoint ? OPT[K] : never>>>>;

export { type ClientOptions, type RequiredOptionKeys, createClient };
