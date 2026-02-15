export interface AuthState {
  isSignedIn: boolean;
  username: string | null;
  userId: string | null;
}

export interface AuthContext extends AuthState {
  refreshAuth: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
  signIn: () => Promise<boolean>;
}
