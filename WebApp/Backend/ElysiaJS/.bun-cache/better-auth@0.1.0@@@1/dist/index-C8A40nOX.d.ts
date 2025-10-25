import * as arctic from 'arctic';
import { OAuth2Tokens } from 'arctic';
import { z } from 'zod';
import { L as LiteralString, P as Prettify } from './helper-C1ihmerM.js';

declare const accountSchema: z.ZodObject<{
    id: z.ZodString;
    providerId: z.ZodString;
    accountId: z.ZodString;
    userId: z.ZodString;
    accessToken: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    refreshToken: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    idToken: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    /**
     * Access token expires at
     */
    expiresAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    /**
     * Password is only stored in the credential provider
     */
    password: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    providerId: string;
    accountId: string;
    userId: string;
    accessToken?: string | null | undefined;
    refreshToken?: string | null | undefined;
    idToken?: string | null | undefined;
    expiresAt?: Date | null | undefined;
    password?: string | null | undefined;
}, {
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
declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodEffects<z.ZodString, string, string>;
    emailVerified: z.ZodDefault<z.ZodBoolean>;
    name: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | undefined;
}, {
    id: string;
    email: string;
    name: string;
    emailVerified?: boolean | undefined;
    image?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
declare const sessionSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    expiresAt: z.ZodDate;
    ipAddress: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    expiresAt: Date;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
}, {
    id: string;
    userId: string;
    expiresAt: Date;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
}>;
type User = z.infer<typeof userSchema>;
type Account = z.infer<typeof accountSchema>;
type Session = z.infer<typeof sessionSchema>;

interface TwitterProfile {
    data: {
        /**
         * Unique identifier of this user. This is returned as a string in order to avoid complications with languages and tools
         * that cannot handle large integers.
         */
        id: string;
        /** The friendly name of this user, as shown on their profile. */
        name: string;
        /** @note Email is currently unsupported by Twitter.  */
        email?: string;
        /** The Twitter handle (screen name) of this user. */
        username: string;
        /**
         * The location specified in the user's profile, if the user provided one.
         * As this is a freeform value, it may not indicate a valid location, but it may be fuzzily evaluated when performing searches with location queries.
         *
         * To return this field, add `user.fields=location` in the authorization request's query parameter.
         */
        location?: string;
        /**
         * This object and its children fields contain details about text that has a special meaning in the user's description.
         *
         *To return this field, add `user.fields=entities` in the authorization request's query parameter.
         */
        entities?: {
            /** Contains details about the user's profile website. */
            url: {
                /** Contains details about the user's profile website. */
                urls: Array<{
                    /** The start position (zero-based) of the recognized user's profile website. All start indices are inclusive. */
                    start: number;
                    /** The end position (zero-based) of the recognized user's profile website. This end index is exclusive. */
                    end: number;
                    /** The URL in the format entered by the user. */
                    url: string;
                    /** The fully resolved URL. */
                    expanded_url: string;
                    /** The URL as displayed in the user's profile. */
                    display_url: string;
                }>;
            };
            /** Contains details about URLs, Hashtags, Cashtags, or mentions located within a user's description. */
            description: {
                hashtags: Array<{
                    start: number;
                    end: number;
                    tag: string;
                }>;
            };
        };
        /**
         * Indicate if this user is a verified Twitter user.
         *
         * To return this field, add `user.fields=verified` in the authorization request's query parameter.
         */
        verified?: boolean;
        /**
         * The text of this user's profile description (also known as bio), if the user provided one.
         *
         * To return this field, add `user.fields=description` in the authorization request's query parameter.
         */
        description?: string;
        /**
         * The URL specified in the user's profile, if present.
         *
         * To return this field, add `user.fields=url` in the authorization request's query parameter.
         */
        url?: string;
        /** The URL to the profile image for this user, as shown on the user's profile. */
        profile_image_url?: string;
        protected?: boolean;
        /**
         * Unique identifier of this user's pinned Tweet.
         *
         *  You can obtain the expanded object in `includes.tweets` by adding `expansions=pinned_tweet_id` in the authorization request's query parameter.
         */
        pinned_tweet_id?: string;
        created_at?: string;
    };
    includes?: {
        tweets?: Array<{
            id: string;
            text: string;
        }>;
    };
    [claims: string]: unknown;
}
interface TwitterOption {
    clientId: string;
    clientSecret: string;
    redirectURI?: string;
}
declare const twitter: (options: TwitterOption) => {
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
};

interface TwitchProfile {
    /**
     * The sub of the user
     */
    sub: string;
    /**
     * The preferred username of the user
     */
    preferred_username: string;
    /**
     * The email of the user
     */
    email: string;
    /**
     * The picture of the user
     */
    picture: string;
}
interface TwitchOptions {
    clientId: string;
    clientSecret: string;
    redirectURI?: string;
}
declare const twitch: (options: TwitchOptions) => {
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
};

interface SpotifyProfile {
    id: string;
    display_name: string;
    email: string;
    images: {
        url: string;
    }[];
}
interface SpotifyOptions {
    clientId: string;
    clientSecret: string;
    redirectURI?: string;
}
declare const spotify: (options: SpotifyOptions) => {
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
};

interface GoogleProfile {
    aud: string;
    azp: string;
    email: string;
    email_verified: boolean;
    exp: number;
    /**
     * The family name of the user, or last name in most
     * Western languages.
     */
    family_name: string;
    given_name: string;
    hd?: string;
    iat: number;
    iss: string;
    jti?: string;
    locale?: string;
    name: string;
    nbf?: number;
    picture: string;
    sub: string;
}
interface GoogleOptions extends ProviderOptions {
}
declare const google: (options: GoogleOptions) => {
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
};

interface GithubProfile {
    login: string;
    id: string;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
    hireable: boolean;
    bio: string;
    twitter_username: string;
    public_repos: string;
    public_gists: string;
    followers: string;
    following: string;
    created_at: string;
    updated_at: string;
    private_gists: string;
    total_private_repos: string;
    owned_private_repos: string;
    disk_usage: string;
    collaborators: string;
    two_factor_authentication: boolean;
    plan: {
        name: string;
        space: string;
        private_repos: string;
        collaborators: string;
    };
    first_name: string;
    last_name: string;
}
interface GithubOptions {
    clientId: string;
    clientSecret: string;
    redirectURI?: string;
}
declare const github: ({ clientId, clientSecret, redirectURI, }: GithubOptions) => {
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
};

interface FacebookProfile {
    id: string;
    name: string;
    email: string;
    email_verified: boolean;
    picture: {
        data: {
            height: number;
            is_silhouette: boolean;
            url: string;
            width: number;
        };
    };
}
interface FacebookOptions {
    clientId: string;
    clientSecret: string;
    redirectURI?: string;
}
declare const facebook: (options: FacebookOptions) => {
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
};

interface DiscordProfile extends Record<string, any> {
    /** the user's id (i.e. the numerical snowflake) */
    id: string;
    /** the user's username, not unique across the platform */
    username: string;
    /** the user's Discord-tag */
    discriminator: string;
    /** the user's display name, if it is set  */
    global_name: string | null;
    /**
     * the user's avatar hash:
     * https://discord.com/developers/docs/reference#image-formatting
     */
    avatar: string | null;
    /** whether the user belongs to an OAuth2 application */
    bot?: boolean;
    /**
     * whether the user is an Official Discord System user (part of the urgent
     * message system)
     */
    system?: boolean;
    /** whether the user has two factor enabled on their account */
    mfa_enabled: boolean;
    /**
     * the user's banner hash:
     * https://discord.com/developers/docs/reference#image-formatting
     */
    banner: string | null;
    /** the user's banner color encoded as an integer representation of hexadecimal color code */
    accent_color: number | null;
    /**
     * the user's chosen language option:
     * https://discord.com/developers/docs/reference#locales
     */
    locale: string;
    /** whether the email on this account has been verified */
    verified: boolean;
    /** the user's email */
    email: string;
    /**
     * the flags on a user's account:
     * https://discord.com/developers/docs/resources/user#user-object-user-flags
     */
    flags: number;
    /**
     * the type of Nitro subscription on a user's account:
     * https://discord.com/developers/docs/resources/user#user-object-premium-types
     */
    premium_type: number;
    /**
     * the public flags on a user's account:
     * https://discord.com/developers/docs/resources/user#user-object-user-flags
     */
    public_flags: number;
    /** undocumented field; corresponds to the user's custom nickname */
    display_name: string | null;
    /**
     * undocumented field; corresponds to the Discord feature where you can e.g.
     * put your avatar inside of an ice cube
     */
    avatar_decoration: string | null;
    /**
     * undocumented field; corresponds to the premium feature where you can
     * select a custom banner color
     */
    banner_color: string | null;
    /** undocumented field; the CDN URL of their profile picture */
    image_url: string;
}
interface DiscordOptions {
    clientId: string;
    clientSecret: string;
    redirectURI?: string;
}
declare const discord: (options: DiscordOptions) => {
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
};

interface AppleProfile {
    /**
     * The subject registered claim identifies the principal that’s the subject
     * of the identity token. Because this token is for your app, the value is
     * the unique identifier for the user.
     */
    sub: string;
    /**
     * A String value representing the user's email address.
     * The email address is either the user's real email address or the proxy
     * address, depending on their status private email relay service.
     */
    email: string;
    /**
     * A string or Boolean value that indicates whether the service verifies
     * the email. The value can either be a string ("true" or "false") or a
     * Boolean (true or false). The system may not verify email addresses for
     * Sign in with Apple at Work & School users, and this claim is "false" or
     * false for those users.
     */
    email_verified: true | "true";
    /**
     * A string or Boolean value that indicates whether the email that the user
     * shares is the proxy address. The value can either be a string ("true" or
     * "false") or a Boolean (true or false).
     */
    is_private_email: boolean;
    /**
     * An Integer value that indicates whether the user appears to be a real
     * person. Use the value of this claim to mitigate fraud. The possible
     * values are: 0 (or Unsupported), 1 (or Unknown), 2 (or LikelyReal). For
     * more information, see ASUserDetectionStatus. This claim is present only
     * in iOS 14 and later, macOS 11 and later, watchOS 7 and later, tvOS 14
     * and later. The claim isn’t present or supported for web-based apps.
     */
    real_user_status: number;
    /**
     * The user’s full name in the format provided during the authorization
     * process.
     */
    name: string;
}
interface AppleOptions {
    clientId: string;
    clientSecret: string;
    redirectURI?: string;
}
declare const apple: (options: AppleOptions) => {
    id: "apple";
    name: string;
    createAuthorizationURL({ state, scopes, redirectURI }: {
        state: string;
        codeVerifier: string;
        scopes?: string[];
        redirectURI?: string;
    }): URL;
    validateAuthorizationCode: (code: string, codeVerifier: string | undefined, redirectURI: string | undefined) => Promise<OAuth2Tokens>;
    getUserInfo(token: OAuth2Tokens): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            emailVerified: boolean;
        };
        data: AppleProfile;
    } | null>;
};

interface OAuthProvider<T extends Record<string, any> = Record<string, any>> {
    id: LiteralString;
    createAuthorizationURL: (data: {
        state: string;
        codeVerifier: string;
        scopes?: string[];
        redirectURI?: string;
    }) => URL;
    name: string;
    validateAuthorizationCode: (code: string, codeVerifier?: string, redirectURI?: string) => Promise<OAuth2Tokens>;
    getUserInfo: (token: OAuth2Tokens) => Promise<{
        user: Omit<User, "createdAt" | "updatedAt">;
        data: T;
    } | null>;
    refreshAccessToken?: (refreshToken: string) => Promise<OAuth2Tokens>;
    revokeToken?: (token: string) => Promise<void>;
}
type OAuthProviderList = typeof oAuthProviderList;
type ProviderOptions = {
    /**
     * The client ID of your application
     */
    clientId: string;
    /**
     * The client secret of your application
     */
    clientSecret: string;
    /**
     * The scopes you want to request from the provider
     */
    scope?: string[];
    /**
     * The redirect URL for your application. This is where the provider will
     * redirect the user after the sign in process. Make sure this URL is
     * whitelisted in the provider's dashboard.
     */
    redirectURI?: string;
};

declare const oAuthProviders: {
    apple: (options: AppleOptions) => {
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
    };
    discord: (options: DiscordOptions) => {
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
    };
    facebook: (options: FacebookOptions) => {
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
    };
    github: ({ clientId, clientSecret, redirectURI, }: GithubOptions) => {
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
    };
    google: (options: GoogleOptions) => {
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
    };
    spotify: (options: SpotifyOptions) => {
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
    };
    twitch: (options: TwitchOptions) => {
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
    };
    twitter: (options: TwitterOption) => {
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
    };
};
declare const oAuthProviderList: ["github", ...(keyof typeof oAuthProviders)[]];
type SocialProviders = typeof oAuthProviders extends {
    [key in infer K]: infer V;
} ? V extends (options: infer V) => any ? Partial<Record<K, Prettify<V & {
    enabled?: boolean;
}>>> : never : never;

export { type Account as A, type DiscordProfile as D, type FacebookProfile as F, type GithubProfile as G, type OAuthProviderList as O, type ProviderOptions as P, type Session as S, type TwitchProfile as T, type User as U, type AppleProfile as a, type GoogleProfile as b, type SpotifyProfile as c, type TwitterProfile as d, type SocialProviders as e, type OAuthProvider as f, oAuthProviderList as g, type GithubOptions as h, github as i, type GoogleOptions as j, google as k, type AppleOptions as l, apple as m, type DiscordOptions as n, oAuthProviders as o, discord as p, type SpotifyOptions as q, type TwitchOptions as r, spotify as s, twitch as t, type FacebookOptions as u, facebook as v, type TwitterOption as w, twitter as x };
