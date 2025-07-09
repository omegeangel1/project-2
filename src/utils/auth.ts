interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  email: string;
  verified: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: DiscordUser | null;
  token: string | null;
}

class AuthManager {
  private static instance: AuthManager;
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null
  };
  private listeners: ((state: AuthState) => void)[] = [];

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  constructor() {
    this.loadFromStorage();
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.authState));
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('discord_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user && parsed.token) {
          this.authState = {
            isAuthenticated: true,
            user: parsed.user,
            token: parsed.token
          };
        }
      }
    } catch (error) {
      console.error('Error loading auth from storage:', error);
      this.clearAuth();
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('discord_auth', JSON.stringify({
        user: this.authState.user,
        token: this.authState.token
      }));
    } catch (error) {
      console.error('Error saving auth to storage:', error);
    }
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  setAuth(user: DiscordUser, token: string) {
    this.authState = {
      isAuthenticated: true,
      user,
      token
    };
    this.saveToStorage();
    this.notify();
  }

  clearAuth() {
    this.authState = {
      isAuthenticated: false,
      user: null,
      token: null
    };
    localStorage.removeItem('discord_auth');
    this.notify();
  }

  getDiscordUsername(): string {
    if (!this.authState.user) return '';
    const { username, discriminator } = this.authState.user;
    return discriminator === '0' ? username : `${username}#${discriminator}`;
  }

  getFirstName(): string {
    if (!this.authState.user?.global_name) return '';
    return this.authState.user.global_name.split(' ')[0] || '';
  }

  getLastName(): string {
    if (!this.authState.user?.global_name) return '';
    const parts = this.authState.user.global_name.split(' ');
    return parts.slice(1).join(' ') || '';
  }

  getEmail(): string {
    return this.authState.user?.email || '';
  }

  getAvatarUrl(): string {
    if (!this.authState.user?.avatar) return '';
    return `https://cdn.discordapp.com/avatars/${this.authState.user.id}/${this.authState.user.avatar}.png?size=128`;
  }
}

export const authManager = AuthManager.getInstance();
export type { DiscordUser, AuthState };