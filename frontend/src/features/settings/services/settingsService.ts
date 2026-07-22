import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { AISettings, AuditLogEntry, SecuritySession, UserProfile } from '@/features/settings/types';

const fallbackProfile: UserProfile = {
  id: 'usr-101',
  name: 'Alex Rivera',
  email: 'alex.rivera@industrial.ai',
  role: 'Maintenance Engineer',
  department: 'Mechanical Engineering'
};

const fallbackSessions: SecuritySession[] = [
  { id: 'sess-1', device: 'Chrome on Windows 11', location: 'Plant 1 Operations Room', ipAddress: '192.168.1.45', lastActive: 'Active Now', isCurrent: true },
  { id: 'sess-2', device: 'Safari on iPad Pro', location: 'Field Site Substation B', ipAddress: '10.0.4.12', lastActive: '2 hours ago', isCurrent: false }
];

const fallbackAuditLogs: AuditLogEntry[] = [
  { id: 'audit-1', action: 'DOCUMENT_UPLOAD', user: 'Alex Rivera', timestamp: '2026-07-22 10:15', resource: 'Turbine Hydraulic Maintenance SOP', status: 'Success' },
  { id: 'audit-2', action: 'MODEL_PREDICTION_RUN', user: 'Alex Rivera', timestamp: '2026-07-22 08:30', resource: 'Cooling Compressor CC-09', status: 'Success' },
  { id: 'audit-3', action: 'USER_LOGIN', user: 'Alex Rivera', timestamp: '2026-07-22 07:00', resource: 'Auth API Gateway', status: 'Success' }
];

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const response = await apiClient.get<UserProfile>(`${endpoints.settings}/profile`);
    return response.data;
  } catch {
    return fallbackProfile;
  }
}

export async function getSecuritySessions(): Promise<SecuritySession[]> {
  try {
    const response = await apiClient.get<SecuritySession[]>(`${endpoints.settings}/sessions`);
    return response.data;
  } catch {
    return fallbackSessions;
  }
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const response = await apiClient.get<AuditLogEntry[]>(`${endpoints.settings}/audit-logs`);
    return response.data;
  } catch {
    return fallbackAuditLogs;
  }
}

export async function updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const response = await apiClient.patch<UserProfile>(`${endpoints.settings}/profile`, profile);
    return response.data;
  } catch {
    return { ...fallbackProfile, ...profile };
  }
}
