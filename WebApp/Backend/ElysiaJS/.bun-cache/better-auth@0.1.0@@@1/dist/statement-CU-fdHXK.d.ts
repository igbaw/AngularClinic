import { L as LiteralString } from './helper-C1ihmerM.js';

type SubArray<T extends unknown[] | readonly unknown[] | any[]> = T[number][];
type Subset<K extends keyof R, R extends Record<string | LiteralString, readonly string[] | readonly LiteralString[]>> = {
    [P in K]: SubArray<R[P]>;
};
type StatementsPrimitive = {
    readonly [resource: string]: readonly LiteralString[];
};

declare class ParsingError extends Error {
    readonly path: string;
    constructor(message: string, path: string);
}
type Connector = "OR" | "AND";
declare class AccessControl<TStatements extends StatementsPrimitive = StatementsPrimitive> {
    private readonly s;
    private readonly statements;
    constructor(s: TStatements);
    newRole<K extends keyof TStatements>(statements: Subset<K, TStatements>): Role<Subset<K, TStatements>>;
}
type AuthortizeResponse = {
    success: false;
    error: string;
} | {
    success: true;
    error?: never;
};
declare class Role<TStatements extends StatementsPrimitive> {
    readonly statements: TStatements;
    constructor(statements: TStatements);
    authorize<K extends keyof TStatements>(request: Subset<K, TStatements>, connector?: Connector): AuthortizeResponse;
    static fromString<TStatements extends StatementsPrimitive>(s: string): Role<TStatements>;
    toString(): string;
}

declare const createAccessControl: <S extends StatementsPrimitive>(statements: S) => AccessControl<S>;
declare const defaultStatements: {
    readonly organization: readonly ["update", "delete"];
    readonly member: readonly ["create", "update", "delete"];
    readonly invitation: readonly ["create", "cancel"];
};
declare const defaultAc: AccessControl<{
    readonly organization: readonly ["update", "delete"];
    readonly member: readonly ["create", "update", "delete"];
    readonly invitation: readonly ["create", "cancel"];
}>;
declare const adminAc: Role<Subset<"organization" | "member" | "invitation", {
    readonly organization: readonly ["update", "delete"];
    readonly member: readonly ["create", "update", "delete"];
    readonly invitation: readonly ["create", "cancel"];
}>>;
declare const ownerAc: Role<Subset<"organization" | "member" | "invitation", {
    readonly organization: readonly ["update", "delete"];
    readonly member: readonly ["create", "update", "delete"];
    readonly invitation: readonly ["create", "cancel"];
}>>;
declare const memberAc: Role<Subset<"organization" | "member" | "invitation", {
    readonly organization: readonly ["update", "delete"];
    readonly member: readonly ["create", "update", "delete"];
    readonly invitation: readonly ["create", "cancel"];
}>>;
declare const defaultRoles: {
    admin: Role<Subset<"organization" | "member" | "invitation", {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
    }>>;
    owner: Role<Subset<"organization" | "member" | "invitation", {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
    }>>;
    member: Role<Subset<"organization" | "member" | "invitation", {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
    }>>;
};

export { AccessControl as A, ParsingError as P, Role as R, type StatementsPrimitive as S, type AuthortizeResponse as a, type SubArray as b, type Subset as c, adminAc as d, createAccessControl as e, defaultAc as f, defaultRoles as g, defaultStatements as h, memberAc as m, ownerAc as o };
