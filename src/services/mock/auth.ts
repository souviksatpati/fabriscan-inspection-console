import { UserProfile } from '../../types/user';
import { MOCK_USERS, DEFAULT_USER } from '../../data/mock/mockUsers';
import { userStore, toUserProfile } from '../userStore';

const STORAGE_KEY = 'fabriscan_user_session';

export class AuthService {
  private currentUser: UserProfile | null;
  private listeners: Array<(user: UserProfile | null) => void> = [];

  constructor() {
    this.currentUser = this.loadSession();

    // Subscribe to userStore changes: if current user is disabled, sign them out immediately
    userStore.subscribe(() => {
      if (this.currentUser) {
        const storedUser = userStore.getUserById(this.currentUser.id) ||
          userStore.getUserByUserId(this.currentUser.userId);
        if (storedUser && storedUser.status === 'DISABLED') {
          this.logout();
        } else if (storedUser) {
          const profile = toUserProfile(storedUser);
          if (
            profile.role !== this.currentUser.role ||
            profile.fullName !== this.currentUser.fullName ||
            profile.station !== this.currentUser.station
          ) {
            this.currentUser = { ...this.currentUser, ...profile };
            this.notify();
          }
        }
      }
    });
  }

  private loadSession(): UserProfile | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        const storedUser = userStore.getUserById(parsed.id) || userStore.getUserByUserId(parsed.userId);
        if (storedUser && storedUser.status === 'DISABLED') {
          localStorage.removeItem(STORAGE_KEY);
          return null;
        }
        return parsed;
      }
    } catch {
      // LocalStorage unavailable
    }
    return null;
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  async loginWithCredentials(identifier: string, rawPassword: string): Promise<UserProfile> {
    const profile = await userStore.authenticate(identifier, rawPassword);
    return this.loginUser(profile);
  }

  login(userKey: keyof typeof MOCK_USERS): UserProfile {
    const user = MOCK_USERS[userKey] || DEFAULT_USER;
    const storedUser = userStore.getUserByUserId(user.userId);
    if (storedUser && storedUser.status === 'DISABLED') {
      throw new Error('Account disabled. Contact your administrator.');
    }
    return this.loginUser(storedUser ? toUserProfile(storedUser) : user);
  }

  loginUser(user: UserProfile): UserProfile {
    const storedUser = userStore.getUserById(user.id) || userStore.getUserByUserId(user.userId);
    if (storedUser && storedUser.status === 'DISABLED') {
      throw new Error('Account disabled. Contact your administrator.');
    }

    const sessionUser = {
      ...user,
      sessionStartedAt: new Date().toISOString(),
    };
    this.currentUser = sessionUser;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    } catch {
      // ignore
    }
    this.notify();
    return sessionUser;
  }

  logout(): void {
    this.currentUser = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    this.notify();
  }

  subscribe(listener: (user: UserProfile | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.currentUser));
  }
}

export const authService = new AuthService();
export default authService;
