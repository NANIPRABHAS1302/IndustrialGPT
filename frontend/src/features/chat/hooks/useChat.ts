import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  createChatSession,
  deleteChatSession,
  getChatMessages,
  getChatSessions,
  renameChatSession,
  sendChatMessageStream
} from '@/features/chat/services/chatService';
import type { Attachment, ChatMessage, ChatSession, ChatSettings } from '@/features/chat/types';

const DEFAULT_SETTINGS: ChatSettings = {
  model: 'gpt-4o',
  temperature: 0.2,
  maxTokens: 2048
};

export function useChat() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  // Sessions Query
  const { data: sessionsData, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['chatSessions'],
    queryFn: getChatSessions
  });

  const sessions = useMemo(() => sessionsData ?? [], [sessionsData]);

  // Set default active session
  const currentSessionId = activeSessionId || sessions[0]?.id || null;

  // Active Session Messages Query
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['chatMessages', currentSessionId],
    queryFn: () => (currentSessionId ? getChatMessages(currentSessionId) : Promise.resolve([])),
    enabled: !!currentSessionId
  });

  const messages = useMemo(() => messagesData ?? [], [messagesData]);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter((s) => s.title.toLowerCase().includes(q) || (s.previewText || '').toLowerCase().includes(q));
  }, [sessions, searchQuery]);

  // Create Session Mutation
  const createSessionMutation = useMutation({
    mutationFn: (newSettings: ChatSettings) => createChatSession(newSettings),
    onSuccess: (newSession) => {
      queryClient.setQueryData<ChatSession[]>(['chatSessions'], (old = []) => [newSession, ...old]);
      setActiveSessionId(newSession.id);
    }
  });

  // Rename Session Mutation
  const renameSessionMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => renameChatSession(id, title),
    onSuccess: (updated) => {
      queryClient.setQueryData<ChatSession[]>(['chatSessions'], (old = []) =>
        old.map((s) => (s.id === updated.id ? { ...s, title: updated.title } : s))
      );
    }
  });

  // Delete Session Mutation
  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => deleteChatSession(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ChatSession[]>(['chatSessions'], (old = []) =>
        old.filter((s) => s.id !== deletedId)
      );
      if (activeSessionId === deletedId) {
        setActiveSessionId(null);
      }
    }
  });

  // Send Message with Streaming Simulation
  const sendMessage = useCallback(
    async (content: string, attachments: Attachment[] = []) => {
      if (!currentSessionId || !content.trim() || isGenerating) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sessionId: currentSessionId,
        role: 'user',
        content,
        timestamp: new Date().toISOString().slice(11, 16),
        attachments
      };

      // Optimistically push user message
      queryClient.setQueryData<ChatMessage[]>(['chatMessages', currentSessionId], (old = []) => [...old, userMsg]);

      setIsGenerating(true);
      setStreamingContent('');
      abortControllerRef.current = new AbortController();

      try {
        const assistantMsg = await sendChatMessageStream(
          currentSessionId,
          content,
          settings,
          (chunk) => setStreamingContent(chunk),
          abortControllerRef.current.signal
        );

        queryClient.setQueryData<ChatMessage[]>(['chatMessages', currentSessionId], (old = []) => [
          ...old,
          assistantMsg
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsGenerating(false);
        setStreamingContent('');
        abortControllerRef.current = null;
      }
    },
    [currentSessionId, isGenerating, settings, queryClient]
  );

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setStreamingContent('');
    }
  };

  const regenerateResponse = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      sendMessage(lastUserMsg.content, lastUserMsg.attachments);
    }
  };

  return {
    sessions: filteredSessions,
    activeSessionId: currentSessionId,
    activeSession: sessions.find((s) => s.id === currentSessionId) || null,
    setActiveSessionId,
    messages,
    isLoadingSessions,
    isLoadingMessages,
    settings,
    setSettings,
    searchQuery,
    setSearchQuery,
    sendMessage,
    isGenerating,
    streamingContent,
    stopGeneration,
    regenerateResponse,
    createSession: () => createSessionMutation.mutate(settings),
    renameSession: (id: string, title: string) => renameSessionMutation.mutate({ id, title }),
    deleteSession: (id: string) => deleteSessionMutation.mutate(id)
  };
}
