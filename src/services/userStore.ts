import { UserRole, UserProfile } from '../types/user';

export interface OperatorUser {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  employeeId: string;
  role: UserRole;
  station: string;
  assignedWork: string;
  passwordHash: string;
  salt: string;
  status: 'ACTIVE' | 'DISABLED';
  createdAt: string;
  createdBy: string;
}

export interface CreateUserInput {
  fullName: string;
  userId: string;
  email: string;
  employeeId: string;
  role: UserRole;
  station: string;
  assignedWork: string;
  temporaryPassword: string;
  createdBy?: string;
}

export interface UpdateUserInput {
  fullName: string;
  email: string;
  employeeId: string;
  role: UserRole;
  station: string;
  assignedWork: string;
}

const STORAGE_KEY = 'fabriscan_operators_store';
const DEMO_SALT = 'demo_salt';
// SHA-256('demo_salt:password')
const DEMO_PASSWORD_HASH = '2b0142b348bb0785c8347ee578cefccceec177df5a104229c1e555637401b2c1';

export async function hashPassword(password: string, salt: string): Promise<string> {
  const subtle = typeof window !== 'undefined' ? window.crypto?.subtle : undefined;
  if (!subtle) {
    throw new Error('Web Cryptography API (crypto.subtle) is not available. HTTPS or localhost is required.');
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const hashBuffer = await subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateSalt(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function generateRandomPassword(length = 12): string {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

const INITIAL_DEMO_OPERATORS: OperatorUser[] = [
  {
    id: 'usr-001',
    userId: 'usr-001',
    fullName: 'Rajesh Sharma',
    email: 'rajesh.sharma@maruti-fabriscan.internal',
    employeeId: 'MS-QC-4091',
    role: 'QC_INSPECTOR',
    station: 'Stamping Press 04 · Bay B',
    assignedWork: 'Line 04 visual inspection, shift A',
    passwordHash: DEMO_PASSWORD_HASH,
    salt: DEMO_SALT,
    status: 'ACTIVE',
    createdAt: '2026-01-15T06:00:00.000Z',
    createdBy: 'System Provisioning',
  },
  {
    id: 'usr-002',
    userId: 'usr-002',
    fullName: 'Vikram Mehta',
    email: 'vikram.mehta@maruti-fabriscan.internal',
    employeeId: 'MS-QA-1082',
    role: 'QA_SUPERVISOR',
    station: 'Press & BIW Quality Control',
    assignedWork: 'Shift QA supervisor and defect tolerance overrides',
    passwordHash: DEMO_PASSWORD_HASH,
    salt: DEMO_SALT,
    status: 'ACTIVE',
    createdAt: '2026-01-15T06:00:00.000Z',
    createdBy: 'System Provisioning',
  },
  {
    id: 'usr-003',
    userId: 'usr-003',
    fullName: 'Ananya Roy',
    email: 'ananya.roy@tata-steel-supply.internal',
    employeeId: 'TS-AUD-8830',
    role: 'SUPPLIER_QA',
    station: 'Cold Rolled Coil Reception',
    assignedWork: 'Tier-1 coil defect audit and vendor compliance',
    passwordHash: DEMO_PASSWORD_HASH,
    salt: DEMO_SALT,
    status: 'ACTIVE',
    createdAt: '2026-01-15T06:00:00.000Z',
    createdBy: 'System Provisioning',
  },
  {
    id: 'usr-004',
    userId: 'usr-004',
    fullName: 'Amitabh Sengupta',
    email: 'admin.automation@maruti-fabriscan.internal',
    employeeId: 'MS-SYS-0012',
    role: 'ADMIN',
    station: 'Central Automation & Edge Nodes',
    assignedWork: 'Lead system administrator, full root control',
    passwordHash: DEMO_PASSWORD_HASH,
    salt: DEMO_SALT,
    status: 'ACTIVE',
    createdAt: '2026-01-15T06:00:00.000Z',
    createdBy: 'System Provisioning',
  },
];

class UserStore {
  private users: OperatorUser[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.users = this.loadUsers();
  }

  private loadUsers(): OperatorUser[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // LocalStorage error or SSR
    }
    // Seed initial users once
    this.saveToStorage(INITIAL_DEMO_OPERATORS);
    return INITIAL_DEMO_OPERATORS;
  }

  private saveToStorage(users: OperatorUser[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch {
      // Storage quota or error
    }
  }

  private persistAndNotify(): void {
    this.saveToStorage(this.users);
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getUsers(): OperatorUser[] {
    return [...this.users];
  }

  getUserById(id: string): OperatorUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUserByUserId(userId: string): OperatorUser | undefined {
    const clean = userId.trim().toLowerCase();
    return this.users.find((u) => u.userId.toLowerCase() === clean);
  }

  async createUser(input: CreateUserInput): Promise<OperatorUser> {
    const trimmedUserId = input.userId.trim();
    const cleanUserId = trimmedUserId.toLowerCase();
    const cleanEmail = input.email.trim().toLowerCase();

    // Validations
    if (!/^[a-zA-Z0-9-]{3,20}$/.test(trimmedUserId)) {
      throw new Error('User ID must be 3 to 20 alphanumeric characters or hyphens (e.g. usr-005).');
    }

    if (this.users.some((u) => u.userId.toLowerCase() === cleanUserId)) {
      throw new Error(`User ID "${trimmedUserId}" is already in use.`);
    }

    if (this.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error(`Email "${input.email.trim()}" is already registered.`);
    }

    if (input.temporaryPassword.length < 8) {
      throw new Error('Temporary password must be at least 8 characters long.');
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(input.temporaryPassword, salt);

    const newUser: OperatorUser = {
      id: trimmedUserId,
      userId: trimmedUserId,
      fullName: input.fullName.trim(),
      email: input.email.trim(),
      employeeId: input.employeeId.trim(),
      role: input.role,
      station: input.station.trim() || 'Stamping Press 04 · Bay B',
      assignedWork: input.assignedWork.trim() || 'Line 04 visual inspection, shift A',
      passwordHash,
      salt,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      createdBy: input.createdBy || 'System Administrator',
    };

    this.users.unshift(newUser);
    this.persistAndNotify();
    return newUser;
  }

  async updateUser(
    id: string,
    input: UpdateUserInput,
    currentAdminUserId: string
  ): Promise<OperatorUser> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error('Operator not found.');
    }

    const targetUser = this.users[index];
    const isSelf = targetUser.userId.toLowerCase() === currentAdminUserId.toLowerCase() || targetUser.id === currentAdminUserId;

    // Rule: Administrator cannot demote their own account
    if (isSelf && targetUser.role === 'ADMIN' && input.role !== 'ADMIN') {
      throw new Error('You cannot demote your own System Administrator account.');
    }

    // Rule: At least one active System Administrator must always exist
    if (targetUser.role === 'ADMIN' && input.role !== 'ADMIN') {
      const remainingActiveAdmins = this.users.filter(
        (u) => u.role === 'ADMIN' && u.status === 'ACTIVE' && u.id !== id
      );
      if (remainingActiveAdmins.length === 0) {
        throw new Error('At least one active System Administrator must always exist.');
      }
    }

    // Check email uniqueness if changed
    const cleanEmail = input.email.trim().toLowerCase();
    const emailConflict = this.users.some(
      (u) => u.id !== id && u.email.toLowerCase() === cleanEmail
    );
    if (emailConflict) {
      throw new Error(`Email "${input.email.trim()}" is already registered to another user.`);
    }

    const updatedUser: OperatorUser = {
      ...targetUser,
      fullName: input.fullName.trim(),
      email: input.email.trim(),
      employeeId: input.employeeId.trim(),
      role: input.role,
      station: input.station.trim(),
      assignedWork: input.assignedWork.trim(),
    };

    this.users[index] = updatedUser;
    this.persistAndNotify();
    return updatedUser;
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }

    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error('Operator not found.');
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(newPassword, salt);

    this.users[index] = {
      ...this.users[index],
      passwordHash,
      salt,
    };

    this.persistAndNotify();
  }

  async toggleStatus(id: string, currentAdminUserId: string): Promise<OperatorUser> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error('Operator not found.');
    }

    const targetUser = this.users[index];
    const isSelf = targetUser.userId.toLowerCase() === currentAdminUserId.toLowerCase() || targetUser.id === currentAdminUserId;

    if (targetUser.status === 'ACTIVE') {
      // Trying to disable
      if (isSelf) {
        throw new Error('You cannot disable your own administrator account.');
      }

      if (targetUser.role === 'ADMIN') {
        const remainingActiveAdmins = this.users.filter(
          (u) => u.role === 'ADMIN' && u.status === 'ACTIVE' && u.id !== id
        );
        if (remainingActiveAdmins.length === 0) {
          throw new Error('At least one active System Administrator must always exist.');
        }
      }

      this.users[index] = { ...targetUser, status: 'DISABLED' };
    } else {
      // Re-enable
      this.users[index] = { ...targetUser, status: 'ACTIVE' };
    }

    this.persistAndNotify();
    return this.users[index];
  }

  async authenticate(identifier: string, rawPassword: string): Promise<UserProfile> {
    const clean = identifier.trim().toLowerCase();
    const user = this.users.find(
      (u) =>
        u.userId.toLowerCase() === clean ||
        u.email.toLowerCase() === clean ||
        u.id.toLowerCase() === clean
    );

    if (!user) {
      throw new Error('Invalid User ID or password.');
    }

    if (user.status === 'DISABLED') {
      throw new Error('Account disabled. Contact your administrator.');
    }

    // Verify password hash
    const computedHash = await hashPassword(rawPassword, user.salt);
    if (computedHash !== user.passwordHash) {
      throw new Error('Invalid User ID or password.');
    }

    return toUserProfile(user);
  }
}

export function toUserProfile(op: OperatorUser): UserProfile {
  const roleTitles: Record<UserRole, string> = {
    QC_INSPECTOR: 'QC Line Inspector',
    QA_SUPERVISOR: 'QA Supervisor',
    SUPPLIER_QA: 'Supplier QA Auditor',
    ADMIN: 'System Administrator',
  };

  const initials =
    op.fullName
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0].toUpperCase())
      .slice(0, 2)
      .join('') || op.userId.slice(0, 2).toUpperCase();

  return {
    id: op.id,
    userId: op.userId,
    username: op.userId,
    name: op.fullName,
    fullName: op.fullName,
    email: op.email,
    role: op.role,
    roleTitle: roleTitles[op.role] || op.role,
    station: op.station,
    stationAssignment: op.station,
    shift: op.assignedWork,
    avatarInitials: initials,
    employeeId: op.employeeId,
    lastLoginAt: new Date().toISOString(),
  };
}

export const userStore = new UserStore();
