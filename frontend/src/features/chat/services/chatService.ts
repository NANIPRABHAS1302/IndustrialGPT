import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { ChatMessage, ChatSession, ChatSettings } from '@/features/chat/types';

const fallbackSessions: ChatSession[] = [
  {
    id: 'session-1',
    title: 'Turbine Hydraulic Maintenance Inquiry',
    createdAt: '2026-07-22 10:30',
    updatedAt: '2026-07-22 10:45',
    model: 'gpt-4o',
    temperature: 0.2,
    maxTokens: 2048,
    messagesCount: 4,
    previewText: 'How do I perform a fluid flush on Turbine B?',
    isPinned: true
  },
  {
    id: 'session-2',
    title: 'ISO 9001 Compliance Verification',
    createdAt: '2026-07-21 14:15',
    updatedAt: '2026-07-21 15:00',
    model: 'gpt-4o-mini',
    temperature: 0.1,
    maxTokens: 4096,
    messagesCount: 6,
    previewText: 'Check if plant 3 meets environmental regulations.',
    isPinned: false
  }
];

const fallbackMessages: Record<string, ChatMessage[]> = {
  'session-1': [
    {
      id: 'msg-1',
      sessionId: 'session-1',
      role: 'user',
      content: 'How do I perform a fluid flush on Turbine B hydraulic system?',
      timestamp: '10:30',
      attachments: []
    },
    {
      id: 'msg-2',
      sessionId: 'session-1',
      role: 'assistant',
      content: `Based on **Turbine Hydraulic Maintenance SOP (SOP-HYD-04)**, here is the procedure:\n\n### Step-by-Step Procedure:\n1. **Isolate Hydraulic Lines**: Shut off valves \`HV-101\` and \`HV-102\`.\n2. **Drain Fluid**: Connect recovery hose to port \`DP-3\`.\n3. **Flush Circuit**: Circulate synthetic ISO VG 46 at **45°C** for 30 minutes.\n\n\`\`\`bash\n# Verify pressure stats via PLC CLI\nplc-ctl status --device=TURBINE_B --sensor=HYD_PRESS\n\`\`\`\n\n> **Warning**: Ensure system pressure drops below **5 BAR** before removing drain plugs.`,
      timestamp: '10:31',
      modelUsed: 'gpt-4o',
      tokensUsed: 142,
      citations: [
        {
          id: 'cit-1',
          documentId: 'doc-2',
          documentTitle: 'Turbine Hydraulic Maintenance SOP',
          pageNumber: 12,
          snippet: 'Shut off isolation valves HV-101 and HV-102 prior to fluid flushing.',
          confidence: 0.96
        }
      ]
    }
  ]
};

export async function getChatSessions(): Promise<ChatSession[]> {
  try {
    const response = await apiClient.get<ChatSession[]>(endpoints.chat.sessions);
    return response.data;
  } catch {
    return fallbackSessions;
  }
}

export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  try {
    const response = await apiClient.get<ChatMessage[]>(`${endpoints.chat.sessions}/${sessionId}/messages`);
    return response.data;
  } catch {
    return fallbackMessages[sessionId] || [];
  }
}

export async function createChatSession(settings: ChatSettings): Promise<ChatSession> {
  const newSession: ChatSession = {
    id: `session-${Date.now()}`,
    title: 'New Conversation',
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    model: settings.model,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
    messagesCount: 0,
    previewText: 'Started a new session...'
  };

  try {
    const response = await apiClient.post<ChatSession>(endpoints.chat.sessions, settings);
    return response.data;
  } catch {
    return newSession;
  }
}

export async function renameChatSession(sessionId: string, title: string): Promise<ChatSession> {
  try {
    const response = await apiClient.patch<ChatSession>(`${endpoints.chat.sessions}/${sessionId}`, { title });
    return response.data;
  } catch {
    return { id: sessionId, title } as ChatSession;
  }
}

export async function deleteChatSession(sessionId: string): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.delete(`${endpoints.chat.sessions}/${sessionId}`);
    return response.data;
  } catch {
    return { success: true };
  }
}

export async function sendChatMessageStream(
  sessionId: string,
  content: string,
  settings: ChatSettings,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<ChatMessage> {
  // Simulated streaming chunk delivery
  const mockChunks = [
    'Based on ',
    'your uploaded ',
    '**Industrial Operating Manuals**,\n\n',
    'Here are the ',
    'recommended operational specs:\n\n',
    '| Parameter | Optimal | Max Limit |\n',
    '|---|---|---|\n',
    '| Temperature | 65°C | 85°C |\n',
    '| Pressure | 4.2 BAR | 6.0 BAR |\n\n',
    '```python\n# Diagnostic calculation\ndef check_temp(current_temp):\n    return current_temp < 85\n```\n\n',
    'All systems remain operating within normal tolerances.'
  ];

  let accumulated = '';
  for (const chunk of mockChunks) {
    if (signal?.aborted) break;
    await new Promise((res) => setTimeout(res, 90));
    accumulated += chunk;
    onChunk(accumulated);
  }

  return {
    id: `msg-${Date.now()}`,
    sessionId,
    role: 'assistant',
    content: accumulated,
    timestamp: new Date().toISOString().slice(11, 16),
    modelUsed: settings.model,
    tokensUsed: 128,
    citations: [
      {
        id: 'cit-auto',
        documentId: 'doc-1',
        documentTitle: 'Annual Compliance & Safety Report',
        pageNumber: 5,
        snippet: 'Operating temperatures above 85°C trigger automated thermal cut-offs.',
        confidence: 0.94
      }
    ]
  };
}
