export type Consents = {
    abstract_events: boolean;
    no_gps: boolean;
    mutual_only: boolean;
};
export type Profile = {
    alias: string;
    age: number;
    photo_url?: string;
};
export type CliState = {
    consentsByUser: Record<string, Consents>;
    profileByUser: Record<string, Profile | null>;
    now: Date;
};
export declare function createInitialState(now: Date): CliState;
export declare function getConsents(state: CliState, userId: string): Consents;
export declare function setConsents(state: CliState, userId: string, consents: Consents): void;
export declare function getProfile(state: CliState, userId: string): Profile | null;
export declare function setProfile(state: CliState, userId: string, profile: Profile): void;
export declare function isOnboarded(state: CliState, userId: string): boolean;
//# sourceMappingURL=state.d.ts.map