export type Consents = {
  abstract_events: boolean; // procesamiento eventos abstractos
  no_gps: boolean;          // entiende que no hay ubicación exacta
  mutual_only: boolean;     // identidad solo tras confirmación mutua
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

export function createInitialState(now: Date): CliState {
  return {
    consentsByUser: {},
    profileByUser: {},
    now,
  };
}

export function getConsents(state: CliState, userId: string): Consents {
  return (
    state.consentsByUser[userId] ?? {
      abstract_events: false,
      no_gps: false,
      mutual_only: false,
    }
  );
}

export function setConsents(state: CliState, userId: string, consents: Consents): void {
  state.consentsByUser[userId] = consents;
}

export function getProfile(state: CliState, userId: string): Profile | null {
  return state.profileByUser[userId] ?? null;
}

export function setProfile(state: CliState, userId: string, profile: Profile): void {
  state.profileByUser[userId] = profile;
}

export function isOnboarded(state: CliState, userId: string): boolean {
  const c = getConsents(state, userId);
  const p = getProfile(state, userId);
  return c.abstract_events && c.no_gps && c.mutual_only && !!p;
}