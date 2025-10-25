import * as kysely from 'kysely';
import { Kysely, Migration, Dialect } from 'kysely';
import { S as Session, U as User, A as Account, a as AppleProfile, D as DiscordProfile, F as FacebookProfile, G as GithubProfile, b as GoogleProfile, c as SpotifyProfile, T as TwitchProfile, d as TwitterProfile, e as SocialProviders, O as OAuthProviderList, f as OAuthProvider } from './index-C8A40nOX.js';
import * as better_call from 'better-call';
import { ContextTools, CookieOptions, Endpoint, EndpointResponse, Context, Prettify as Prettify$1 } from 'better-call';
import * as zod from 'zod';
import { ZodSchema, z } from 'zod';
import { L as LiteralString, U as UnionToIntersection, P as Prettify } from './helper-C1ihmerM.js';
import * as arctic from 'arctic';

/**
 * Adapter where clause
 */
type Where = {
    operator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
    value: string;
    field: string;
    connector?: "AND" | "OR";
};
/**
 * Adapter Interface
 */
interface Adapter {
    create: <T, R = T>(data: {
        model: string;
        data: T;
        select?: string[];
    }) => Promise<R>;
    findOne: <T>(data: {
        model: string;
        where: Where[];
        select?: string[];
    }) => Promise<T | null>;
    findMany: <T>(data: {
        model: string;
        where?: Where[];
    }) => Promise<T[]>;
    update: <T>(data: {
        model: string;
        where: Where[];
        update: Record<string, any>;
    }) => Promise<T | null>;
    delete: <T>(data: {
        model: string;
        where: Where[];
    }) => Promise<void>;
}
interface SessionAdapter {
    create: (data: {
        userId: string;
        expiresAt: Date;
    }) => Promise<Session>;
    findOne: (data: {
        userId: string;
    }) => Promise<Session | null>;
    update: (data: Session) => Promise<Session>;
    delete: (data: {
        sessionId: string;
    }) => Promise<void>;
}

declare const createInternalAdapter: (adapter: Adapter, db: Kysely<any>, options: BetterAuthOptions) => {
    createOAuthUser: (user: User, account: Account) => Promise<{
        user: {
            id: string;
            email: string;
            emailVerified: boolean;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            image?: string | undefined;
        };
        account: {
            id: string;
            providerId: string;
            accountId: string;
            userId: string;
            accessToken?: string | null | undefined;
            refreshToken?: string | null | undefined;
            idToken?: string | null | undefined;
            expiresAt?: Date | null | undefined;
            password?: string | null | undefined;
        };
    } | null>;
    createUser: (user: User) => Promise<{
        id: string;
        email: string;
        emailVerified: boolean;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        image?: string | undefined;
    }>;
    createSession: (userId: string, request?: Request | Headers, dontRememberMe?: boolean) => Promise<{
        id: string;
        userId: string;
        expiresAt: Date;
        ipAddress?: string | undefined;
        userAgent?: string | undefined;
    }>;
    findSession: (sessionId: string) => Promise<{
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
            ipAddress?: string | undefined;
            userAgent?: string | undefined;
        };
        user: {
            id: string;
            email: string;
            emailVerified: boolean;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            image?: string | undefined;
        };
    } | null>;
    updateSession: (sessionId: string, session: Partial<Session>) => Promise<{
        id: string;
        userId: string;
        expiresAt: Date;
        ipAddress?: string | undefined;
        userAgent?: string | undefined;
    } | null>;
    deleteSession: (id: string) => Promise<void>;
    /**
     * @requires
     */
    deleteSessions: (userId: string) => Promise<kysely.DeleteResult[]>;
    findUserByEmail: (email: string) => Promise<{
        user: {
            id: string;
            email: string;
            emailVerified: boolean;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            image?: string | undefined;
        };
        accounts: {
            id: string;
            providerId: string;
            accountId: string;
            userId: string;
            accessToken?: string | null | undefined;
            refreshToken?: string | null | undefined;
            idToken?: string | null | undefined;
            expiresAt?: Date | null | undefined;
            password?: string | null | undefined;
        }[];
    } | null>;
    findUserById: (userId: string) => Promise<{
        id: string;
        email: string;
        emailVerified: boolean;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        image?: string | undefined;
    } | null>;
    linkAccount: (account: Account) => Promise<{
        id: string;
        providerId: string;
        accountId: string;
        userId: string;
        accessToken?: string | null | undefined;
        refreshToken?: string | null | undefined;
        idToken?: string | null | undefined;
        expiresAt?: Date | null | undefined;
        password?: string | null | undefined;
    }>;
    updateUserByEmail: (email: string, data: Partial<User & Record<string, any>>) => Promise<{
        id: string;
        email: string;
        emailVerified: boolean;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        image?: string | undefined;
    } | null>;
    updatePassword: (userId: string, password: string) => Promise<{
        id: string;
        providerId: string;
        accountId: string;
        userId: string;
        accessToken?: string | null | undefined;
        refreshToken?: string | null | undefined;
        idToken?: string | null | undefined;
        expiresAt?: Date | null | undefined;
        password?: string | null | undefined;
    } | null>;
    findAccounts: (userId: string) => Promise<{
        id: string;
        providerId: string;
        accountId: string;
        userId: string;
        accessToken?: string | null | undefined;
        refreshToken?: string | null | undefined;
        idToken?: string | null | undefined;
        expiresAt?: Date | null | undefined;
        password?: string | null | undefined;
    }[]>;
    updateAccount: (accountId: string, data: Partial<Account>) => Promise<{
        id: string;
        providerId: string;
        accountId: string;
        userId: string;
        accessToken?: string | null | undefined;
        refreshToken?: string | null | undefined;
        idToken?: string | null | undefined;
        expiresAt?: Date | null | undefined;
        password?: string | null | undefined;
    } | null>;
};

type FieldAttribute<T extends FieldType = FieldType> = {
    type: T;
} & FieldAttributeConfig<T>;
type FieldType = "string" | "number" | "boolean" | "date";
type InferValueType<T extends FieldType> = T extends "string" ? string : T extends "number" ? number : T extends "boolean" ? boolean : T extends "date" ? Date : never;
type InferFieldOutput<T extends FieldAttribute> = T["returned"] extends false ? never : T["required"] extends false ? InferValueType<T["type"]> | undefined : InferValueType<T["type"]>;
type FieldAttributeConfig<T extends FieldType = FieldType> = {
    /**
     * if the field should be required on a new record.
     * @default false
     */
    required?: boolean;
    /**
     * If the value should be returned on a response body.
     * @default true
     */
    returned?: boolean;
    /**
     * If the value should be hashed when it's stored.
     * @default false
     */
    hashValue?: boolean;
    /**
     * Default value for the field
     *
     * Note: This will not create a default value on the database level. It will only
     * be used when creating a new record.
     */
    defaultValue?: InferValueType<T> | (() => InferValueType<T>);
    /**
     * transform the value before storing it.
     */
    transform?: (value: InferValueType<T>) => InferValueType<T>;
    /**
     * Reference to another model.
     */
    references?: {
        /**
         * The model to reference.
         */
        model: string;
        /**
         * The field on the referenced model.
         */
        field: string;
        /**
         * The action to perform when the reference is deleted.
         * @default "cascade"
         */
        onDelete?: "no action" | "restrict" | "cascade" | "set null" | "set default";
    };
    unique?: boolean;
    /**
     * A zod schema to validate the value.
     */
    validator?: ZodSchema;
};

type RequiredKeysOf<BaseType extends object> = Exclude<{
    [Key in keyof BaseType]: BaseType extends Record<Key, BaseType[Key]> ? Key : never;
}[keyof BaseType], undefined>;
type HasRequiredKeys<BaseType extends object> = RequiredKeysOf<BaseType> extends never ? false : true;

declare const getAuthTables: (options: BetterAuthOptions) => {
    rateLimit?: {
        tableName: string;
        fields: {
            key: {
                type: "string";
            };
            count: {
                type: "number";
            };
            lastRequest: {
                type: "number";
            };
        };
    } | undefined;
    user: {
        tableName: string;
        fields: {
            name: {
                type: "string";
            };
            email: {
                type: "string";
            };
            emailVerified: {
                type: "boolean";
                defaultValue: () => false;
            };
            image: {
                type: "string";
                required: false;
            };
            createdAt: {
                type: "date";
                defaultValue: () => Date;
            };
            updatedAt: {
                type: "date";
                defaultValue: () => Date;
            };
        };
        order: number;
    };
    session: {
        tableName: string;
        fields: {
            expiresAt: {
                type: "date";
            };
            ipAddress: {
                type: "string";
                required: false;
            };
            userAgent: {
                type: "string";
                required: false;
            };
            userId: {
                type: "string";
                references: {
                    model: string;
                    field: string;
                    onDelete: "cascade";
                };
            };
        };
        order: number;
    };
    account: {
        tableName: string;
        fields: {
            accountId: {
                type: "string";
            };
            providerId: {
                type: "string";
            };
            userId: {
                type: "string";
                references: {
                    model: string;
                    field: string;
                    onDelete: "cascade";
                };
            };
            accessToken: {
                type: "string";
                required: false;
            };
            refreshToken: {
                type: "string";
                required: false;
            };
            idToken: {
                type: "string";
                required: false;
            };
            expiresAt: {
                type: "date";
                required: false;
            };
            password: {
                type: "string";
                required: false;
            };
        };
        order: number;
    };
};

declare function getAdapter(options: BetterAuthOptions): Adapter;

type HookEndpointContext = ContextTools & {
    context: AuthContext;
} & {
    body: any;
    request?: Request;
    headers?: Headers;
    params?: Record<string, string> | undefined;
    query?: any;
    method?: any;
};
type GenericEndpointContext = ContextTools & {
    context: AuthContext;
} & {
    body?: any;
    request?: Request;
    headers?: Headers;
    params?: Record<string, string> | undefined;
    query?: any;
    method?: any;
};

declare function getCookies(options: BetterAuthOptions): {
    sessionToken: {
        name: string;
        options: {
            httpOnly: true;
            sameSite: "lax";
            path: string;
            secure: boolean;
            maxAge: number;
        };
    };
    csrfToken: {
        name: string;
        options: {
            httpOnly: true;
            sameSite: "lax";
            path: string;
            secure: boolean;
            maxAge: number;
        };
    };
    state: {
        name: string;
        options: {
            httpOnly: true;
            sameSite: "lax";
            path: string;
            secure: boolean;
            maxAge: number;
        };
    };
    pkCodeVerifier: {
        name: string;
        options: CookieOptions;
    };
    dontRememberToken: {
        name: string;
        options: CookieOptions;
    };
    nonce: {
        name: string;
        options: CookieOptions;
    };
};
declare function createCookieGetter(options: BetterAuthOptions): (cookieName: string, options?: CookieOptions) => {
    name: string;
    options: CookieOptions;
};
type BetterAuthCookies = ReturnType<typeof getCookies>;
declare function setSessionCookie(ctx: GenericEndpointContext, sessionToken: string, dontRememberMe?: boolean, overrides?: Partial<CookieOptions>): Promise<void>;
declare function deleteSessionCookie(ctx: GenericEndpointContext): void;
type CookieAttributes = {
    value: string;
    [key: string]: string | boolean;
};
declare function parseSetCookieHeader(header: string): Map<string, CookieAttributes>;

declare const createLogger: (options?: {
    disabled?: boolean;
}) => {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    info: (...args: any[]) => void;
    debug: (...args: any[]) => void;
    box: (...args: any[]) => void;
    success: (...args: any[]) => void;
    break: (...args: any[]) => void;
};
declare const logger: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    info: (...args: any[]) => void;
    debug: (...args: any[]) => void;
    box: (...args: any[]) => void;
    success: (...args: any[]) => void;
    break: (...args: any[]) => void;
};

declare const init: (options: BetterAuthOptions) => {
    appName: string;
    socialProviders: ({
        id: "apple";
        name: string;
        createAuthorizationURL({ state, scopes, redirectURI }: {
            state: string;
            codeVerifier: string;
            scopes?: string[];
            redirectURI?: string;
        }): URL;
        validateAuthorizationCode: (code: string, codeVerifier: string | undefined, redirectURI: string | undefined) => Promise<arctic.OAuth2Tokens>;
        getUserInfo(token: arctic.OAuth2Tokens): Promise<{
            user: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
            };
            data: AppleProfile;
        } | null>;
    } | {
        id: "discord";
        name: string;
        createAuthorizationURL({ state, scopes }: {
            state: string;
            codeVerifier: string;
            scopes?: string[];
            redirectURI?: string;
        }): URL;
        validateAuthorizationCode: (code: string, codeVerifier: string | undefined, redirectURI: string | undefined) => Promise<arctic.OAuth2Tokens>;
        getUserInfo(token: arctic.OAuth2Tokens): Promise<{
            user: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
            };
            data: DiscordProfile;
        } | null>;
    } | {
        id: "facebook";
        name: string;
        createAuthorizationURL({ state, scopes }: {
            state: string;
            codeVerifier: string;
            scopes?: string[];
            redirectURI?: string;
        }): URL;
        validateAuthorizationCode: (code: string, codeVerifier: string | undefined, redirectURI: string | undefined) => Promise<arctic.OAuth2Tokens>;
        getUserInfo(token: arctic.OAuth2Tokens): Promise<{
            user: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
            };
            data: FacebookProfile;
        } | null>;
    } | {
        id: "github";
        name: string;
        createAuthorizationURL({ state, scopes }: {
            state: string;
            codeVerifier: string;
            scopes?: string[];
            redirectURI?: string;
        }): URL;
        validateAuthorizationCode: (state: string) => Promise<arctic.OAuth2Tokens>;
        getUserInfo(token: arctic.OAuth2Tokens): Promise<{
            user: {
                id: string;
                name: string;
                email: string;
                image: string;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            data: GithubProfile;
        } | null>;
    } | {
        id: "google";
        name: string;
        createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }: {
            state: string;
            codeVerifier: string;
            scopes?: string[];
            redirectURI?: string;
        }): URL;
        validateAuthorizationCode: (code: string, codeVerifier: string | undefined, redirectURI: string | undefined) => Promise<arctic.OAuth2Tokens>;
        getUserInfo(token: arctic.OAuth2Tokens): Promise<{
            user: {
                id: string;
                name: string;
                email: string;
                image: string;
                emailVerified: boolean;
            };
            data: GoogleProfile;
        } | null>;
    } | {
        id: "spotify";
        name: string;
        createAuthorizationURL({ state, scopes }: {
            state: string;
            codeVerifier: string;
            scopes?: string[];
            redirectURI?: string;
        }): URL;
        validateAuthorizationCode: (code: string, codeVerifier: string | undefined, redirectURI: string | undefined) => Promise<arctic.OAuth2Tokens>;
        getUserInfo(token: arctic.OAuth2Tokens): Promise<{
            user: {
                id: string;
                name: string;
                email: string;
                image: string;
                emailVerified: false;
            };
            data: SpotifyProfile;
        } | null>;
    } | {
        id: "twitch";
        name: string;
        createAuthorizationURL({ state, scopes }: {
            state: string;
            codeVerifier: string;
            scopes?: string[];
            redirectURI?: string;
        }): URL;
        validateAuthorizationCode: (code: string, codeVerifier: string | undefined, redirectURI: string | undefined) => Promise<arctic.OAuth2Tokens>;
        getUserInfo(token: arctic.OAuth2Tokens): Promise<{
            user: {
                id: string;
                name: string;
                email: string;
                image: string;
                emailVerified: false;
            };
            data: TwitchProfile;
        } | null>;
    } | {
        id: "twitter";
        name: string;
        createAuthorizationURL(data: {
            state: string;
            codeVerifier: string;
            scopes?: string[];
            redirectURI?: string;
        }): URL;
        validateAuthorizationCode: (code: string, codeVerifier: string | undefined, redirectURI: string | undefined) => Promise<arctic.OAuth2Tokens>;
        getUserInfo(token: arctic.OAuth2Tokens): Promise<{
            user: {
                id: string;
                name: string;
                email: string;
                image: string | undefined;
                emailVerified: boolean;
            };
            data: TwitterProfile;
        } | null>;
    })[];
    options: {
        baseURL: string;
        basePath: string;
        appName?: string;
        secret?: string;
        database: {
            provider: "postgres" | "sqlite" | "mysql";
            url: string;
        } | kysely.Dialect;
        emailAndPassword?: {
            enabled: boolean;
            maxPasswordLength?: number;
            minPasswordLength?: number;
            sendResetPassword?: (url: string, user: User) => Promise<void>;
            sendVerificationEmail?: (email: string, url: string, token: string) => Promise<void>;
            sendEmailVerificationOnSignUp?: boolean;
            password?: {
                hash?: (password: string) => Promise<string>;
                verify?: (password: string, hash: string) => Promise<boolean>;
            };
        };
        socialProviders?: SocialProviders;
        plugins?: BetterAuthPlugin[];
        user?: {
            modelName?: string;
        };
        session?: {
            modelName?: string;
            expiresIn?: number;
            updateAge?: number;
        };
        account?: {
            modelName?: string;
            accountLinking?: {
                enabled?: boolean;
                trustedProviders?: Array<OAuthProviderList[number] | "email-password">;
            };
        };
        trustedOrigins?: string[];
        rateLimit?: {
            enabled?: boolean;
            window?: number;
            customRules?: {
                [key: string]: {
                    window: number;
                    max: number;
                };
            };
            max?: number;
            storage?: "memory" | "database";
            tableName?: string;
            customStorage?: {
                get: (key: string) => Promise<RateLimit | undefined>;
                set: (key: string, value: RateLimit) => Promise<void>;
            };
        };
        advanced?: {
            useSecureCookies?: boolean;
            disableCSRFCheck?: boolean;
        };
        logger?: {
            disabled?: boolean;
            verboseLogging?: boolean;
        };
    };
    tables: {
        rateLimit?: {
            tableName: string;
            fields: {
                key: {
                    type: "string";
                };
                count: {
                    type: "number";
                };
                lastRequest: {
                    type: "number";
                };
            };
        } | undefined;
        user: {
            tableName: string;
            fields: {
                name: {
                    type: "string";
                };
                email: {
                    type: "string";
                };
                emailVerified: {
                    type: "boolean";
                    defaultValue: () => false;
                };
                image: {
                    type: "string";
                    required: false;
                };
                createdAt: {
                    type: "date";
                    defaultValue: () => Date;
                };
                updatedAt: {
                    type: "date";
                    defaultValue: () => Date;
                };
            };
            order: number;
        };
        session: {
            tableName: string;
            fields: {
                expiresAt: {
                    type: "date";
                };
                ipAddress: {
                    type: "string";
                    required: false;
                };
                userAgent: {
                    type: "string";
                    required: false;
                };
                userId: {
                    type: "string";
                    references: {
                        model: string;
                        field: string;
                        onDelete: "cascade";
                    };
                };
            };
            order: number;
        };
        account: {
            tableName: string;
            fields: {
                accountId: {
                    type: "string";
                };
                providerId: {
                    type: "string";
                };
                userId: {
                    type: "string";
                    references: {
                        model: string;
                        field: string;
                        onDelete: "cascade";
                    };
                };
                accessToken: {
                    type: "string";
                    required: false;
                };
                refreshToken: {
                    type: "string";
                    required: false;
                };
                idToken: {
                    type: "string";
                    required: false;
                };
                expiresAt: {
                    type: "date";
                    required: false;
                };
                password: {
                    type: "string";
                    required: false;
                };
            };
            order: number;
        };
    };
    baseURL: string;
    sessionConfig: {
        updateAge: number;
        expiresIn: number;
    };
    secret: string;
    rateLimit: {
        enabled: boolean;
        window: number;
        max: number;
        storage: "database" | "memory";
        customRules?: {
            [key: string]: {
                window: number;
                max: number;
            };
        };
        tableName?: string;
        customStorage?: {
            get: (key: string) => Promise<RateLimit | undefined>;
            set: (key: string, value: RateLimit) => Promise<void>;
        };
    };
    authCookies: {
        sessionToken: {
            name: string;
            options: {
                httpOnly: true;
                sameSite: "lax";
                path: string;
                secure: boolean;
                maxAge: number;
            };
        };
        csrfToken: {
            name: string;
            options: {
                httpOnly: true;
                sameSite: "lax";
                path: string;
                secure: boolean;
                maxAge: number;
            };
        };
        state: {
            name: string;
            options: {
                httpOnly: true;
                sameSite: "lax";
                path: string;
                secure: boolean;
                maxAge: number;
            };
        };
        pkCodeVerifier: {
            name: string;
            options: better_call.CookieOptions;
        };
        dontRememberToken: {
            name: string;
            options: better_call.CookieOptions;
        };
        nonce: {
            name: string;
            options: better_call.CookieOptions;
        };
    };
    logger: {
        log: (...args: any[]) => void;
        error: (...args: any[]) => void;
        warn: (...args: any[]) => void;
        info: (...args: any[]) => void;
        debug: (...args: any[]) => void;
        box: (...args: any[]) => void;
        success: (...args: any[]) => void;
        break: (...args: any[]) => void;
    };
    db: Kysely<any>;
    password: {
        hash: (password: string) => Promise<string>;
        verify: (password: string, hash: string) => Promise<boolean>;
        config: {
            minPasswordLength: number;
            maxPasswordLength: number;
        };
    };
    adapter: Adapter;
    internalAdapter: {
        createOAuthUser: (user: User, account: Account) => Promise<{
            user: {
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            };
            account: {
                id: string;
                providerId: string;
                accountId: string;
                userId: string;
                accessToken?: string | null | undefined;
                refreshToken?: string | null | undefined;
                idToken?: string | null | undefined;
                expiresAt?: Date | null | undefined;
                password?: string | null | undefined;
            };
        } | null>;
        createUser: (user: User) => Promise<{
            id: string;
            email: string;
            emailVerified: boolean;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            image?: string | undefined;
        }>;
        createSession: (userId: string, request?: Request | Headers, dontRememberMe?: boolean) => Promise<{
            id: string;
            userId: string;
            expiresAt: Date;
            ipAddress?: string | undefined;
            userAgent?: string | undefined;
        }>;
        findSession: (sessionId: string) => Promise<{
            session: {
                id: string;
                userId: string;
                expiresAt: Date;
                ipAddress?: string | undefined;
                userAgent?: string | undefined;
            };
            user: {
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            };
        } | null>;
        updateSession: (sessionId: string, session: Partial<Session>) => Promise<{
            id: string;
            userId: string;
            expiresAt: Date;
            ipAddress?: string | undefined;
            userAgent?: string | undefined;
        } | null>;
        deleteSession: (id: string) => Promise<void>;
        deleteSessions: (userId: string) => Promise<kysely.DeleteResult[]>;
        findUserByEmail: (email: string) => Promise<{
            user: {
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            };
            accounts: {
                id: string;
                providerId: string;
                accountId: string;
                userId: string;
                accessToken?: string | null | undefined;
                refreshToken?: string | null | undefined;
                idToken?: string | null | undefined;
                expiresAt?: Date | null | undefined;
                password?: string | null | undefined;
            }[];
        } | null>;
        findUserById: (userId: string) => Promise<{
            id: string;
            email: string;
            emailVerified: boolean;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            image?: string | undefined;
        } | null>;
        linkAccount: (account: Account) => Promise<{
            id: string;
            providerId: string;
            accountId: string;
            userId: string;
            accessToken?: string | null | undefined;
            refreshToken?: string | null | undefined;
            idToken?: string | null | undefined;
            expiresAt?: Date | null | undefined;
            password?: string | null | undefined;
        }>;
        updateUserByEmail: (email: string, data: Partial<User & Record<string, any>>) => Promise<{
            id: string;
            email: string;
            emailVerified: boolean;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            image?: string | undefined;
        } | null>;
        updatePassword: (userId: string, password: string) => Promise<{
            id: string;
            providerId: string;
            accountId: string;
            userId: string;
            accessToken?: string | null | undefined;
            refreshToken?: string | null | undefined;
            idToken?: string | null | undefined;
            expiresAt?: Date | null | undefined;
            password?: string | null | undefined;
        } | null>;
        findAccounts: (userId: string) => Promise<{
            id: string;
            providerId: string;
            accountId: string;
            userId: string;
            accessToken?: string | null | undefined;
            refreshToken?: string | null | undefined;
            idToken?: string | null | undefined;
            expiresAt?: Date | null | undefined;
            password?: string | null | undefined;
        }[]>;
        updateAccount: (accountId: string, data: Partial<Account>) => Promise<{
            id: string;
            providerId: string;
            accountId: string;
            userId: string;
            accessToken?: string | null | undefined;
            refreshToken?: string | null | undefined;
            idToken?: string | null | undefined;
            expiresAt?: Date | null | undefined;
            password?: string | null | undefined;
        } | null>;
    };
    createAuthCookie: (cookieName: string, options?: better_call.CookieOptions) => {
        name: string;
        options: better_call.CookieOptions;
    };
};
type AuthContext = {
    options: BetterAuthOptions;
    appName: string;
    baseURL: string;
    socialProviders: OAuthProvider[];
    authCookies: BetterAuthCookies;
    logger: ReturnType<typeof createLogger>;
    db: Kysely<any>;
    rateLimit: {
        enabled: boolean;
        window: number;
        max: number;
        storage: "memory" | "database";
    } & BetterAuthOptions["rateLimit"];
    adapter: ReturnType<typeof getAdapter>;
    internalAdapter: ReturnType<typeof createInternalAdapter>;
    createAuthCookie: ReturnType<typeof createCookieGetter>;
    secret: string;
    sessionConfig: {
        updateAge: number;
        expiresIn: number;
    };
    password: {
        hash: (password: string) => Promise<string>;
        verify: (hash: string, password: string) => Promise<boolean>;
        config: {
            minPasswordLength: number;
            maxPasswordLength: number;
        };
    };
    tables: ReturnType<typeof getAuthTables>;
};

declare const optionsMiddleware: Endpoint<better_call.Handler<string, better_call.EndpointOptions, AuthContext>, better_call.EndpointOptions>;
declare const createAuthMiddleware: {
    <Opts extends better_call.EndpointOptions, R extends EndpointResponse>(optionsOrHandler: (ctx: better_call.InferBody<Opts, Opts["body"] & (undefined extends better_call.InferUseOptions<Opts>["body"] ? {} : better_call.InferUseOptions<Opts>["body"])> & {
        context: AuthContext & {
            returned?: Response;
        };
    } & better_call.InferRequest<Opts, Opts["requireRequest"]> & better_call.InferHeaders<Opts, Opts["requireHeaders"]> & {
        params?: Record<string, string>;
        query?: Record<string, string>;
    } & better_call.ContextTools extends infer T ? { [key in keyof T]: (better_call.InferBody<Opts, Opts["body"] & (undefined extends better_call.InferUseOptions<Opts>["body"] ? {} : better_call.InferUseOptions<Opts>["body"])> & {
        context: AuthContext & {
            returned?: Response;
        };
    } & better_call.InferRequest<Opts, Opts["requireRequest"]> & better_call.InferHeaders<Opts, Opts["requireHeaders"]> & {
        params?: Record<string, string>;
        query?: Record<string, string>;
    } & better_call.ContextTools)[key]; } : never) => Promise<R>): Endpoint<better_call.Handler<string, Opts, R>, Opts>;
    <Opts extends Omit<better_call.EndpointOptions, "method">, R_1 extends EndpointResponse>(optionsOrHandler: Opts, handler: (ctx: better_call.InferBody<Opts & {
        method: "*";
    }, (Opts & {
        method: "*";
    })["body"] & (undefined extends better_call.InferUseOptions<Opts & {
        method: "*";
    }>["body"] ? {} : better_call.InferUseOptions<Opts & {
        method: "*";
    }>["body"])> & {
        context: AuthContext & {
            returned?: Response;
        };
    } & better_call.InferRequest<Opts & {
        method: "*";
    }, (Opts & {
        method: "*";
    })["requireRequest"]> & better_call.InferHeaders<Opts & {
        method: "*";
    }, (Opts & {
        method: "*";
    })["requireHeaders"]> & {
        params?: Record<string, string>;
        query?: Record<string, string>;
    } & better_call.ContextTools extends infer T ? { [key in keyof T]: (better_call.InferBody<Opts & {
        method: "*";
    }, (Opts & {
        method: "*";
    })["body"] & (undefined extends better_call.InferUseOptions<Opts & {
        method: "*";
    }>["body"] ? {} : better_call.InferUseOptions<Opts & {
        method: "*";
    }>["body"])> & {
        context: AuthContext & {
            returned?: Response;
        };
    } & better_call.InferRequest<Opts & {
        method: "*";
    }, (Opts & {
        method: "*";
    })["requireRequest"]> & better_call.InferHeaders<Opts & {
        method: "*";
    }, (Opts & {
        method: "*";
    })["requireHeaders"]> & {
        params?: Record<string, string>;
        query?: Record<string, string>;
    } & better_call.ContextTools)[key]; } : never) => Promise<R_1>): Endpoint<better_call.Handler<string, Opts & {
        method: "*";
    }, R_1>, Opts & {
        method: "*";
    }>;
};
declare const createAuthEndpoint: <Path extends string, Opts extends better_call.EndpointOptions, R extends EndpointResponse>(path: Path, options: Opts, handler: (ctx: better_call.InferBody<Opts, Opts["body"] & (undefined extends better_call.InferUseOptions<Opts>["body"] ? {} : better_call.InferUseOptions<Opts>["body"])> & better_call.InferParam<Path, better_call.InferParamPath<Path>, better_call.InferParamWildCard<Path>> & better_call.InferMethod<Opts["method"]> & better_call.InferHeaders<Opts, Opts["requireHeaders"]> & better_call.InferRequest<Opts, Opts["requireRequest"]> & better_call.InferQuery<Opts["query"]> & better_call.InferUse<Opts["use"]> & {
    context: AuthContext;
} & Omit<better_call.ContextTools, "_flag"> extends infer T ? { [key in keyof T]: (better_call.InferBody<Opts, Opts["body"] & (undefined extends better_call.InferUseOptions<Opts>["body"] ? {} : better_call.InferUseOptions<Opts>["body"])> & better_call.InferParam<Path, better_call.InferParamPath<Path>, better_call.InferParamWildCard<Path>> & better_call.InferMethod<Opts["method"]> & better_call.InferHeaders<Opts, Opts["requireHeaders"]> & better_call.InferRequest<Opts, Opts["requireRequest"]> & better_call.InferQuery<Opts["query"]> & better_call.InferUse<Opts["use"]> & {
    context: AuthContext;
} & Omit<better_call.ContextTools, "_flag">)[key]; } : never) => Promise<R>) => {
    (...ctx: HasRequiredKeys<better_call.Context<Path, Opts>> extends true ? [better_call.Context<Path, Opts>] : [(better_call.Context<Path, Opts> | undefined)?]): Promise<R extends {
        _flag: "json";
    } ? R extends {
        body: infer B;
    } ? B : null : Awaited<Awaited<R>>>;
    path: Path;
    options: Opts;
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};
type AuthEndpoint = Endpoint<(ctx: {
    options: BetterAuthOptions;
    body: any;
    query: any;
    headers: Headers;
}) => Promise<EndpointResponse>>;
type AuthMiddleware = ReturnType<typeof createAuthMiddleware>;

type PluginSchema = {
    [table: string]: {
        fields: {
            [field in string]: FieldAttribute;
        };
        disableMigration?: boolean;
    };
};
type BetterAuthPlugin = {
    id: LiteralString;
    endpoints?: {
        [key: string]: AuthEndpoint;
    };
    middlewares?: {
        path: string;
        middleware: Endpoint;
    }[];
    hooks?: {
        before?: {
            matcher: (context: HookEndpointContext) => boolean;
            handler: (context: HookEndpointContext) => Promise<void | {
                context: Partial<HookEndpointContext>;
            }>;
        }[];
        after?: {
            matcher: (context: HookEndpointContext) => boolean;
            handler: (context: HookEndpointContext & {
                returned: EndpointResponse;
            }) => Promise<void | {
                response: EndpointResponse;
            }>;
        }[];
    };
    /**
     * Schema the plugin needs
     *
     * This will also be used to migrate the database. If the fields are dynamic from the plugins
     * configuration each time the configuration is changed a new migration will be created.
     *
     * NOTE: If you want to create migrations manually using
     * migrations option or any other way you
     * can disable migration per table basis.
     *
     * @example
     * ```ts
     * schema: {
     * 	user: {
     * 		fields: {
     * 			email: {
     * 				 type: "string",
     * 			},
     * 			emailVerified: {
     * 				type: "boolean",
     * 				defaultValue: false,
     * 			},
     * 		},
     * 	}
     * } as PluginSchema
     * ```
     */
    schema?: PluginSchema;
    /**
     * The migrations of the plugin. If you define schema that will automatically create
     * migrations for you.
     *
     * ⚠️ Only uses this if you dont't want to use the schema option and you disabled migrations for
     * the tables.
     */
    migrations?: Record<string, Migration>;
    /**
     * The options of the plugin
     */
    options?: Record<string, any>;
    $Infer?: Record<string, any>;
    /**
     * The rate limit rules to apply to specific paths.
     */
    rateLimit?: {
        window: number;
        max: number;
        pathMatcher: (path: string) => boolean;
    }[];
};

type AdditionalSessionFields<Options extends BetterAuthOptions> = Options["plugins"] extends Array<infer T> ? T extends {
    schema: {
        session: {
            fields: infer Field;
        };
    };
} ? Field extends Record<string, FieldAttribute> ? {
    [key in keyof Field]: InferFieldOutput<Field[key]>;
} : {} : {} : {};
type AdditionalUserFields<Options extends BetterAuthOptions> = Options["plugins"] extends Array<infer T> ? T extends {
    schema: {
        user: {
            fields: infer Field;
        };
    };
} ? Field extends Record<infer Key, FieldAttribute> ? Prettify<{
    [key in Key as Field[key]["required"] extends false ? never : Field[key]["defaultValue"] extends boolean | string | number | Date | Function ? key : never]: InferFieldOutput<Field[key]>;
} & {
    [key in Key as Field[key]["returned"] extends false ? never : key]?: InferFieldOutput<Field[key]>;
}> : {} : {} : {};
type InferUser<O extends BetterAuthOptions | Auth> = UnionToIntersection<User & (O extends BetterAuthOptions ? AdditionalUserFields<O> : O extends Auth ? AdditionalUserFields<O["options"]> : {})>;
type InferSession<O extends BetterAuthOptions | Auth> = UnionToIntersection<Session & (O extends BetterAuthOptions ? AdditionalSessionFields<O> : O extends Auth ? AdditionalSessionFields<O["options"]> : {})>;
type InferPluginTypes<O extends BetterAuthOptions> = O["plugins"] extends Array<infer P> ? UnionToIntersection<P extends BetterAuthPlugin ? P["$Infer"] extends Record<string, any> ? P["$Infer"] : {} : {}> : {};
interface RateLimit {
    /**
     * The key to use for rate limiting
     */
    key: string;
    /**
     * The number of requests made
     */
    count: number;
    /**
     * The last request time in milliseconds
     */
    lastRequest: number;
}

interface BetterAuthOptions {
    /**
     * The name of the application
     *
     * process.env.APP_NAME
     *
     * @default "Better Auth"
     */
    appName?: string;
    /**
     * Base URL for the better auth. This is typically the
     * root URL where your application server is hosted. If not explicitly set,
     * the system will check the following environment variable:
     *
     * process.env.BETTER_AUTH_URL || process.env.AUTH_URL
     *
     * If not set it will throw an error.
     */
    baseURL?: string;
    /**
     * Base path for the better auth. This is typically the path where the
     * better auth routes are mounted.
     *
     * @default "/api/auth"
     */
    basePath?: string;
    /**
     * The secret to use for encryption,
     * signing and hashing.
     *
     * By default better auth will look for
     * the following environment variables:
     * process.env.BETTER_AUTH_SECRET,
     * process.env.AUTH_SECRET
     * If none of these environment
     * variables are set,
     * it will default to
     * "better-auth-secret-123456789".
     *
     * on production if it's not set
     * it will throw an error.
     *
     * you can generate a good secret
     * using the following command:
     * @example
     * ```bash
     * openssl rand -base64 32
     * ```
     */
    secret?: string;
    /**
     * Database configuration
     */
    database: {
        provider: "postgres" | "sqlite" | "mysql";
        url: string;
    } | Dialect;
    /**
     * Email and password authentication
     */
    emailAndPassword?: {
        /**
         * Enable email and password authentication
         *
         * @default false
         */
        enabled: boolean;
        /**
         * The maximum length of the password.
         *
         * @default 128
         */
        maxPasswordLength?: number;
        /**
         * The minimum length of the password.
         *
         * @default 8
         */
        minPasswordLength?: number;
        /**
         * send reset password email
         */
        sendResetPassword?: (url: string, user: User) => Promise<void>;
        /**
         * @param email the email to send the verification email to
         * @param url the url to send the verification
         * email to
         * @param token the actual token. You can use this
         * if you want to custom endpoint to verify the
         * email.
         */
        sendVerificationEmail?: (email: string, url: string, token: string) => Promise<void>;
        /**
         * Send a verification email automatically
         * after sign up
         *
         * @default false
         */
        sendEmailVerificationOnSignUp?: boolean;
        /**
         * Password hashing and verification
         *
         * By default Scrypt is used for password hashing and
         * verification. You can provide your own hashing and
         * verification function. if you want to use a
         * different algorithm.
         */
        password?: {
            hash?: (password: string) => Promise<string>;
            verify?: (password: string, hash: string) => Promise<boolean>;
        };
    };
    /**
     * list of social providers
     */
    socialProviders?: SocialProviders;
    /**
     * List of Better Auth plugins
     */
    plugins?: BetterAuthPlugin[];
    /**
     * User configuration
     */
    user?: {
        /**
         * The model name for the user. Defaults to "user".
         */
        modelName?: string;
    };
    session?: {
        modelName?: string;
        /**
         * Expiration time for the session token. The value
         * should be in seconds.
         * @default 7 days (60 * 60 * 24 * 7)
         */
        expiresIn?: number;
        /**
         * How often the session should be refreshed. The value
         * should be in seconds.
         * If set 0 the session will be refreshed every time it is used.
         * @default 1 day (60 * 60 * 24)
         */
        updateAge?: number;
    };
    account?: {
        modelName?: string;
        accountLinking?: {
            /**
             * Enable account linking
             *
             * @default true
             */
            enabled?: boolean;
            /**
             * List of trusted providers
             */
            trustedProviders?: Array<OAuthProviderList[number] | "email-password">;
        };
    };
    /**
     * List of trusted origins.
     */
    trustedOrigins?: string[];
    /**
     * Rate limiting configuration
     */
    rateLimit?: {
        /**
         * By default, rate limiting is only
         * enabled on production.
         */
        enabled?: boolean;
        /**
         * Default window to use for rate limiting. The value
         * should be in seconds.
         *
         * @default 60 sec
         */
        window?: number;
        /**
         * Custom rate limit rules to apply to
         * specific paths.
         */
        customRules?: {
            [key: string]: {
                /**
                 * The window to use for the custom rule.
                 */
                window: number;
                /**
                 * The maximum number of requests allowed within the window.
                 */
                max: number;
            };
        };
        /**
         * The default maximum number of requests allowed within the window.
         *
         * @default 100
         */
        max?: number;
        /**
         * Storage configuration
         *
         * @default "memory"
         */
        storage?: "memory" | "database";
        /**
         * If database is used as storage, the name of the table to
         * use for rate limiting.
         *
         * @default "rateLimit"
         */
        tableName?: string;
        /**
         * custom storage configuration.
         *
         * NOTE: If custom storage is used storage
         * is ignored
         */
        customStorage?: {
            get: (key: string) => Promise<RateLimit | undefined>;
            set: (key: string, value: RateLimit) => Promise<void>;
        };
    };
    /**
     * Advanced options
     */
    advanced?: {
        /**
         * Use secure cookies
         *
         * @default false
         */
        useSecureCookies?: boolean;
        /**
         * Disable CSRF check
         */
        disableCSRFCheck?: boolean;
    };
    logger?: {
        /**
         * Disable logging
         *
         * @default false
         */
        disabled?: boolean;
        /**
         * log verbose information
         */
        verboseLogging?: boolean;
    };
}

declare const signInOAuth: {
    (ctx_0: better_call.Context<"/sign-in/social", {
        method: "POST";
        requireHeaders: true;
        query: z.ZodOptional<z.ZodObject<{
            /**
             * Redirect to the current URL after the
             * user has signed in.
             */
            currentURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            currentURL?: string | undefined;
        }, {
            currentURL?: string | undefined;
        }>>;
        body: z.ZodObject<{
            /**
             * Callback URL to redirect to after the user has signed in.
             */
            callbackURL: z.ZodOptional<z.ZodString>;
            /**
             * OAuth2 provider to use`
             */
            provider: z.ZodEnum<["github", ...("apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter")[]]>;
            /**
             * If this is true the session will only be valid for the current browser session
             */
            dontRememberMe: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
            callbackURL?: string | undefined;
            dontRememberMe?: boolean | undefined;
        }, {
            provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
            callbackURL?: string | undefined;
            dontRememberMe?: boolean | undefined;
        }>;
    }>): Promise<{
        url: string;
        state: string;
        codeVerifier: string;
        redirect: boolean;
    }>;
    path: "/sign-in/social";
    options: {
        method: "POST";
        requireHeaders: true;
        query: z.ZodOptional<z.ZodObject<{
            /**
             * Redirect to the current URL after the
             * user has signed in.
             */
            currentURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            currentURL?: string | undefined;
        }, {
            currentURL?: string | undefined;
        }>>;
        body: z.ZodObject<{
            /**
             * Callback URL to redirect to after the user has signed in.
             */
            callbackURL: z.ZodOptional<z.ZodString>;
            /**
             * OAuth2 provider to use`
             */
            provider: z.ZodEnum<["github", ...("apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter")[]]>;
            /**
             * If this is true the session will only be valid for the current browser session
             */
            dontRememberMe: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
            callbackURL?: string | undefined;
            dontRememberMe?: boolean | undefined;
        }, {
            provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
            callbackURL?: string | undefined;
            dontRememberMe?: boolean | undefined;
        }>;
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};
declare const signInEmail: {
    (ctx_0: better_call.Context<"/sign-in/email", {
        method: "POST";
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
            callbackURL: z.ZodOptional<z.ZodString>;
            /**
             * If this is true the session will only be valid for the current browser session
             * @default false
             */
            dontRememberMe: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            password: string;
            email: string;
            callbackURL?: string | undefined;
            dontRememberMe?: boolean | undefined;
        }, {
            password: string;
            email: string;
            callbackURL?: string | undefined;
            dontRememberMe?: boolean | undefined;
        }>;
    }>): Promise<{
        user: {
            id: string;
            email: string;
            emailVerified: boolean;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            image?: string | undefined;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
            ipAddress?: string | undefined;
            userAgent?: string | undefined;
        };
        redirect: boolean;
        url: string | undefined;
    }>;
    path: "/sign-in/email";
    options: {
        method: "POST";
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
            callbackURL: z.ZodOptional<z.ZodString>;
            /**
             * If this is true the session will only be valid for the current browser session
             * @default false
             */
            dontRememberMe: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            password: string;
            email: string;
            callbackURL?: string | undefined;
            dontRememberMe?: boolean | undefined;
        }, {
            password: string;
            email: string;
            callbackURL?: string | undefined;
            dontRememberMe?: boolean | undefined;
        }>;
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};

declare const callbackOAuth: {
    (ctx_0: better_call.Context<"/callback/:id", {
        method: "GET";
        query: z.ZodObject<{
            state: z.ZodString;
            code: z.ZodOptional<z.ZodString>;
            error: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            state: string;
            code?: string | undefined;
            error?: string | undefined;
        }, {
            state: string;
            code?: string | undefined;
            error?: string | undefined;
        }>;
        metadata: {
            isAction: false;
        };
    }>): Promise<never>;
    path: "/callback/:id";
    options: {
        method: "GET";
        query: z.ZodObject<{
            state: z.ZodString;
            code: z.ZodOptional<z.ZodString>;
            error: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            state: string;
            code?: string | undefined;
            error?: string | undefined;
        }, {
            state: string;
            code?: string | undefined;
            error?: string | undefined;
        }>;
        metadata: {
            isAction: false;
        };
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};

declare const getSession: <Option extends BetterAuthOptions>() => {
    (ctx_0: Context<"/session", {
        method: "GET";
        requireHeaders: true;
    }>): Promise<{
        session: Prettify<InferSession<Option>>;
        user: Prettify<InferUser<Option>>;
    } | null>;
    path: "/session";
    options: {
        method: "GET";
        requireHeaders: true;
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};
declare const getSessionFromCtx: (ctx: Context<any, any>) => Promise<{
    session: Prettify<{
        id: string;
        userId: string;
        expiresAt: Date;
        ipAddress?: string | undefined;
        userAgent?: string | undefined;
    }>;
    user: Prettify<{
        id: string;
        email: string;
        emailVerified: boolean;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        image?: string | undefined;
    }>;
} | null>;
declare const sessionMiddleware: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
    session: {
        session: Prettify<{
            id: string;
            userId: string;
            expiresAt: Date;
            ipAddress?: string | undefined;
            userAgent?: string | undefined;
        }>;
        user: Prettify<{
            id: string;
            email: string;
            emailVerified: boolean;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            image?: string | undefined;
        }>;
    };
}>, better_call.EndpointOptions>;
/**
 * user active sessions list
 */
declare const listSessions: <Option extends BetterAuthOptions>() => {
    (ctx_0: Context<"/user/list-sessions", {
        method: "GET";
        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
            session: {
                session: Prettify<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                }>;
                user: Prettify<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                }>;
            };
        }>, better_call.EndpointOptions>[];
        requireHeaders: true;
    }>): Promise<Prettify<UnionToIntersection<{
        id: string;
        userId: string;
        expiresAt: Date;
        ipAddress?: string | undefined;
        userAgent?: string | undefined;
    } & (Option extends BetterAuthOptions ? Option["plugins"] extends (infer T)[] ? T extends {
        schema: {
            session: {
                fields: infer Field;
            };
        };
    } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : Option extends Auth ? Option["options"]["plugins"] extends (infer T)[] ? T extends {
        schema: {
            session: {
                fields: infer Field;
            };
        };
    } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : {})>>[]>;
    path: "/user/list-sessions";
    options: {
        method: "GET";
        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
            session: {
                session: Prettify<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                }>;
                user: Prettify<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                }>;
            };
        }>, better_call.EndpointOptions>[];
        requireHeaders: true;
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};
/**
 * revoke a single session
 */
declare const revokeSession: {
    (ctx_0: Context<"/user/revoke-session", {
        method: "POST";
        body: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
            session: {
                session: Prettify<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                }>;
                user: Prettify<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                }>;
            };
        }>, better_call.EndpointOptions>[];
        requireHeaders: true;
    }>): Promise<{
        status: boolean;
    } | null>;
    path: "/user/revoke-session";
    options: {
        method: "POST";
        body: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
            session: {
                session: Prettify<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                }>;
                user: Prettify<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                }>;
            };
        }>, better_call.EndpointOptions>[];
        requireHeaders: true;
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};
/**
 * revoke all user sessions
 */
declare const revokeSessions: {
    (ctx_0: Context<"/user/revoke-sessions", {
        method: "POST";
        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
            session: {
                session: Prettify<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                }>;
                user: Prettify<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                }>;
            };
        }>, better_call.EndpointOptions>[];
        requireHeaders: true;
    }>): Promise<{
        status: boolean;
    } | null>;
    path: "/user/revoke-sessions";
    options: {
        method: "POST";
        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
            session: {
                session: Prettify<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                }>;
                user: Prettify<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                }>;
            };
        }>, better_call.EndpointOptions>[];
        requireHeaders: true;
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};

declare const signOut: {
    (ctx_0?: better_call.Context<"/sign-out", {
        method: "POST";
        body: z.ZodOptional<z.ZodObject<{
            callbackURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            callbackURL?: string | undefined;
        }, {
            callbackURL?: string | undefined;
        }>>;
    }> | undefined): Promise<null>;
    path: "/sign-out";
    options: {
        method: "POST";
        body: z.ZodOptional<z.ZodObject<{
            callbackURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            callbackURL?: string | undefined;
        }, {
            callbackURL?: string | undefined;
        }>>;
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};

declare const forgetPassword: {
    (ctx_0: better_call.Context<"/forget-password", {
        method: "POST";
        body: z.ZodObject<{
            /**
             * The email address of the user to send a password reset email to.
             */
            email: z.ZodString;
            /**
             * The URL to redirect the user to reset their password.
             * If the token isn't valid or expired, it'll be redirected with a query parameter `?
             * error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?
             * token=VALID_TOKEN
             */
            redirectTo: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
            redirectTo: string;
        }, {
            email: string;
            redirectTo: string;
        }>;
    }>): Promise<{
        status: boolean;
    } | null>;
    path: "/forget-password";
    options: {
        method: "POST";
        body: z.ZodObject<{
            /**
             * The email address of the user to send a password reset email to.
             */
            email: z.ZodString;
            /**
             * The URL to redirect the user to reset their password.
             * If the token isn't valid or expired, it'll be redirected with a query parameter `?
             * error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?
             * token=VALID_TOKEN
             */
            redirectTo: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
            redirectTo: string;
        }, {
            email: string;
            redirectTo: string;
        }>;
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};
declare const forgetPasswordCallback: {
    (ctx_0: better_call.Context<"/reset-password/:token", {
        method: "GET";
    }>): Promise<never>;
    path: "/reset-password/:token";
    options: {
        method: "GET";
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};
declare const resetPassword: {
    (ctx_0: better_call.Context<"/reset-password", {
        method: "POST";
        query: z.ZodOptional<z.ZodObject<{
            currentURL: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            currentURL: string;
        }, {
            currentURL: string;
        }>>;
        body: z.ZodObject<{
            newPassword: z.ZodString;
            callbackURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            newPassword: string;
            callbackURL?: string | undefined;
        }, {
            newPassword: string;
            callbackURL?: string | undefined;
        }>;
    }>): Promise<{
        error: string;
        data: null;
    } | {
        error: null;
        data: {
            status: boolean;
            url: string | undefined;
            redirect: boolean;
        };
    } | null>;
    path: "/reset-password";
    options: {
        method: "POST";
        query: z.ZodOptional<z.ZodObject<{
            currentURL: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            currentURL: string;
        }, {
            currentURL: string;
        }>>;
        body: z.ZodObject<{
            newPassword: z.ZodString;
            callbackURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            newPassword: string;
            callbackURL?: string | undefined;
        }, {
            newPassword: string;
            callbackURL?: string | undefined;
        }>;
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};

declare function createEmailVerificationToken(secret: string, email: string): Promise<string>;
declare const sendVerificationEmail: {
    (ctx_0: better_call.Context<"/send-verification-email", {
        method: "POST";
        query: z.ZodOptional<z.ZodObject<{
            currentURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            currentURL?: string | undefined;
        }, {
            currentURL?: string | undefined;
        }>>;
        body: z.ZodObject<{
            email: z.ZodString;
            callbackURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            callbackURL?: string | undefined;
        }, {
            email: string;
            callbackURL?: string | undefined;
        }>;
    }>): Promise<{
        status: boolean;
    } | null>;
    path: "/send-verification-email";
    options: {
        method: "POST";
        query: z.ZodOptional<z.ZodObject<{
            currentURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            currentURL?: string | undefined;
        }, {
            currentURL?: string | undefined;
        }>>;
        body: z.ZodObject<{
            email: z.ZodString;
            callbackURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            callbackURL?: string | undefined;
        }, {
            email: string;
            callbackURL?: string | undefined;
        }>;
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};
declare const verifyEmail: {
    (ctx_0: better_call.Context<"/verify-email", {
        method: "GET";
        query: z.ZodObject<{
            token: z.ZodString;
            callbackURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            token: string;
            callbackURL?: string | undefined;
        }, {
            token: string;
            callbackURL?: string | undefined;
        }>;
    }>): Promise<{
        status: boolean;
    } | null>;
    path: "/verify-email";
    options: {
        method: "GET";
        query: z.ZodObject<{
            token: z.ZodString;
            callbackURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            token: string;
            callbackURL?: string | undefined;
        }, {
            token: string;
            callbackURL?: string | undefined;
        }>;
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};

declare const updateUser: {
    (ctx_0: better_call.Context<"/user/update", {
        method: "POST";
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            image: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            image?: string | undefined;
        }, {
            name?: string | undefined;
            image?: string | undefined;
        }>;
        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
            session: {
                session: Prettify<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                }>;
                user: Prettify<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                }>;
            };
        }>, better_call.EndpointOptions>[];
    }>): Promise<{
        id: string;
        email: string;
        emailVerified: boolean;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        image?: string | undefined;
    } | null>;
    path: "/user/update";
    options: {
        method: "POST";
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            image: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            image?: string | undefined;
        }, {
            name?: string | undefined;
            image?: string | undefined;
        }>;
        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
            session: {
                session: Prettify<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                }>;
                user: Prettify<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                }>;
            };
        }>, better_call.EndpointOptions>[];
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};
declare const changePassword: {
    (ctx_0: better_call.Context<"/user/change-password", {
        method: "POST";
        body: z.ZodObject<{
            /**
             * The new password to set
             */
            newPassword: z.ZodString;
            /**
             * The current password of the user
             */
            currentPassword: z.ZodString;
            /**
             * revoke all sessions that are not the
             * current one logged in by the user
             */
            revokeOtherSessions: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            newPassword: string;
            currentPassword: string;
            revokeOtherSessions?: boolean | undefined;
        }, {
            newPassword: string;
            currentPassword: string;
            revokeOtherSessions?: boolean | undefined;
        }>;
        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
            session: {
                session: Prettify<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                }>;
                user: Prettify<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                }>;
            };
        }>, better_call.EndpointOptions>[];
    }>): Promise<Prettify<{
        id: string;
        email: string;
        emailVerified: boolean;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        image?: string | undefined;
    }> | null>;
    path: "/user/change-password";
    options: {
        method: "POST";
        body: z.ZodObject<{
            /**
             * The new password to set
             */
            newPassword: z.ZodString;
            /**
             * The current password of the user
             */
            currentPassword: z.ZodString;
            /**
             * revoke all sessions that are not the
             * current one logged in by the user
             */
            revokeOtherSessions: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            newPassword: string;
            currentPassword: string;
            revokeOtherSessions?: boolean | undefined;
        }, {
            newPassword: string;
            currentPassword: string;
            revokeOtherSessions?: boolean | undefined;
        }>;
        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
            session: {
                session: Prettify<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                }>;
                user: Prettify<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                }>;
            };
        }>, better_call.EndpointOptions>[];
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};
declare const setPassword: {
    (ctx_0: better_call.Context<"/user/set-password", {
        method: "POST";
        body: z.ZodObject<{
            /**
             * The new password to set
             */
            newPassword: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            newPassword: string;
        }, {
            newPassword: string;
        }>;
        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
            session: {
                session: Prettify<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                }>;
                user: Prettify<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                }>;
            };
        }>, better_call.EndpointOptions>[];
    }>): Promise<Prettify<{
        id: string;
        email: string;
        emailVerified: boolean;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        image?: string | undefined;
    }> | null>;
    path: "/user/set-password";
    options: {
        method: "POST";
        body: z.ZodObject<{
            /**
             * The new password to set
             */
            newPassword: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            newPassword: string;
        }, {
            newPassword: string;
        }>;
        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
            session: {
                session: Prettify<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                }>;
                user: Prettify<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                }>;
            };
        }>, better_call.EndpointOptions>[];
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};

declare const getCSRFToken: {
    (ctx_0?: better_call.Context<"/csrf", {
        method: "GET";
        metadata: {
            isAction: false;
        };
    }> | undefined): Promise<{
        csrfToken: string;
    }>;
    path: "/csrf";
    options: {
        method: "GET";
        metadata: {
            isAction: false;
        };
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};

declare const error: {
    (ctx_0?: better_call.Context<"/error", {
        method: "GET";
        metadata: {
            isAction: false;
        };
    }> | undefined): Promise<Response>;
    path: "/error";
    options: {
        method: "GET";
        metadata: {
            isAction: false;
        };
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};

declare const ok: {
    (ctx_0?: better_call.Context<"/ok", {
        method: "GET";
        metadata: {
            isAction: false;
        };
    }> | undefined): Promise<{
        ok: boolean;
    }>;
    path: "/ok";
    options: {
        method: "GET";
        metadata: {
            isAction: false;
        };
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};

declare const signUpEmail: {
    (ctx_0: better_call.Context<"/sign-up/email", {
        method: "POST";
        query: z.ZodOptional<z.ZodObject<{
            currentURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            currentURL?: string | undefined;
        }, {
            currentURL?: string | undefined;
        }>>;
        body: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
            image: z.ZodOptional<z.ZodString>;
            callbackURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            password: string;
            email: string;
            name: string;
            image?: string | undefined;
            callbackURL?: string | undefined;
        }, {
            password: string;
            email: string;
            name: string;
            image?: string | undefined;
            callbackURL?: string | undefined;
        }>;
    }>): Promise<{
        user: {
            id: string;
            email: string;
            emailVerified: boolean;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            image?: string | undefined;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
            ipAddress?: string | undefined;
            userAgent?: string | undefined;
        };
    } | null>;
    path: "/sign-up/email";
    options: {
        method: "POST";
        query: z.ZodOptional<z.ZodObject<{
            currentURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            currentURL?: string | undefined;
        }, {
            currentURL?: string | undefined;
        }>>;
        body: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
            image: z.ZodOptional<z.ZodString>;
            callbackURL: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            password: string;
            email: string;
            name: string;
            image?: string | undefined;
            callbackURL?: string | undefined;
        }, {
            password: string;
            email: string;
            name: string;
            image?: string | undefined;
            callbackURL?: string | undefined;
        }>;
    };
    method: better_call.Method | better_call.Method[];
    headers: Headers;
};

declare const csrfMiddleware: better_call.Endpoint<better_call.Handler<string, {
    body: z.ZodOptional<z.ZodObject<{
        csrfToken: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        csrfToken?: string | undefined;
    }, {
        csrfToken?: string | undefined;
    }>>;
} & {
    method: "*";
}, void>, {
    body: z.ZodOptional<z.ZodObject<{
        csrfToken: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        csrfToken?: string | undefined;
    }, {
        csrfToken?: string | undefined;
    }>>;
} & {
    method: "*";
}>;

declare function getEndpoints<C extends AuthContext, Option extends BetterAuthOptions>(ctx: C, options: Option): {
    api: {
        ok: {
            (ctx_0?: Context<"/ok", {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            }> | undefined): Promise<{
                ok: boolean;
            }>;
            path: "/ok";
            options: {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        error: {
            (ctx_0?: Context<"/error", {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            }> | undefined): Promise<Response>;
            path: "/error";
            options: {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signInOAuth: {
            (ctx_0: Context<"/sign-in/social", {
                method: "POST";
                requireHeaders: true;
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    provider: zod.ZodEnum<["github", ...("apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter")[]]>;
                    dontRememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
            }>): Promise<{
                url: string;
                state: string;
                codeVerifier: string;
                redirect: boolean;
            }>;
            path: "/sign-in/social";
            options: {
                method: "POST";
                requireHeaders: true;
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    provider: zod.ZodEnum<["github", ...("apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter")[]]>;
                    dontRememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        callbackOAuth: {
            (ctx_0: Context<"/callback/:id", {
                method: "GET";
                query: zod.ZodObject<{
                    state: zod.ZodString;
                    code: zod.ZodOptional<zod.ZodString>;
                    error: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                }, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                }>;
                metadata: {
                    isAction: false;
                };
            }>): Promise<never>;
            path: "/callback/:id";
            options: {
                method: "GET";
                query: zod.ZodObject<{
                    state: zod.ZodString;
                    code: zod.ZodOptional<zod.ZodString>;
                    error: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                }, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                }>;
                metadata: {
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        getCSRFToken: {
            (ctx_0?: Context<"/csrf", {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            }> | undefined): Promise<{
                csrfToken: string;
            }>;
            path: "/csrf";
            options: {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        getSession: {
            (ctx_0: Context<"/session", {
                method: "GET";
                requireHeaders: true;
            }>): Promise<{
                session: Prettify<UnionToIntersection<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                } & (Option extends BetterAuthOptions ? Option["plugins"] extends (infer T)[] ? T extends {
                    schema: {
                        session: {
                            fields: infer Field;
                        };
                    };
                } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : Option extends Auth ? Option["options"]["plugins"] extends (infer T)[] ? T extends {
                    schema: {
                        session: {
                            fields: infer Field;
                        };
                    };
                } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : {})>>;
                user: Prettify<UnionToIntersection<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                } & (Option extends BetterAuthOptions ? Option["plugins"] extends (infer T_1)[] ? T_1 extends {
                    schema: {
                        user: {
                            fields: infer Field_1;
                        };
                    };
                } ? Field_1 extends Record<infer Key extends string | number | symbol, FieldAttribute> ? Prettify<{ [key_1 in Key as Field_1[key_1]["required"] extends false ? never : Field_1[key_1]["defaultValue"] extends string | number | boolean | Function | Date ? key_1 : never]: InferFieldOutput<Field_1[key_1]>; } & { [key_2 in Key as Field_1[key_2]["returned"] extends false ? never : key_2]?: InferFieldOutput<Field_1[key_2]> | undefined; }> : {} : {} : {} : Option extends Auth ? Option["options"]["plugins"] extends (infer T_1)[] ? T_1 extends {
                    schema: {
                        user: {
                            fields: infer Field_1;
                        };
                    };
                } ? Field_1 extends Record<infer Key extends string | number | symbol, FieldAttribute> ? Prettify<{ [key_1 in Key as Field_1[key_1]["required"] extends false ? never : Field_1[key_1]["defaultValue"] extends string | number | boolean | Function | Date ? key_1 : never]: InferFieldOutput<Field_1[key_1]>; } & { [key_2 in Key as Field_1[key_2]["returned"] extends false ? never : key_2]?: InferFieldOutput<Field_1[key_2]> | undefined; }> : {} : {} : {} : {})>>;
            } | null>;
            path: "/session";
            options: {
                method: "GET";
                requireHeaders: true;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signOut: {
            (ctx_0?: Context<"/sign-out", {
                method: "POST";
                body: zod.ZodOptional<zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    callbackURL?: string | undefined;
                }, {
                    callbackURL?: string | undefined;
                }>>;
            }> | undefined): Promise<null>;
            path: "/sign-out";
            options: {
                method: "POST";
                body: zod.ZodOptional<zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    callbackURL?: string | undefined;
                }, {
                    callbackURL?: string | undefined;
                }>>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signUpEmail: {
            (ctx_0: Context<"/sign-up/email", {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    name: zod.ZodString;
                    email: zod.ZodString;
                    password: zod.ZodString;
                    image: zod.ZodOptional<zod.ZodString>;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }, {
                    password: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }>;
            }>): Promise<{
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                };
                session: {
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                };
            } | null>;
            path: "/sign-up/email";
            options: {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    name: zod.ZodString;
                    email: zod.ZodString;
                    password: zod.ZodString;
                    image: zod.ZodOptional<zod.ZodString>;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }, {
                    password: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signInEmail: {
            (ctx_0: Context<"/sign-in/email", {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    password: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    dontRememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
            }>): Promise<{
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                };
                session: {
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                };
                redirect: boolean;
                url: string | undefined;
            }>;
            path: "/sign-in/email";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    password: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    dontRememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        forgetPassword: {
            (ctx_0: Context<"/forget-password", {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    redirectTo: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    redirectTo: string;
                }, {
                    email: string;
                    redirectTo: string;
                }>;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/forget-password";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    redirectTo: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    redirectTo: string;
                }, {
                    email: string;
                    redirectTo: string;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        resetPassword: {
            (ctx_0: Context<"/reset-password", {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    currentURL: string;
                }, {
                    currentURL: string;
                }>>;
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    callbackURL?: string | undefined;
                }, {
                    newPassword: string;
                    callbackURL?: string | undefined;
                }>;
            }>): Promise<{
                error: string;
                data: null;
            } | {
                error: null;
                data: {
                    status: boolean;
                    url: string | undefined;
                    redirect: boolean;
                };
            } | null>;
            path: "/reset-password";
            options: {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    currentURL: string;
                }, {
                    currentURL: string;
                }>>;
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    callbackURL?: string | undefined;
                }, {
                    newPassword: string;
                    callbackURL?: string | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        verifyEmail: {
            (ctx_0: Context<"/verify-email", {
                method: "GET";
                query: zod.ZodObject<{
                    token: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/verify-email";
            options: {
                method: "GET";
                query: zod.ZodObject<{
                    token: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        sendVerificationEmail: {
            (ctx_0: Context<"/send-verification-email", {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    callbackURL?: string | undefined;
                }, {
                    email: string;
                    callbackURL?: string | undefined;
                }>;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/send-verification-email";
            options: {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    callbackURL?: string | undefined;
                }, {
                    email: string;
                    callbackURL?: string | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        changePassword: {
            (ctx_0: Context<"/user/change-password", {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    currentPassword: zod.ZodString;
                    revokeOtherSessions: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            }>): Promise<Prettify<{
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            }> | null>;
            path: "/user/change-password";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    currentPassword: zod.ZodString;
                    revokeOtherSessions: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        setPassword: {
            (ctx_0: Context<"/user/set-password", {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            }>): Promise<Prettify<{
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            }> | null>;
            path: "/user/set-password";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        updateUser: {
            (ctx_0: Context<"/user/update", {
                method: "POST";
                body: zod.ZodObject<{
                    name: zod.ZodOptional<zod.ZodString>;
                    image: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    name?: string | undefined;
                    image?: string | undefined;
                }, {
                    name?: string | undefined;
                    image?: string | undefined;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            }>): Promise<{
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            } | null>;
            path: "/user/update";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    name: zod.ZodOptional<zod.ZodString>;
                    image: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    name?: string | undefined;
                    image?: string | undefined;
                }, {
                    name?: string | undefined;
                    image?: string | undefined;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        forgetPasswordCallback: {
            (ctx_0: Context<"/reset-password/:token", {
                method: "GET";
            }>): Promise<never>;
            path: "/reset-password/:token";
            options: {
                method: "GET";
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        listSessions: {
            (ctx_0: Context<"/user/list-sessions", {
                method: "GET";
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            }>): Promise<Prettify<UnionToIntersection<{
                id: string;
                userId: string;
                expiresAt: Date;
                ipAddress?: string | undefined;
                userAgent?: string | undefined;
            } & (Option extends BetterAuthOptions ? Option["plugins"] extends (infer T)[] ? T extends {
                schema: {
                    session: {
                        fields: infer Field;
                    };
                };
            } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : Option extends Auth ? Option["options"]["plugins"] extends (infer T)[] ? T extends {
                schema: {
                    session: {
                        fields: infer Field;
                    };
                };
            } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : {})>>[]>;
            path: "/user/list-sessions";
            options: {
                method: "GET";
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        revokeSession: {
            (ctx_0: Context<"/user/revoke-session", {
                method: "POST";
                body: zod.ZodObject<{
                    id: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/user/revoke-session";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    id: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        revokeSessions: {
            (ctx_0: Context<"/user/revoke-sessions", {
                method: "POST";
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/user/revoke-sessions";
            options: {
                method: "POST";
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    } & UnionToIntersection<Option["plugins"] extends (infer T)[] ? T extends BetterAuthPlugin ? T["endpoints"] : {} : {}>;
    middlewares: {
        path: string;
        middleware: Endpoint;
    }[];
};
declare const router: <C extends AuthContext, Option extends BetterAuthOptions>(ctx: C, options: Option) => {
    handler: (request: Request) => Promise<Response>;
    endpoints: {
        ok: {
            (ctx_0?: Context<"/ok", {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            }> | undefined): Promise<{
                ok: boolean;
            }>;
            path: "/ok";
            options: {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        error: {
            (ctx_0?: Context<"/error", {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            }> | undefined): Promise<Response>;
            path: "/error";
            options: {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signInOAuth: {
            (ctx_0: Context<"/sign-in/social", {
                method: "POST";
                requireHeaders: true;
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    provider: zod.ZodEnum<["github", ...("apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter")[]]>;
                    dontRememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
            }>): Promise<{
                url: string;
                state: string;
                codeVerifier: string;
                redirect: boolean;
            }>;
            path: "/sign-in/social";
            options: {
                method: "POST";
                requireHeaders: true;
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    provider: zod.ZodEnum<["github", ...("apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter")[]]>;
                    dontRememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        callbackOAuth: {
            (ctx_0: Context<"/callback/:id", {
                method: "GET";
                query: zod.ZodObject<{
                    state: zod.ZodString;
                    code: zod.ZodOptional<zod.ZodString>;
                    error: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                }, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                }>;
                metadata: {
                    isAction: false;
                };
            }>): Promise<never>;
            path: "/callback/:id";
            options: {
                method: "GET";
                query: zod.ZodObject<{
                    state: zod.ZodString;
                    code: zod.ZodOptional<zod.ZodString>;
                    error: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                }, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                }>;
                metadata: {
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        getCSRFToken: {
            (ctx_0?: Context<"/csrf", {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            }> | undefined): Promise<{
                csrfToken: string;
            }>;
            path: "/csrf";
            options: {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        getSession: {
            (ctx_0: Context<"/session", {
                method: "GET";
                requireHeaders: true;
            }>): Promise<{
                session: Prettify<UnionToIntersection<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                } & (Option extends BetterAuthOptions ? Option["plugins"] extends (infer T)[] ? T extends {
                    schema: {
                        session: {
                            fields: infer Field;
                        };
                    };
                } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : Option extends Auth ? Option["options"]["plugins"] extends (infer T)[] ? T extends {
                    schema: {
                        session: {
                            fields: infer Field;
                        };
                    };
                } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : {})>>;
                user: Prettify<UnionToIntersection<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                } & (Option extends BetterAuthOptions ? Option["plugins"] extends (infer T_1)[] ? T_1 extends {
                    schema: {
                        user: {
                            fields: infer Field_1;
                        };
                    };
                } ? Field_1 extends Record<infer Key extends string | number | symbol, FieldAttribute> ? Prettify<{ [key_1 in Key as Field_1[key_1]["required"] extends false ? never : Field_1[key_1]["defaultValue"] extends string | number | boolean | Function | Date ? key_1 : never]: InferFieldOutput<Field_1[key_1]>; } & { [key_2 in Key as Field_1[key_2]["returned"] extends false ? never : key_2]?: InferFieldOutput<Field_1[key_2]> | undefined; }> : {} : {} : {} : Option extends Auth ? Option["options"]["plugins"] extends (infer T_1)[] ? T_1 extends {
                    schema: {
                        user: {
                            fields: infer Field_1;
                        };
                    };
                } ? Field_1 extends Record<infer Key extends string | number | symbol, FieldAttribute> ? Prettify<{ [key_1 in Key as Field_1[key_1]["required"] extends false ? never : Field_1[key_1]["defaultValue"] extends string | number | boolean | Function | Date ? key_1 : never]: InferFieldOutput<Field_1[key_1]>; } & { [key_2 in Key as Field_1[key_2]["returned"] extends false ? never : key_2]?: InferFieldOutput<Field_1[key_2]> | undefined; }> : {} : {} : {} : {})>>;
            } | null>;
            path: "/session";
            options: {
                method: "GET";
                requireHeaders: true;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signOut: {
            (ctx_0?: Context<"/sign-out", {
                method: "POST";
                body: zod.ZodOptional<zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    callbackURL?: string | undefined;
                }, {
                    callbackURL?: string | undefined;
                }>>;
            }> | undefined): Promise<null>;
            path: "/sign-out";
            options: {
                method: "POST";
                body: zod.ZodOptional<zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    callbackURL?: string | undefined;
                }, {
                    callbackURL?: string | undefined;
                }>>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signUpEmail: {
            (ctx_0: Context<"/sign-up/email", {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    name: zod.ZodString;
                    email: zod.ZodString;
                    password: zod.ZodString;
                    image: zod.ZodOptional<zod.ZodString>;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }, {
                    password: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }>;
            }>): Promise<{
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                };
                session: {
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                };
            } | null>;
            path: "/sign-up/email";
            options: {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    name: zod.ZodString;
                    email: zod.ZodString;
                    password: zod.ZodString;
                    image: zod.ZodOptional<zod.ZodString>;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }, {
                    password: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signInEmail: {
            (ctx_0: Context<"/sign-in/email", {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    password: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    dontRememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
            }>): Promise<{
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                };
                session: {
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                };
                redirect: boolean;
                url: string | undefined;
            }>;
            path: "/sign-in/email";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    password: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    dontRememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        forgetPassword: {
            (ctx_0: Context<"/forget-password", {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    redirectTo: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    redirectTo: string;
                }, {
                    email: string;
                    redirectTo: string;
                }>;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/forget-password";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    redirectTo: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    redirectTo: string;
                }, {
                    email: string;
                    redirectTo: string;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        resetPassword: {
            (ctx_0: Context<"/reset-password", {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    currentURL: string;
                }, {
                    currentURL: string;
                }>>;
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    callbackURL?: string | undefined;
                }, {
                    newPassword: string;
                    callbackURL?: string | undefined;
                }>;
            }>): Promise<{
                error: string;
                data: null;
            } | {
                error: null;
                data: {
                    status: boolean;
                    url: string | undefined;
                    redirect: boolean;
                };
            } | null>;
            path: "/reset-password";
            options: {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    currentURL: string;
                }, {
                    currentURL: string;
                }>>;
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    callbackURL?: string | undefined;
                }, {
                    newPassword: string;
                    callbackURL?: string | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        verifyEmail: {
            (ctx_0: Context<"/verify-email", {
                method: "GET";
                query: zod.ZodObject<{
                    token: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/verify-email";
            options: {
                method: "GET";
                query: zod.ZodObject<{
                    token: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        sendVerificationEmail: {
            (ctx_0: Context<"/send-verification-email", {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    callbackURL?: string | undefined;
                }, {
                    email: string;
                    callbackURL?: string | undefined;
                }>;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/send-verification-email";
            options: {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    callbackURL?: string | undefined;
                }, {
                    email: string;
                    callbackURL?: string | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        changePassword: {
            (ctx_0: Context<"/user/change-password", {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    currentPassword: zod.ZodString;
                    revokeOtherSessions: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            }>): Promise<Prettify<{
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            }> | null>;
            path: "/user/change-password";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    currentPassword: zod.ZodString;
                    revokeOtherSessions: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        setPassword: {
            (ctx_0: Context<"/user/set-password", {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            }>): Promise<Prettify<{
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            }> | null>;
            path: "/user/set-password";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        updateUser: {
            (ctx_0: Context<"/user/update", {
                method: "POST";
                body: zod.ZodObject<{
                    name: zod.ZodOptional<zod.ZodString>;
                    image: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    name?: string | undefined;
                    image?: string | undefined;
                }, {
                    name?: string | undefined;
                    image?: string | undefined;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            }>): Promise<{
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            } | null>;
            path: "/user/update";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    name: zod.ZodOptional<zod.ZodString>;
                    image: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    name?: string | undefined;
                    image?: string | undefined;
                }, {
                    name?: string | undefined;
                    image?: string | undefined;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        forgetPasswordCallback: {
            (ctx_0: Context<"/reset-password/:token", {
                method: "GET";
            }>): Promise<never>;
            path: "/reset-password/:token";
            options: {
                method: "GET";
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        listSessions: {
            (ctx_0: Context<"/user/list-sessions", {
                method: "GET";
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            }>): Promise<Prettify<UnionToIntersection<{
                id: string;
                userId: string;
                expiresAt: Date;
                ipAddress?: string | undefined;
                userAgent?: string | undefined;
            } & (Option extends BetterAuthOptions ? Option["plugins"] extends (infer T)[] ? T extends {
                schema: {
                    session: {
                        fields: infer Field;
                    };
                };
            } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : Option extends Auth ? Option["options"]["plugins"] extends (infer T)[] ? T extends {
                schema: {
                    session: {
                        fields: infer Field;
                    };
                };
            } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : {})>>[]>;
            path: "/user/list-sessions";
            options: {
                method: "GET";
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        revokeSession: {
            (ctx_0: Context<"/user/revoke-session", {
                method: "POST";
                body: zod.ZodObject<{
                    id: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/user/revoke-session";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    id: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        revokeSessions: {
            (ctx_0: Context<"/user/revoke-sessions", {
                method: "POST";
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/user/revoke-sessions";
            options: {
                method: "POST";
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    } & UnionToIntersection<Option["plugins"] extends (infer T)[] ? T extends BetterAuthPlugin ? T["endpoints"] : {} : {}>;
};

type InferAPI<API> = Omit<API, API extends {
    [key in infer K]: Endpoint;
} ? K extends string ? API[K]["options"]["metadata"] extends {
    isAction: false;
} ? K : never : never : never>;
declare const betterAuth: <O extends BetterAuthOptions>(options: O) => {
    handler: (request: Request) => Promise<Response>;
    api: InferAPI<{
        ok: {
            (ctx_0?: better_call.Context<"/ok", {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            }> | undefined): Promise<{
                ok: boolean;
            }>;
            path: "/ok";
            options: {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        error: {
            (ctx_0?: better_call.Context<"/error", {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            }> | undefined): Promise<Response>;
            path: "/error";
            options: {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signInOAuth: {
            (ctx_0: better_call.Context<"/sign-in/social", {
                method: "POST";
                requireHeaders: true;
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    provider: zod.ZodEnum<["github", ...("apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter")[]]>;
                    dontRememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
            }>): Promise<{
                url: string;
                state: string;
                codeVerifier: string;
                redirect: boolean;
            }>;
            path: "/sign-in/social";
            options: {
                method: "POST";
                requireHeaders: true;
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    provider: zod.ZodEnum<["github", ...("apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter")[]]>;
                    dontRememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "spotify" | "twitch" | "twitter";
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        callbackOAuth: {
            (ctx_0: better_call.Context<"/callback/:id", {
                method: "GET";
                query: zod.ZodObject<{
                    state: zod.ZodString;
                    code: zod.ZodOptional<zod.ZodString>;
                    error: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                }, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                }>;
                metadata: {
                    isAction: false;
                };
            }>): Promise<never>;
            path: "/callback/:id";
            options: {
                method: "GET";
                query: zod.ZodObject<{
                    state: zod.ZodString;
                    code: zod.ZodOptional<zod.ZodString>;
                    error: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                }, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                }>;
                metadata: {
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        getCSRFToken: {
            (ctx_0?: better_call.Context<"/csrf", {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            }> | undefined): Promise<{
                csrfToken: string;
            }>;
            path: "/csrf";
            options: {
                method: "GET";
                metadata: {
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        getSession: {
            (ctx_0: better_call.Context<"/session", {
                method: "GET";
                requireHeaders: true;
            }>): Promise<{
                session: Prettify<UnionToIntersection<{
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                } & (O extends BetterAuthOptions ? O["plugins"] extends (infer T)[] ? T extends {
                    schema: {
                        session: {
                            fields: infer Field;
                        };
                    };
                } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : O extends Auth ? O["options"]["plugins"] extends (infer T)[] ? T extends {
                    schema: {
                        session: {
                            fields: infer Field;
                        };
                    };
                } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : {})>>;
                user: Prettify<UnionToIntersection<{
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                } & (O extends BetterAuthOptions ? O["plugins"] extends (infer T_1)[] ? T_1 extends {
                    schema: {
                        user: {
                            fields: infer Field_1;
                        };
                    };
                } ? Field_1 extends Record<infer Key extends string | number | symbol, FieldAttribute> ? Prettify<{ [key_1 in Key as Field_1[key_1]["required"] extends false ? never : Field_1[key_1]["defaultValue"] extends string | number | boolean | Function | Date ? key_1 : never]: InferFieldOutput<Field_1[key_1]>; } & { [key_2 in Key as Field_1[key_2]["returned"] extends false ? never : key_2]?: InferFieldOutput<Field_1[key_2]> | undefined; }> : {} : {} : {} : O extends Auth ? O["options"]["plugins"] extends (infer T_1)[] ? T_1 extends {
                    schema: {
                        user: {
                            fields: infer Field_1;
                        };
                    };
                } ? Field_1 extends Record<infer Key extends string | number | symbol, FieldAttribute> ? Prettify<{ [key_1 in Key as Field_1[key_1]["required"] extends false ? never : Field_1[key_1]["defaultValue"] extends string | number | boolean | Function | Date ? key_1 : never]: InferFieldOutput<Field_1[key_1]>; } & { [key_2 in Key as Field_1[key_2]["returned"] extends false ? never : key_2]?: InferFieldOutput<Field_1[key_2]> | undefined; }> : {} : {} : {} : {})>>;
            } | null>;
            path: "/session";
            options: {
                method: "GET";
                requireHeaders: true;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signOut: {
            (ctx_0?: better_call.Context<"/sign-out", {
                method: "POST";
                body: zod.ZodOptional<zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    callbackURL?: string | undefined;
                }, {
                    callbackURL?: string | undefined;
                }>>;
            }> | undefined): Promise<null>;
            path: "/sign-out";
            options: {
                method: "POST";
                body: zod.ZodOptional<zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    callbackURL?: string | undefined;
                }, {
                    callbackURL?: string | undefined;
                }>>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signUpEmail: {
            (ctx_0: better_call.Context<"/sign-up/email", {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    name: zod.ZodString;
                    email: zod.ZodString;
                    password: zod.ZodString;
                    image: zod.ZodOptional<zod.ZodString>;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }, {
                    password: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }>;
            }>): Promise<{
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                };
                session: {
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                };
            } | null>;
            path: "/sign-up/email";
            options: {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    name: zod.ZodString;
                    email: zod.ZodString;
                    password: zod.ZodString;
                    image: zod.ZodOptional<zod.ZodString>;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }, {
                    password: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signInEmail: {
            (ctx_0: better_call.Context<"/sign-in/email", {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    password: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    dontRememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
            }>): Promise<{
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                };
                session: {
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                };
                redirect: boolean;
                url: string | undefined;
            }>;
            path: "/sign-in/email";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    password: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    dontRememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        forgetPassword: {
            (ctx_0: better_call.Context<"/forget-password", {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    redirectTo: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    redirectTo: string;
                }, {
                    email: string;
                    redirectTo: string;
                }>;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/forget-password";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    redirectTo: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    redirectTo: string;
                }, {
                    email: string;
                    redirectTo: string;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        resetPassword: {
            (ctx_0: better_call.Context<"/reset-password", {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    currentURL: string;
                }, {
                    currentURL: string;
                }>>;
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    callbackURL?: string | undefined;
                }, {
                    newPassword: string;
                    callbackURL?: string | undefined;
                }>;
            }>): Promise<{
                error: string;
                data: null;
            } | {
                error: null;
                data: {
                    status: boolean;
                    url: string | undefined;
                    redirect: boolean;
                };
            } | null>;
            path: "/reset-password";
            options: {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    currentURL: string;
                }, {
                    currentURL: string;
                }>>;
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    callbackURL?: string | undefined;
                }, {
                    newPassword: string;
                    callbackURL?: string | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        verifyEmail: {
            (ctx_0: better_call.Context<"/verify-email", {
                method: "GET";
                query: zod.ZodObject<{
                    token: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/verify-email";
            options: {
                method: "GET";
                query: zod.ZodObject<{
                    token: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        sendVerificationEmail: {
            (ctx_0: better_call.Context<"/send-verification-email", {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    callbackURL?: string | undefined;
                }, {
                    email: string;
                    callbackURL?: string | undefined;
                }>;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/send-verification-email";
            options: {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    currentURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    callbackURL?: string | undefined;
                }, {
                    email: string;
                    callbackURL?: string | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        changePassword: {
            (ctx_0: better_call.Context<"/user/change-password", {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    currentPassword: zod.ZodString;
                    revokeOtherSessions: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            }>): Promise<Prettify<{
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            }> | null>;
            path: "/user/change-password";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    currentPassword: zod.ZodString;
                    revokeOtherSessions: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        setPassword: {
            (ctx_0: better_call.Context<"/user/set-password", {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            }>): Promise<Prettify<{
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            }> | null>;
            path: "/user/set-password";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        updateUser: {
            (ctx_0: better_call.Context<"/user/update", {
                method: "POST";
                body: zod.ZodObject<{
                    name: zod.ZodOptional<zod.ZodString>;
                    image: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    name?: string | undefined;
                    image?: string | undefined;
                }, {
                    name?: string | undefined;
                    image?: string | undefined;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            }>): Promise<{
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            } | null>;
            path: "/user/update";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    name: zod.ZodOptional<zod.ZodString>;
                    image: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    name?: string | undefined;
                    image?: string | undefined;
                }, {
                    name?: string | undefined;
                    image?: string | undefined;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        forgetPasswordCallback: {
            (ctx_0: better_call.Context<"/reset-password/:token", {
                method: "GET";
            }>): Promise<never>;
            path: "/reset-password/:token";
            options: {
                method: "GET";
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        listSessions: {
            (ctx_0: better_call.Context<"/user/list-sessions", {
                method: "GET";
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            }>): Promise<Prettify<UnionToIntersection<{
                id: string;
                userId: string;
                expiresAt: Date;
                ipAddress?: string | undefined;
                userAgent?: string | undefined;
            } & (O extends BetterAuthOptions ? O["plugins"] extends (infer T)[] ? T extends {
                schema: {
                    session: {
                        fields: infer Field;
                    };
                };
            } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : O extends Auth ? O["options"]["plugins"] extends (infer T)[] ? T extends {
                schema: {
                    session: {
                        fields: infer Field;
                    };
                };
            } ? Field extends Record<string, FieldAttribute> ? { [key in keyof Field]: InferFieldOutput<Field[key]>; } : {} : {} : {} : {})>>[]>;
            path: "/user/list-sessions";
            options: {
                method: "GET";
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        revokeSession: {
            (ctx_0: better_call.Context<"/user/revoke-session", {
                method: "POST";
                body: zod.ZodObject<{
                    id: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/user/revoke-session";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    id: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
                }>;
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        revokeSessions: {
            (ctx_0: better_call.Context<"/user/revoke-sessions", {
                method: "POST";
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            }>): Promise<{
                status: boolean;
            } | null>;
            path: "/user/revoke-sessions";
            options: {
                method: "POST";
                use: Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Prettify<{
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        }>;
                        user: Prettify<{
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        }>;
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    } & UnionToIntersection<O["plugins"] extends (infer T)[] ? T extends BetterAuthPlugin ? T["endpoints"] : {} : {}>>;
    options: O;
    $Infer: {
        Session: {
            session: Prettify$1<InferSession<O>>;
            user: Prettify$1<InferUser<O>>;
        };
    } & InferPluginTypes<O>;
};
type Auth = {
    handler: (request: Request) => Promise<Response>;
    api: InferAPI<ReturnType<typeof router>["endpoints"]>;
    options: BetterAuthOptions;
};

export { ok as $, type Auth as A, type BetterAuthPlugin as B, getSessionFromCtx as C, sessionMiddleware as D, listSessions as E, type FieldAttribute as F, type GenericEndpointContext as G, type HookEndpointContext as H, type InferFieldOutput as I, revokeSession as J, revokeSessions as K, signOut as L, forgetPassword as M, forgetPasswordCallback as N, resetPassword as O, type PluginSchema as P, createEmailVerificationToken as Q, type RateLimit as R, type SessionAdapter as S, sendVerificationEmail as T, verifyEmail as U, updateUser as V, type Where as W, changePassword as X, setPassword as Y, getCSRFToken as Z, error as _, type BetterAuthOptions as a, signUpEmail as a0, csrfMiddleware as a1, betterAuth as a2, createAuthEndpoint as b, createAuthMiddleware as c, type AuthEndpoint as d, type AuthMiddleware as e, type AuthContext as f, getCookies as g, createCookieGetter as h, type BetterAuthCookies as i, deleteSessionCookie as j, createLogger as k, logger as l, type InferSession as m, type InferUser as n, optionsMiddleware as o, parseSetCookieHeader as p, type InferPluginTypes as q, init as r, setSessionCookie as s, type Adapter as t, getEndpoints as u, router as v, signInOAuth as w, signInEmail as x, callbackOAuth as y, getSession as z };
