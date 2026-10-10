import { UserRole } from '../types/user';

export interface RoutePermission {
  path: string;
  name: string;
  roles: UserRole[];
  icon: string;
  badge?: string;
  description: string;
}

export const APP_ROUTES: RoutePermission[] = [
  {
    path: '/app/live-inspection',
    name: 'Live Inspection',
    roles: ['QC_INSPECTOR', 'QA_SUPERVISOR', 'ADMIN'],
    icon: 'Radio',
    badge: 'LIVE',
    description: 'Real-time edge visual inspection stream and actuator trigger',
  },
  {
    path: '/app/production',
    name: 'Production',
    roles: ['QC_INSPECTOR', 'QA_SUPERVISOR', 'SUPPLIER_QA', 'ADMIN'],
    icon: 'Activity',
    description: 'Shift telemetry, throughput rates, FTR and downtime tracking',
  },
  {
    path: '/app/defects',
    name: 'Defect History',
    roles: ['QC_INSPECTOR', 'QA_SUPERVISOR', 'SUPPLIER_QA', 'ADMIN'],
    icon: 'Layers',
    description: 'Detailed gallery and tabular log of segmented defect instances',
  },
  {
    path: '/app/reports',
    name: 'Quality Reports',
    roles: ['QA_SUPERVISOR', 'SUPPLIER_QA', 'ADMIN'],
    icon: 'FileText',
    description: 'Traceability exports, shift audits, and NCR documentation',
  },
  {
    path: '/app/cameras',
    name: 'Camera Array',
    roles: ['ADMIN'],
    icon: 'Camera',
    description: 'GigE / USB3 Vision sensor parameters and stream diagnostics',
  },
  {
    path: '/app/system-health',
    name: 'System Health',
    roles: ['ADMIN'],
    icon: 'Cpu',
    badge: 'EDGE',
    description: 'Hardware telemetry, inference latency, GPU load and PLC links',
  },
  {
    path: '/app/settings',
    name: 'Line Settings',
    roles: ['ADMIN'],
    icon: 'Settings',
    description: 'Edge model weights, MQTT/WebSocket endpoints, and system alerts',
  },
  {
    path: '/app/operators',
    name: 'Operators',
    roles: ['ADMIN'],
    icon: 'UserPlus',
    description: 'Add and manage the people who can sign in to this station',
  },
  {
    path: '/app/profile',
    name: 'Operator Profile',
    roles: ['QC_INSPECTOR', 'QA_SUPERVISOR', 'SUPPLIER_QA', 'ADMIN'],
    icon: 'User',
    description: 'Operator station credentials, shift assignment, and role permissions',
  },
];

export function hasRouteAccess(role: UserRole, path: string): boolean {
  const match = APP_ROUTES.find(r => r.path === path || path.startsWith(r.path));
  if (!match) return false;
  return match.roles.includes(role);
}

export function getAllowedRoutes(role: UserRole): RoutePermission[] {
  return APP_ROUTES.filter(r => r.roles.includes(role));
}

export const ROLE_LABELS: Record<UserRole, { title: string; subtitle: string; color: string }> = {
  QC_INSPECTOR: {
    title: 'QC Line Inspector',
    subtitle: 'Floor Operations & Rejection Verification',
    color: '#3B82F6',
  },
  QA_SUPERVISOR: {
    title: 'QA Supervisor',
    subtitle: 'Quality Standards, Overrides & Shift Operations',
    color: '#3B82F6',
  },
  SUPPLIER_QA: {
    title: 'Supplier QA Auditor',
    subtitle: 'Tier-1 Defect Telemetry & Traceability Records',
    color: '#22D3EE',
  },
  ADMIN: {
    title: 'System Administrator',
    subtitle: 'Full Root Access: Edge Models, PLC & Sensor Grid',
    color: '#F59E0B',
  },
};
