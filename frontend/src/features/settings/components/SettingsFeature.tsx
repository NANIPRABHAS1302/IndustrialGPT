import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Shield, Key, Bell, Bot, History, Save, CheckCircle2, Lock, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { getAuditLogs, getSecuritySessions, getUserProfile, updateUserProfile } from '@/features/settings/services/settingsService';

export function SettingsFeature() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'ai' | 'audit'>('profile');
  const [savedNotice, setSavedNotice] = useState(false);

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile
  });

  const { data: sessionsData } = useQuery({
    queryKey: ['securitySessions'],
    queryFn: getSecuritySessions
  });

  const { data: auditData } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: getAuditLogs
  });

  const [name, setName] = useState(profileData?.name || 'Alex Rivera');
  const [email, setEmail] = useState(profileData?.email || 'alex.rivera@industrial.ai');
  const [apiKey, setApiKey] = useState('sk-industrial-gpt-v2-prod-8891');

  const updateProfileMutation = useMutation({
    mutationFn: (updated: { name: string; email: string }) => updateUserProfile(updated),
    onSuccess: (res) => {
      queryClient.setQueryData(['userProfile'], res);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }
  });

  if (isLoadingProfile) {
    return (
      <Card title="System Settings" subtitle="Loading user preferences…">
        <div className="flex items-center gap-3 p-8 text-slate-300">
          <Spinner />
          <span>Fetching configuration profile...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-800/60 via-slate-900/70 to-cyan-950/40 p-6 shadow-glow"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Platform Control</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50">Enterprise Settings & Security</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Manage user authentication, security sessions, API keys, AI model preferences, and audit trail logs.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 font-semibold transition ${
            activeTab === 'profile' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="h-4 w-4" /> Profile & Account
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 font-semibold transition ${
            activeTab === 'security' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="h-4 w-4" /> Security & Sessions
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 font-semibold transition ${
            activeTab === 'ai' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="h-4 w-4" /> AI & API Keys
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 font-semibold transition ${
            activeTab === 'audit' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="h-4 w-4" /> Audit Logs
        </button>
      </div>

      {savedNotice ? (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> Settings updated successfully.
        </div>
      ) : null}

      {/* Tab Panels */}
      {activeTab === 'profile' ? (
        <Card title="User Profile" subtitle="Update personal info and organization role">
          <div className="space-y-4 max-w-xl text-xs">
            <div>
              <label className="text-slate-400 font-medium">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>

            <div>
              <label className="text-slate-400 font-medium">Email Address</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
            </div>

            <div>
              <label className="text-slate-400 font-medium">Assigned Role</label>
              <Input value={profileData?.role || 'Maintenance Engineer'} disabled className="mt-1 bg-slate-950 text-slate-400" />
            </div>

            <Button
              variant="primary"
              onClick={() => updateProfileMutation.mutate({ name, email })}
              disabled={updateProfileMutation.isPending}
              className="text-xs px-4 py-2"
            >
              <Save className="h-4 w-4 mr-1.5" /> Save Changes
            </Button>
          </div>
        </Card>
      ) : null}

      {activeTab === 'security' ? (
        <Card title="Active Security Sessions" subtitle="Devices logged into your IndustrialGPT account">
          <div className="space-y-3 text-xs">
            {(sessionsData || []).map((sess) => (
              <div key={sess.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-cyan-400" />
                  <div>
                    <h4 className="font-bold text-slate-100">{sess.device}</h4>
                    <p className="text-[11px] text-slate-400">{sess.location} • IP: {sess.ipAddress}</p>
                  </div>
                </div>
                {sess.isCurrent ? <Badge tone="success">Current Device</Badge> : <span className="text-[11px] text-slate-400">{sess.lastActive}</span>}
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {activeTab === 'ai' ? (
        <Card title="AI & API Credentials" subtitle="Configure platform API keys & model defaults">
          <div className="space-y-4 max-w-xl text-xs">
            <div>
              <label className="text-slate-400 font-medium flex items-center gap-1">
                <Key className="h-3.5 w-3.5 text-cyan-400" /> IndustrialGPT Private API Key
              </label>
              <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} type="password" className="mt-1 font-mono" />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="font-bold text-slate-200">Default Extraction Model</span>
              <p className="text-slate-400 text-[11px]">Primary model used for document OCR parsing and RAG citation generation.</p>
              <Badge tone="default">GPT-4o Enterprise</Badge>
            </div>
          </div>
        </Card>
      ) : null}

      {activeTab === 'audit' ? (
        <Card title="System Audit Logs" subtitle="Immutable activity trail for compliance auditing">
          <div className="space-y-2 text-xs">
            {(auditData || []).map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3 font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold text-[11px]">{log.action}</span>
                  <span className="text-slate-300">{log.resource}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{log.timestamp}</span>
                  <Badge tone="success">{log.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
