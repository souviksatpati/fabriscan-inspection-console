export type UserRole =
  | 'QC_INSPECTOR'
  | 'QA_SUPERVISOR'
  | 'SUPPLIER_QA'
  | 'ADMIN';

export interface UserProfile {
  id: string;
  userId: string;
  username: string;
  name: string;
  fullName: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  station: string;
  stationAssignment: string;
  shift: string;
  avatarInitials: string;
  employeeId: string;
  lastLoginAt: string;
  sessionStartedAt?: string;
}
