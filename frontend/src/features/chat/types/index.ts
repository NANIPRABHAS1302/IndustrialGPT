export type LLMModel = 'gpt-4o' | 'gpt-4o-mini' | 'claude-3-5-sonnet' | 'industrial-llama-3';

export type Citation = {
  id: string;
  documentId: string;
  documentTitle: string;
  pageNumber?: number;
  snippet: string;
  confidence: number;
};

export type Attachment = {
  id: string;
  name: string;
  sizeBytes: number;
  type: 'pdf' | 'image' | 'text' | 'csv';
  url: string;
  file?: File;
};

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  tokensUsed?: number;
  citations?: Citation[];
  attachments?: Attachment[];
  modelUsed?: LLMModel;
};

export type ChatSession = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  model: LLMModel;
  temperature: number;
  maxTokens: number;
  messagesCount: number;
  previewText?: string;
  isPinned?: boolean;
};

export type ChatSettings = {
  model: LLMModel;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
};
