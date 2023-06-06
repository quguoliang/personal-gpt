import { createContext, type Dispatch, type SetStateAction } from 'react';

export interface IMessage {
  role: 'user' | 'assistant'| 'system';
  content: string;
}
export interface IConversation {
  id: string;
  type: 'image' | 'text'| 'system';
  messages: Array<IMessage>;
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
  speakLang: string; // 输入语言
  voiceLang: number; // 朗读语言
  rate: number; // 语速
  pitch: number; // 音调
  viewSize: 'default'|'full'
}

export type IConversations = { [key: string]: IConversation };

export const GlobalContext = createContext<{
  config: IConfig;
  allConversations: IConversations;
  isMobile: boolean;
  setCurrentConversation: Dispatch<SetStateAction<IConversation>>;
  setAllConversations: Dispatch<SetStateAction<IConversations>>;
  setConfig: Dispatch<SetStateAction<IConfig>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  currentConversation: IConversation;
}>({
  config: {
    title: 'PERSONAL GPT',
    model: 'gpt-3.5-turbo',
    apiKey: '',
    temperature: 0.7,
    currentId: '',
    n: 1,
    size: '256x256',
    isContinuous: true,
    rate: 1,
    pitch: 1,
    speakLang: 'zh',
    voiceLang: 159,
    password: '',
    viewSize:'default'
  },
  allConversations: {},
  isMobile: false,
  loading: false,
  setAllConversations: () => {},
  setCurrentConversation: () => {},
  setConfig: () => {},
  setLoading: () => {},
  currentConversation: {
    id: 'ewrwerrr',
    type: 'text',
    messages: [],
  },
});
