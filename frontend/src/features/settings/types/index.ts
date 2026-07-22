export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatarUrl?: string;
};

export type SecuritySession = {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
};

export type AuditLogEntry = {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  resource: string;
  status: 'Success' | 'Failed';
};

export type AISettings = {
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  autoSummary: boolean;
  enableOCR: boolean;
};
