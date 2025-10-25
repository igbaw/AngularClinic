import { U as User, S as Session } from './index-C8A40nOX.js';
import * as better_call from 'better-call';
import { z, ZodObject, ZodOptional, ZodArray, ZodLiteral } from 'zod';
import { P as Prettify } from './helper-C1ihmerM.js';
import { A as AccessControl, R as Role, S as StatementsPrimitive, g as defaultRoles } from './statement-CU-fdHXK.js';
import * as _better_fetch_fetch from '@better-fetch/fetch';
import { BetterFetch, BetterFetchOption } from '@better-fetch/fetch';
import { H as HookEndpointContext } from './index-BMranMWG.js';
import * as nanostores from 'nanostores';
import { atom } from 'nanostores';
import * as _simplewebauthn_types from '@simplewebauthn/types';
import { CredentialDeviceType, PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types';

declare const organizationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    logo: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodUnion<[z.ZodRecord<z.ZodString, z.ZodString>, z.ZodEffects<z.ZodString, any, string>]>>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: Date;
    slug: string;
    metadata?: any;
    logo?: string | undefined;
}, {
    id: string;
    name: string;
    createdAt: Date;
    slug: string;
    metadata?: string | Record<string, string> | undefined;
    logo?: string | undefined;
}>;
declare const memberSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    organizationId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodEnum<["admin", "member", "owner"]>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    email: string;
    createdAt: Date;
    organizationId: string;
    role: "member" | "admin" | "owner";
}, {
    id: string;
    userId: string;
    email: string;
    createdAt: Date;
    organizationId: string;
    role: "member" | "admin" | "owner";
}>;
declare const invitationSchema: z.ZodObject<{
    id: z.ZodString;
    organizationId: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<["admin", "member", "owner"]>;
    status: z.ZodDefault<z.ZodEnum<["pending", "accepted", "rejected", "canceled"]>>;
    /**
     * The id of the user who invited the user.
     */
    inviterId: z.ZodString;
    expiresAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    expiresAt: Date;
    status: "pending" | "accepted" | "rejected" | "canceled";
    email: string;
    organizationId: string;
    role: "member" | "admin" | "owner";
    inviterId: string;
}, {
    id: string;
    expiresAt: Date;
    email: string;
    organizationId: string;
    role: "member" | "admin" | "owner";
    inviterId: string;
    status?: "pending" | "accepted" | "rejected" | "canceled" | undefined;
}>;
type Organization = z.infer<typeof organizationSchema>;
type Member = z.infer<typeof memberSchema>;
type Invitation = z.infer<typeof invitationSchema>;

interface OrganizationOptions {
    /**
     * Configure whether new users are able to create new organizations.
     * You can also pass a function that returns a boolean.
     *
     * 	@example
     * ```ts
     * allowUserToCreateOrganization: async (user) => {
     * 		const plan = await getUserPlan(user);
     *      return plan.name === "pro";
     * }
     * ```
     * @default true
     */
    allowUserToCreateOrganization?: boolean | ((user: User) => Promise<boolean> | boolean);
    /**
     * The maximum number of organizations a user can create.
     *
     * You can also pass a function that returns a boolean
     */
    organizationLimit?: number | ((user: User) => Promise<boolean> | boolean);
    /**
     * The role that is assigned to the creator of the organization.
     *
     * @default "admin"
     */
    creatorRole?: "admin" | "owner";
    /**
     * The number of memberships a user can have in an organization.
     *
     * @default "unlimited"
     */
    membershipLimit?: number;
    /**
     * Configure the roles and permissions for the organization plugin.
     *
     */
    ac?: AccessControl;
    /**
     * Custom permissions for roles.
     */
    roles?: {
        [key in "admin" | "member" | "owner"]?: Role<any>;
    };
    /**
     * The expiration time for the invitation link.
     *
     * @default 48 hours
     */
    invitationExpiresIn?: number;
    /**
     * Send an email with the
     * invitation link to the user.
     *
     * Note: Better Auth doesn't
     * generate invitation URLs.
     * You'll need to construct the
     * URL using the invitation ID
     * and pass it to the
     * acceptInvitation endpoint for
     * the user to accept the
     * invitation.
     *
     * @example
     * ```ts
     * sendInvitationEmail: async (data) => {
     * 	const url = `https://yourapp.com/organization/
     * accept-invitation?id=${data.id}`;
     * 	await sendEmail(data.email, "Invitation to join
     * organization", `Click the link to join the
     * organization: ${url}`);
     * }
     * ```
     */
    sendInvitationEmail?: (data: {
        /**
         * the invitation id
         */
        id: string;
        /**
         * the role of the user
         */
        role: "admin" | "owner" | "member";
        /**
         * the email of the user
         */
        email: string;
        /**
         * the organization the user is invited to
         */
        organization: Organization;
        /**
         * the member who is inviting the user
         */
        inviter: Member & {
            user: User;
        };
    }, 
    /**
     * The request object
     */
    request?: Request) => Promise<void>;
}
/**
 * Organization plugin for Better Auth. Organization allows you to create teams, members,
 * and manage access control for your users.
 *
 * @example
 * ```ts
 * const auth = createAuth({
 * 	plugins: [
 * 		organization({
 * 			allowUserToCreateOrganization: true,
 * 		}),
 * 	],
 * });
 * ```
 */
declare const organization: <O extends OrganizationOptions>(options?: O) => {
    id: "organization";
    endpoints: {
        hasPermission: {
            (ctx_0: better_call.Context<"/organization/has-permission", {
                method: "POST";
                requireHeaders: true;
                body: ZodObject<{
                    permission: ZodObject<{ [key in keyof (O["ac"] extends AccessControl<infer S extends StatementsPrimitive> ? S extends Record<string, any> ? S & {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                    } : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                    } : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                    })]: ZodOptional<ZodArray<ZodLiteral<(O["ac"] extends AccessControl<infer S extends StatementsPrimitive> ? S extends Record<string, any> ? S & {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                    } : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                    } : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                    })[key][number]>>>; }>;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>[];
            }>): Promise<{
                error: string;
                success: boolean;
            } | {
                error: null;
                success: boolean;
            }>;
            path: "/organization/has-permission";
            options: {
                method: "POST";
                requireHeaders: true;
                body: ZodObject<{
                    permission: ZodObject<{ [key in keyof (O["ac"] extends AccessControl<infer S extends StatementsPrimitive> ? S extends Record<string, any> ? S & {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                    } : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                    } : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                    })]: ZodOptional<ZodArray<ZodLiteral<(O["ac"] extends AccessControl<infer S extends StatementsPrimitive> ? S extends Record<string, any> ? S & {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                    } : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                    } : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                    })[key][number]>>>; }>;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        createOrganization: {
            (ctx_0: better_call.Context<"/organization/create", {
                method: "POST";
                body: ZodObject<{
                    name: z.ZodString;
                    slug: z.ZodString;
                    userId: ZodOptional<z.ZodString>;
                    logo: ZodOptional<z.ZodString>;
                    metadata: ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    slug: string;
                    userId?: string | undefined;
                    metadata?: Record<string, string> | undefined;
                    logo?: string | undefined;
                }, {
                    name: string;
                    slug: string;
                    userId?: string | undefined;
                    metadata?: Record<string, string> | undefined;
                    logo?: string | undefined;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            }>): Promise<{
                metadata: any;
                members: {
                    user: {
                        id: string;
                        name: string;
                        email: string;
                        image: string | undefined;
                    };
                    id: string;
                    userId: string;
                    email: string;
                    createdAt: Date;
                    organizationId: string;
                    role: "member" | "admin" | "owner";
                }[];
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                logo?: string | undefined;
            } | null>;
            path: "/organization/create";
            options: {
                method: "POST";
                body: ZodObject<{
                    name: z.ZodString;
                    slug: z.ZodString;
                    userId: ZodOptional<z.ZodString>;
                    logo: ZodOptional<z.ZodString>;
                    metadata: ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    slug: string;
                    userId?: string | undefined;
                    metadata?: Record<string, string> | undefined;
                    logo?: string | undefined;
                }, {
                    name: string;
                    slug: string;
                    userId?: string | undefined;
                    metadata?: Record<string, string> | undefined;
                    logo?: string | undefined;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        updateOrganization: {
            (ctx_0: better_call.Context<"/organization/update", {
                method: "POST";
                body: ZodObject<{
                    data: ZodObject<{
                        name: ZodOptional<ZodOptional<z.ZodString>>;
                        slug: ZodOptional<ZodOptional<z.ZodString>>;
                    }, "strip", z.ZodTypeAny, {
                        name?: string | undefined;
                        slug?: string | undefined;
                    }, {
                        name?: string | undefined;
                        slug?: string | undefined;
                    }>;
                    orgId: ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    data: {
                        name?: string | undefined;
                        slug?: string | undefined;
                    };
                    orgId?: string | undefined;
                }, {
                    data: {
                        name?: string | undefined;
                        slug?: string | undefined;
                    };
                    orgId?: string | undefined;
                }>;
                requireHeaders: true;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions>[];
            }>): Promise<{
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | undefined;
            } | null>;
            path: "/organization/update";
            options: {
                method: "POST";
                body: ZodObject<{
                    data: ZodObject<{
                        name: ZodOptional<ZodOptional<z.ZodString>>;
                        slug: ZodOptional<ZodOptional<z.ZodString>>;
                    }, "strip", z.ZodTypeAny, {
                        name?: string | undefined;
                        slug?: string | undefined;
                    }, {
                        name?: string | undefined;
                        slug?: string | undefined;
                    }>;
                    orgId: ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    data: {
                        name?: string | undefined;
                        slug?: string | undefined;
                    };
                    orgId?: string | undefined;
                }, {
                    data: {
                        name?: string | undefined;
                        slug?: string | undefined;
                    };
                    orgId?: string | undefined;
                }>;
                requireHeaders: true;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        deleteOrganization: {
            (ctx_0: better_call.Context<"/organization/delete", {
                method: "POST";
                body: ZodObject<{
                    orgId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    orgId: string;
                }, {
                    orgId: string;
                }>;
                requireHeaders: true;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions>[];
            }>): Promise<string | null>;
            path: "/organization/delete";
            options: {
                method: "POST";
                body: ZodObject<{
                    orgId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    orgId: string;
                }, {
                    orgId: string;
                }>;
                requireHeaders: true;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        setActiveOrganization: {
            (ctx_0: better_call.Context<"/organization/activate", {
                method: "POST";
                body: ZodObject<{
                    orgId: ZodOptional<z.ZodNullable<z.ZodString>>;
                }, "strip", z.ZodTypeAny, {
                    orgId?: string | null | undefined;
                }, {
                    orgId?: string | null | undefined;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            }>): Promise<{
                invitations: {
                    id: string;
                    expiresAt: Date;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    email: string;
                    organizationId: string;
                    role: "member" | "admin" | "owner";
                    inviterId: string;
                }[];
                members: {
                    user: {
                        id: string;
                        name: string;
                        email: string;
                        image: string | undefined;
                    };
                    id: string;
                    userId: string;
                    email: string;
                    createdAt: Date;
                    organizationId: string;
                    role: "member" | "admin" | "owner";
                }[];
                id?: string | undefined;
                name?: string | undefined;
                createdAt?: Date | undefined;
                slug?: string | undefined;
                metadata?: any;
                logo?: string | undefined;
            } | null>;
            path: "/organization/activate";
            options: {
                method: "POST";
                body: ZodObject<{
                    orgId: ZodOptional<z.ZodNullable<z.ZodString>>;
                }, "strip", z.ZodTypeAny, {
                    orgId?: string | null | undefined;
                }, {
                    orgId?: string | null | undefined;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        getFullOrganization: {
            (ctx_0: better_call.Context<"/organization/get-full", {
                method: "GET";
                query: ZodObject<{
                    orgId: ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    orgId?: string | undefined;
                }, {
                    orgId?: string | undefined;
                }>;
                requireHeaders: true;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            }>): Promise<{
                invitations: {
                    id: string;
                    expiresAt: Date;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    email: string;
                    organizationId: string;
                    role: "member" | "admin" | "owner";
                    inviterId: string;
                }[];
                members: {
                    user: {
                        id: string;
                        name: string;
                        email: string;
                        image: string | undefined;
                    };
                    id: string;
                    userId: string;
                    email: string;
                    createdAt: Date;
                    organizationId: string;
                    role: "member" | "admin" | "owner";
                }[];
                id?: string | undefined;
                name?: string | undefined;
                createdAt?: Date | undefined;
                slug?: string | undefined;
                metadata?: any;
                logo?: string | undefined;
            } | null>;
            path: "/organization/get-full";
            options: {
                method: "GET";
                query: ZodObject<{
                    orgId: ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    orgId?: string | undefined;
                }, {
                    orgId?: string | undefined;
                }>;
                requireHeaders: true;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        listOrganization: {
            (ctx_0?: better_call.Context<"/organization/list", {
                method: "GET";
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            }> | undefined): Promise<{
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | undefined;
            }[]>;
            path: "/organization/list";
            options: {
                method: "GET";
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        createInvitation: {
            (ctx_0: better_call.Context<"/organization/invite-member", {
                method: "POST";
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
                body: ZodObject<{
                    email: z.ZodString;
                    role: z.ZodEnum<["admin", "member", "owner"]>;
                    organizationId: ZodOptional<z.ZodString>;
                    resend: ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    role: "member" | "admin" | "owner";
                    organizationId?: string | undefined;
                    resend?: boolean | undefined;
                }, {
                    email: string;
                    role: "member" | "admin" | "owner";
                    organizationId?: string | undefined;
                    resend?: boolean | undefined;
                }>;
            }>): Promise<{
                id: string;
                expiresAt: Date;
                status: "pending" | "accepted" | "rejected" | "canceled";
                email: string;
                organizationId: string;
                role: "member" | "admin" | "owner";
                inviterId: string;
            } | null>;
            path: "/organization/invite-member";
            options: {
                method: "POST";
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
                body: ZodObject<{
                    email: z.ZodString;
                    role: z.ZodEnum<["admin", "member", "owner"]>;
                    organizationId: ZodOptional<z.ZodString>;
                    resend: ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    role: "member" | "admin" | "owner";
                    organizationId?: string | undefined;
                    resend?: boolean | undefined;
                }, {
                    email: string;
                    role: "member" | "admin" | "owner";
                    organizationId?: string | undefined;
                    resend?: boolean | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        cancelInvitation: {
            (ctx_0: better_call.Context<"/organization/cancel-invitation", {
                method: "POST";
                body: ZodObject<{
                    invitationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    invitationId: string;
                }, {
                    invitationId: string;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            }>): Promise<{
                id: string;
                expiresAt: Date;
                status: "pending" | "accepted" | "rejected" | "canceled";
                email: string;
                organizationId: string;
                role: "member" | "admin" | "owner";
                inviterId: string;
            } | null>;
            path: "/organization/cancel-invitation";
            options: {
                method: "POST";
                body: ZodObject<{
                    invitationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    invitationId: string;
                }, {
                    invitationId: string;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        acceptInvitation: {
            (ctx_0: better_call.Context<"/organization/accept-invitation", {
                method: "POST";
                body: ZodObject<{
                    invitationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    invitationId: string;
                }, {
                    invitationId: string;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            }>): Promise<{
                invitation: {
                    id: string;
                    expiresAt: Date;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    email: string;
                    organizationId: string;
                    role: "member" | "admin" | "owner";
                    inviterId: string;
                };
                member: {
                    id: string;
                    userId: string;
                    email: string;
                    createdAt: Date;
                    organizationId: string;
                    role: "member" | "admin" | "owner";
                };
            } | null>;
            path: "/organization/accept-invitation";
            options: {
                method: "POST";
                body: ZodObject<{
                    invitationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    invitationId: string;
                }, {
                    invitationId: string;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        getInvitation: {
            (ctx_0: better_call.Context<"/organization/get-invitation", {
                method: "GET";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
                query: ZodObject<{
                    id: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
                }>;
            }>): Promise<{
                organizationName: string;
                organizationSlug: string;
                inviterEmail: string;
                id: string;
                expiresAt: Date;
                status: "pending" | "accepted" | "rejected" | "canceled";
                email: string;
                organizationId: string;
                role: "member" | "admin" | "owner";
                inviterId: string;
            } | null>;
            path: "/organization/get-invitation";
            options: {
                method: "GET";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
                query: ZodObject<{
                    id: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        rejectInvitation: {
            (ctx_0: better_call.Context<"/organization/reject-invitation", {
                method: "POST";
                body: ZodObject<{
                    invitationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    invitationId: string;
                }, {
                    invitationId: string;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            }>): Promise<{
                invitation: {
                    id: string;
                    expiresAt: Date;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    email: string;
                    organizationId: string;
                    role: "member" | "admin" | "owner";
                    inviterId: string;
                } | null;
                member: null;
            } | null>;
            path: "/organization/reject-invitation";
            options: {
                method: "POST";
                body: ZodObject<{
                    invitationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    invitationId: string;
                }, {
                    invitationId: string;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        removeMember: {
            (ctx_0: better_call.Context<"/organization/remove-member", {
                method: "POST";
                body: ZodObject<{
                    memberIdOrEmail: z.ZodString;
                    organizationId: ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    memberIdOrEmail: string;
                    organizationId?: string | undefined;
                }, {
                    memberIdOrEmail: string;
                    organizationId?: string | undefined;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            }>): Promise<{
                member: {
                    id: string;
                    userId: string;
                    email: string;
                    createdAt: Date;
                    organizationId: string;
                    role: "member" | "admin" | "owner";
                };
            } | null>;
            path: "/organization/remove-member";
            options: {
                method: "POST";
                body: ZodObject<{
                    memberIdOrEmail: z.ZodString;
                    organizationId: ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    memberIdOrEmail: string;
                    organizationId?: string | undefined;
                }, {
                    memberIdOrEmail: string;
                    organizationId?: string | undefined;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        updateMemberRole: {
            (ctx_0: better_call.Context<"/organization/update-member-role", {
                method: "POST";
                body: ZodObject<{
                    role: z.ZodEnum<["admin", "member", "owner"]>;
                    memberId: z.ZodString;
                    organizationId: ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    role: "member" | "admin" | "owner";
                    memberId: string;
                    organizationId?: string | undefined;
                }, {
                    role: "member" | "admin" | "owner";
                    memberId: string;
                    organizationId?: string | undefined;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            }>): Promise<{
                id: string;
                userId: string;
                email: string;
                createdAt: Date;
                organizationId: string;
                role: "member" | "admin" | "owner";
            } | null>;
            path: "/organization/update-member-role";
            options: {
                method: "POST";
                body: ZodObject<{
                    role: z.ZodEnum<["admin", "member", "owner"]>;
                    memberId: z.ZodString;
                    organizationId: ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    role: "member" | "admin" | "owner";
                    memberId: string;
                    organizationId?: string | undefined;
                }, {
                    role: "member" | "admin" | "owner";
                    memberId: string;
                    organizationId?: string | undefined;
                }>;
                use: (better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: better_call.Context<any, any>) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>, better_call.EndpointOptions> | better_call.Endpoint<better_call.Handler<string, {
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
                } & {
                    method: "*";
                }, {
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>, {
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
                } & {
                    method: "*";
                }>)[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    };
    schema: {
        session: {
            fields: {
                activeOrganizationId: {
                    type: "string";
                    required: false;
                };
            };
        };
        organization: {
            fields: {
                name: {
                    type: "string";
                };
                slug: {
                    type: "string";
                    unique: true;
                };
                logo: {
                    type: "string";
                    required: false;
                };
                createdAt: {
                    type: "date";
                    required: true;
                };
                metadata: {
                    type: "string";
                    required: false;
                };
            };
        };
        member: {
            fields: {
                organizationId: {
                    type: "string";
                    required: true;
                };
                userId: {
                    type: "string";
                    required: true;
                };
                email: {
                    type: "string";
                    required: true;
                };
                role: {
                    type: "string";
                    required: true;
                    defaultValue: string;
                };
                createdAt: {
                    type: "date";
                    required: true;
                };
            };
        };
        invitation: {
            fields: {
                organizationId: {
                    type: "string";
                    required: true;
                };
                email: {
                    type: "string";
                    required: true;
                };
                role: {
                    type: "string";
                    required: false;
                };
                status: {
                    type: "string";
                    required: true;
                    defaultValue: string;
                };
                expiresAt: {
                    type: "date";
                    required: true;
                };
                inviterId: {
                    type: "string";
                    references: {
                        model: string;
                        field: string;
                    };
                };
            };
        };
    };
    $Infer: {
        Organization: Organization;
        Invitation: Invitation;
        Member: Member;
        ActiveOrganization: Prettify<Organization & {
            members: Prettify<Member & {
                user: {
                    id: string;
                    name: string;
                    email: string;
                    image: string;
                };
            }>[];
            invitations: Invitation[];
        }>;
    };
};

interface BackupCodeOptions {
    /**
     * The amount of backup codes to generate
     *
     * @default 10
     */
    amount?: number;
    /**
     * The length of the backup codes
     *
     * @default 10
     */
    length?: number;
    customBackupCodesGenerate?: () => string[];
}

interface OTPOptions {
    /**
     * How long the opt will be valid for in
     * minutes
     *
     * @default "3 mins"
     */
    period?: number;
    /**
     * Send the otp to the user
     *
     * @param user - The user to send the otp to
     * @param otp - The otp to send
     * @returns void | Promise<void>
     */
    sendOTP?: (user: UserWithTwoFactor, otp: string) => Promise<void> | void;
}

type TOTPOptions = {
    /**
     * Issuer
     */
    issuer: string;
    /**
     * How many digits the otp to be
     *
     * @default 6
     */
    digits?: 6 | 8;
    /**
     * Period for otp in seconds.
     * @default 30
     */
    period?: number;
    /**
     * Backup codes configuration
     */
    backupCodes?: BackupCodeOptions;
};

interface TwoFactorOptions {
    /**
     * Application Name
     */
    issuer?: string;
    /**
     * TOTP OPtions
     */
    totpOptions?: Omit<TOTPOptions, "issuer">;
    /**
     * OTP Options
     */
    otpOptions?: OTPOptions;
    /**
     * Backup code options
     */
    backupCodeOptions?: BackupCodeOptions;
}
interface UserWithTwoFactor extends User {
    /**
     * If the user has enabled two factor authentication.
     */
    twoFactorEnabled: boolean;
    /**
     * The secret used to generate the TOTP or OTP.
     */
    twoFactorSecret: string;
    /**
     * List of backup codes separated by a
     * comma
     */
    twoFactorBackupCodes: string;
}

declare const twoFactorClient: (options?: {
    twoFactorPage: string;
    /**
     * Redirect to the two factor page. If twoFactorPage
     * is not set this will redirect to the root path.
     * @default true
     */
    redirect?: boolean;
}) => {
    id: "two-factor";
    $InferServerPlugin: ReturnType<typeof twoFactor>;
    atomListeners: {
        matcher: (path: string) => path is "/two-factor/send-otp" | "/two-factor/enable" | "/two-factor/disable";
        signal: string;
    }[];
    pathMethods: {
        "/two-factor/disable": "POST";
        "/two-factor/enable": "POST";
        "/two-factor/send-otp": "POST";
    };
    fetchPlugins: {
        id: string;
        name: string;
        hooks: {
            onSuccess(context: _better_fetch_fetch.SuccessContext<any>): Promise<void>;
        };
    }[];
};

declare const twoFactor: (options?: TwoFactorOptions) => {
    id: "two-factor";
    endpoints: {
        enableTwoFactor: {
            (ctx_0: better_call.Context<"/two-factor/enable", {
                method: "POST";
                body: z.ZodObject<{
                    password: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
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
                status: boolean;
            }>;
            path: "/two-factor/enable";
            options: {
                method: "POST";
                body: z.ZodObject<{
                    password: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
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
        disableTwoFactor: {
            (ctx_0: better_call.Context<"/two-factor/disable", {
                method: "POST";
                body: z.ZodObject<{
                    password: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
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
                status: boolean;
            }>;
            path: "/two-factor/disable";
            options: {
                method: "POST";
                body: z.ZodObject<{
                    password: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
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
        verifyBackupCode: {
            (ctx_0: better_call.Context<"/two-factor/verify-backup-code", {
                method: "POST";
                body: z.ZodObject<{
                    code: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    code: string;
                }, {
                    code: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    session: {
                        id: string;
                        userId: string;
                        expiresAt: Date;
                        user: UserWithTwoFactor;
                    };
                }>, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
            }>): Promise<{
                status: boolean;
            }>;
            path: "/two-factor/verify-backup-code";
            options: {
                method: "POST";
                body: z.ZodObject<{
                    code: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    code: string;
                }, {
                    code: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    session: {
                        id: string;
                        userId: string;
                        expiresAt: Date;
                        user: UserWithTwoFactor;
                    };
                }>, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        generateBackupCodes: {
            (ctx_0?: better_call.Context<"/two-factor/generate-backup-codes", {
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
            }> | undefined): Promise<{
                status: boolean;
                backupCodes: string[];
            }>;
            path: "/two-factor/generate-backup-codes";
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
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        viewBackupCodes: {
            (ctx_0?: better_call.Context<"/view/backup-codes", {
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
            }> | undefined): Promise<{
                status: boolean;
                backupCodes: Promise<string[] | null>;
            }>;
            path: "/view/backup-codes";
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
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        send2FaOTP: {
            (ctx_0: better_call.Context<"/two-factor/send-otp", {
                method: "POST";
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    session: {
                        id: string;
                        userId: string;
                        expiresAt: Date;
                        user: UserWithTwoFactor;
                    };
                }>, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
            }>): Promise<{
                status: boolean;
            }>;
            path: "/two-factor/send-otp";
            options: {
                method: "POST";
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    session: {
                        id: string;
                        userId: string;
                        expiresAt: Date;
                        user: UserWithTwoFactor;
                    };
                }>, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        verifyOTP: {
            (ctx_0: better_call.Context<"/two-factor/verify-otp", {
                method: "POST";
                body: z.ZodObject<{
                    code: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    code: string;
                }, {
                    code: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    session: {
                        id: string;
                        userId: string;
                        expiresAt: Date;
                        user: UserWithTwoFactor;
                    };
                }>, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
            }>): Promise<{
                status: boolean;
            }>;
            path: "/two-factor/verify-otp";
            options: {
                method: "POST";
                body: z.ZodObject<{
                    code: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    code: string;
                }, {
                    code: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    session: {
                        id: string;
                        userId: string;
                        expiresAt: Date;
                        user: UserWithTwoFactor;
                    };
                }>, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        generateTOTP: {
            (ctx_0?: better_call.Context<"/totp/generate", {
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
            }> | undefined): Promise<{
                code: string;
            }>;
            path: "/totp/generate";
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
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        viewTOTPURI: {
            (ctx_0?: better_call.Context<"/two-factor/get-totp-uri", {
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
            }> | undefined): Promise<{
                totpURI: string;
            }>;
            path: "/two-factor/get-totp-uri";
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
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        verifyTOTP: {
            (ctx_0: better_call.Context<"/two-factor/verify-totp", {
                method: "POST";
                body: z.ZodObject<{
                    code: z.ZodString;
                    callbackURL: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    code: string;
                    callbackURL?: string | undefined;
                }, {
                    code: string;
                    callbackURL?: string | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    session: {
                        id: string;
                        userId: string;
                        expiresAt: Date;
                        user: UserWithTwoFactor;
                    };
                }>, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
            }>): Promise<{
                status: boolean;
            }>;
            path: "/two-factor/verify-totp";
            options: {
                method: "POST";
                body: z.ZodObject<{
                    code: z.ZodString;
                    callbackURL: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    code: string;
                    callbackURL?: string | undefined;
                }, {
                    code: string;
                    callbackURL?: string | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            status: boolean;
                        };
                        _flag: "json";
                    }>;
                    session: {
                        id: string;
                        userId: string;
                        expiresAt: Date;
                        user: UserWithTwoFactor;
                    };
                }>, {
                    body: z.ZodObject<{
                        trustDevice: z.ZodOptional<z.ZodBoolean>;
                        callbackURL: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }, {
                        callbackURL?: string | undefined;
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    };
    options: TwoFactorOptions | undefined;
    hooks: {
        after: {
            matcher(context: HookEndpointContext): boolean;
            handler: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                response: Response;
            } | undefined>, better_call.EndpointOptions>;
        }[];
    };
    schema: {
        user: {
            fields: {
                twoFactorEnabled: {
                    type: "boolean";
                    required: false;
                    defaultValue: false;
                };
                twoFactorSecret: {
                    type: "string";
                    required: false;
                    returned: false;
                };
                twoFactorBackupCodes: {
                    type: "string";
                    required: false;
                    returned: false;
                };
            };
        };
    };
    rateLimit: {
        pathMatcher(path: string): boolean;
        window: number;
        max: number;
    }[];
};

declare const getPasskeyActions: ($fetch: BetterFetch, { _listPasskeys, }: {
    _listPasskeys: ReturnType<typeof atom<any>>;
}) => {
    signIn: {
        /**
         * Sign in with a registered passkey
         */
        passkey: (opts?: {
            autoFill?: boolean;
            email?: string;
            callbackURL?: string;
            fetchOptions?: BetterFetchOption;
        }, options?: BetterFetchOption) => Promise<{
            data: null;
            error: {
                message?: string | undefined;
                status: number;
                statusText: string;
            };
        } | undefined>;
    };
    passkey: {
        /**
         * Add a passkey to the user account
         */
        addPasskey: (opts?: {
            fetchOptions?: BetterFetchOption;
            /**
             * The name of the passkey. This is used to
             * identify the passkey in the UI.
             */
            name?: string;
        }, fetchOpts?: BetterFetchOption) => Promise<{
            data: null;
            error: {
                message?: string | undefined;
                status: number;
                statusText: string;
            };
        } | undefined>;
    };
    /**
     * Inferred Internal Types
     */
    $Infer: {
        Passkey: Passkey;
    };
};
declare const passkeyClient: () => {
    id: "passkey";
    $InferServerPlugin: ReturnType<typeof passkey>;
    getActions: ($fetch: BetterFetch) => {
        signIn: {
            /**
             * Sign in with a registered passkey
             */
            passkey: (opts?: {
                autoFill?: boolean;
                email?: string;
                callbackURL?: string;
                fetchOptions?: BetterFetchOption;
            }, options?: BetterFetchOption) => Promise<{
                data: null;
                error: {
                    message?: string | undefined;
                    status: number;
                    statusText: string;
                };
            } | undefined>;
        };
        passkey: {
            /**
             * Add a passkey to the user account
             */
            addPasskey: (opts?: {
                fetchOptions?: BetterFetchOption;
                /**
                 * The name of the passkey. This is used to
                 * identify the passkey in the UI.
                 */
                name?: string;
            }, fetchOpts?: BetterFetchOption) => Promise<{
                data: null;
                error: {
                    message?: string | undefined;
                    status: number;
                    statusText: string;
                };
            } | undefined>;
        };
        /**
         * Inferred Internal Types
         */
        $Infer: {
            Passkey: Passkey;
        };
    };
    getAtoms($fetch: BetterFetch): {
        listPasskeys: nanostores.PreinitializedWritableAtom<{
            data: Passkey[] | null;
            error: null | _better_fetch_fetch.BetterFetchError;
            isPending: boolean;
        }>;
        _listPasskeys: nanostores.PreinitializedWritableAtom<any>;
    };
    pathMethods: {
        "/passkey/register": "POST";
        "/passkey/authenticate": "POST";
    };
    atomListeners: {
        matcher(path: string): path is "/passkey/verify-registration" | "/passkey/delete-passkey";
        signal: string;
    }[];
};

interface PasskeyOptions {
    /**
     * A unique identifier for your website. 'localhost' is okay for
     * local dev
     *
     * @default "localhost"
     */
    rpID?: string;
    /**
     * Human-readable title for your website
     *
     * @default "Better Auth"
     */
    rpName?: string;
    /**
     * The URL at which registrations and authentications should occur.
     * 'http://localhost' and 'http://localhost:PORT' are also valid.
     * Do NOT include any trailing /
     *
     * if this isn't provided. The client itself will
     * pass this value.
     */
    origin?: string | null;
    /**
     * Advanced options
     */
    advanced?: {
        webAuthnChallengeCookie?: string;
    };
}
type WebAuthnCookieType = {
    expectedChallenge: string;
    userData: {
        id: string;
    };
    callbackURL?: string;
};
type Passkey = {
    id: string;
    name?: string;
    publicKey: string;
    userId: string;
    webauthnUserID: string;
    counter: number;
    deviceType: CredentialDeviceType;
    backedUp: boolean;
    transports?: string;
    createdAt: Date;
};
declare const passkey: (options?: PasskeyOptions) => {
    id: "passkey";
    endpoints: {
        generatePasskeyRegistrationOptions: {
            (ctx_0?: better_call.Context<"/passkey/generate-register-options", {
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
                metadata: {
                    client: boolean;
                };
            }> | undefined): Promise<PublicKeyCredentialCreationOptionsJSON>;
            path: "/passkey/generate-register-options";
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
                metadata: {
                    client: boolean;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        generatePasskeyAuthenticationOptions: {
            (ctx_0?: better_call.Context<"/passkey/generate-authenticate-options", {
                method: "POST";
                body: z.ZodOptional<z.ZodObject<{
                    email: z.ZodOptional<z.ZodString>;
                    callbackURL: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    email?: string | undefined;
                    callbackURL?: string | undefined;
                }, {
                    email?: string | undefined;
                    callbackURL?: string | undefined;
                }>>;
            }> | undefined): Promise<_simplewebauthn_types.PublicKeyCredentialRequestOptionsJSON>;
            path: "/passkey/generate-authenticate-options";
            options: {
                method: "POST";
                body: z.ZodOptional<z.ZodObject<{
                    email: z.ZodOptional<z.ZodString>;
                    callbackURL: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    email?: string | undefined;
                    callbackURL?: string | undefined;
                }, {
                    email?: string | undefined;
                    callbackURL?: string | undefined;
                }>>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        verifyPasskeyRegistration: {
            (ctx_0: better_call.Context<"/passkey/verify-registration", {
                method: "POST";
                body: z.ZodObject<{
                    response: z.ZodAny;
                    name: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    name?: string | undefined;
                    response?: any;
                }, {
                    name?: string | undefined;
                    response?: any;
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
            }>): Promise<Passkey | null>;
            path: "/passkey/verify-registration";
            options: {
                method: "POST";
                body: z.ZodObject<{
                    response: z.ZodAny;
                    name: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    name?: string | undefined;
                    response?: any;
                }, {
                    name?: string | undefined;
                    response?: any;
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
        verifyPasskeyAuthentication: {
            (ctx_0: better_call.Context<"/passkey/verify-authentication", {
                method: "POST";
                body: z.ZodObject<{
                    response: z.ZodAny;
                }, "strip", z.ZodTypeAny, {
                    response?: any;
                }, {
                    response?: any;
                }>;
            }>): Promise<{
                session: {
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined;
                    userAgent?: string | undefined;
                };
            } | null>;
            path: "/passkey/verify-authentication";
            options: {
                method: "POST";
                body: z.ZodObject<{
                    response: z.ZodAny;
                }, "strip", z.ZodTypeAny, {
                    response?: any;
                }, {
                    response?: any;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        listPasskeys: {
            (ctx_0?: better_call.Context<"/passkey/list-user-passkeys", {
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
            }> | undefined): Promise<Passkey[]>;
            path: "/passkey/list-user-passkeys";
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
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        deletePasskey: {
            (ctx_0: better_call.Context<"/passkey/delete-passkey", {
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
            }>): Promise<null>;
            path: "/passkey/delete-passkey";
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
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    };
    schema: {
        passkey: {
            fields: {
                name: {
                    type: "string";
                    required: false;
                };
                publicKey: {
                    type: "string";
                };
                userId: {
                    type: "string";
                    references: {
                        model: string;
                        field: string;
                    };
                };
                webauthnUserID: {
                    type: "string";
                };
                counter: {
                    type: "number";
                };
                deviceType: {
                    type: "string";
                };
                backedUp: {
                    type: "boolean";
                };
                transports: {
                    type: "string";
                    required: false;
                };
                createdAt: {
                    type: "date";
                    defaultValue: Date;
                    required: false;
                };
            };
        };
    };
};

declare const username: () => {
    id: "username";
    endpoints: {
        signInUsername: {
            (ctx_0: better_call.Context<"/sign-in/username", {
                method: "POST";
                body: z.ZodObject<{
                    username: z.ZodString;
                    password: z.ZodString;
                    dontRememberMe: z.ZodOptional<z.ZodBoolean>;
                    callbackURL: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                    username: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    password: string;
                    username: string;
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
            path: "/sign-in/username";
            options: {
                method: "POST";
                body: z.ZodObject<{
                    username: z.ZodString;
                    password: z.ZodString;
                    dontRememberMe: z.ZodOptional<z.ZodBoolean>;
                    callbackURL: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                    username: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    password: string;
                    username: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signUpUsername: {
            (ctx_0: better_call.Context<"/sign-up/username", {
                method: "POST";
                body: z.ZodObject<{
                    username: z.ZodString;
                    name: z.ZodString;
                    email: z.ZodString;
                    password: z.ZodString;
                    image: z.ZodOptional<z.ZodString>;
                    callbackURL: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                    email: string;
                    name: string;
                    username: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }, {
                    password: string;
                    email: string;
                    name: string;
                    username: string;
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
            path: "/sign-up/username";
            options: {
                method: "POST";
                body: z.ZodObject<{
                    username: z.ZodString;
                    name: z.ZodString;
                    email: z.ZodString;
                    password: z.ZodString;
                    image: z.ZodOptional<z.ZodString>;
                    callbackURL: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                    email: string;
                    name: string;
                    username: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }, {
                    password: string;
                    email: string;
                    name: string;
                    username: string;
                    image?: string | undefined;
                    callbackURL?: string | undefined;
                }>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    };
    schema: {
        user: {
            fields: {
                username: {
                    type: "string";
                    required: false;
                    unique: true;
                    returned: true;
                };
            };
        };
    };
};

export { type Invitation as I, type Member as M, type OrganizationOptions as O, type PasskeyOptions as P, type WebAuthnCookieType as W, twoFactorClient as a, type Passkey as b, passkeyClient as c, type Organization as d, getPasskeyActions as g, organization as o, passkey as p, twoFactor as t, username as u };
