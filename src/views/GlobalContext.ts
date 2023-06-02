import { createContext } from 'react';

export interface IConversation {
  id: string;
  type: 'image' | 'text';
  temperature: number;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface IConfig {
  currentId: string;
  title?: string;
  model: string;
  apiKey?: string;
  temperature?: number;
  n: number;
  size: string;
  password: string;
  isContinuous: boolean; // 是否连续对话
  // 语音配置
  speakLang: number; // 输入语言
  voiceLang: string; // 朗读语言
  rate: number; // 语速
  pitch: number; // 音调
}

export type IConversations = { [key: string]: IConversation };

export const GlobalContext = createContext<{
  config: IConfig;
  allConversations: IConversations;
  isMobile: boolean;
  setCurrentConversation?: (conversation: IConversation) => IConversation;
  setAllConversations?: (conversations: IConversations) => IConversations;
  setConfig?: (config: IConfig) => IConfig;
  loading?: boolean;
  setLoading?: (load: boolean) => any;
}>({
  isMobile: false,
  config: { title: '', model: '', apiKey: '', temperature: 0.7, currentId: '' },
  allConversations: [],
  currentConversation: {},
});
