export interface AuthUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
}

export interface AuthSession {
  user: AuthUser;
}

export type SessionData = AuthSession | null;
