import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { GlobalContext, type IMessage, type IRole } from '@views/GlobalContext';
import InputBox from './input-box';
import AiBubble from './ai-bubble';
import UserBubble from './user-bubble';
import Empty from './empty';
import { getCurrentTime } from '@utils/common';
import OperateIndexDB from '@indexDB';

export const config = {
  runtime: 'edge',
};

function Main() {
  const {
    loading,
    setLoading,
    config,
    currentConversation,
    setCurrentConversation,
    setAllConversations,
    isMobile,
  } = useContext(GlobalContext);
  const { model, apiKey, n, size, temperature, isContinuous } = config || {};

  const [curMessage, setCurMessage] = useState<IMessage[]>([]);
  const [controller, setController] = useState<AbortController | null>(null);

  const indexDBRef = useRef(new OperateIndexDB('voices', 1));

  const updateStorage = (params: { type: 'all' | 'cur'; messages: any }) => {
    const id = currentConversation?.id;
    const { type, messages } = params;
    if (type === 'all') {
      setAllConversations((pre) => ({
        ...pre,
        [id]: {
          ...pre[id],
          messages,
        },
      }));
    } else {
      setCurrentConversation((pre) => {
        return {
          ...pre,
          messages,
        };
      });
    }
  };

  const getGptData = async (messages: IMessage[]) => {
    setLoading(true);
    const abortController = new AbortController();
    setController(abortController);
    let done = false;
    let answer = '';
    const modifyMessages: IMessage[] = isContinuous
      ? [...messages]
      : [...currentConversation.messages, ...messages];
    modifyMessages.push({
      role: 'assistant',
      content: answer,
      time: getCurrentTime(),
      type: 'text',
    });
    updateStorage({ type: 'cur', messages: modifyMessages });

    const response = await fetch('/api/completions', {
      method: 'POST',
      body: JSON.stringify({
        model,
        apiKey,
        messages: messages.map((item) => ({
          role: item.role,
          content: item.content,
        })),
        temperature,
        password: config?.password,
      }),
      signal: abortController.signal,
    });

    if (response.status < 400 && response.ok) {
      const data = response.body;
      const reader = data?.getReader();
      const decoder = new TextDecoder();
      while (!done) {
        const { value, done: doneReading } = (await reader?.read()) || {};
        done = !!doneReading;
        const chunkValue = decoder.decode(value);
        answer += chunkValue;
        modifyMessages[modifyMessages.length - 1].content = answer;
        setCurMessage(modifyMessages);
        updateStorage({ type: 'cur', messages: modifyMessages });
      }
    } else {
      const { msg, error } = await response.json();
      modifyMessages[modifyMessages.length - 1].content =
        msg || error?.message || response.statusText || 'Unknown';
      setCurMessage(modifyMessages);
      updateStorage({ type: 'cur', messages: modifyMessages });
    }
    setTimeout(() => {
      updateStorage({
        type: 'all',
        messages: modifyMessages,
      });
      setCurMessage([]);
      setLoading(false);
    }, 1000);
  };

  const getImageData = async (prompt: string) => {
    setLoading(true);
    const messages = currentConversation.messages.concat([
      {
        role: 'user',
        content: prompt,
        time: getCurrentTime(),
        type: 'text',
      },
      { role: 'assistant', content: '', time: '', type: 'text' },
    ]);
    updateStorage({ type: 'cur', messages });
    updateStorage({ type: 'all', messages });
    const res = await fetch('/api/images', {
      method: 'POST',
      body: JSON.stringify({
        n,
        size,
        apiKey,
        prompt,
        password: config?.password,
      }),
    });

    if (res.status < 400 && res.ok) {
      const { data = [], msg } = await res.json();

      messages[messages.length - 1].content = data.reduce((pre, cur) => {
        pre += `![图片已过期](${cur}) \n`;
        return pre;
      }, '');
      messages[messages.length - 1].time = getCurrentTime();
      updateStorage({ type: 'cur', messages });
      updateStorage({ type: 'all', messages });
    } else {
      const { msg, error } = await res.json();
      messages[messages.length - 1].content =
        msg || error?.message || res.statusText || 'Unknown';
      messages[messages.length - 1].time = getCurrentTime();
      setCurMessage(messages);
      updateStorage({ type: 'cur', messages });
    }
    setLoading(false);
  };

  const onSend = async (
    value: string,
    type: 'text' | 'voice',
    time?: string,
    role?: IRole
  ) => {
    if (!value) {
      return;
    }
    if (currentConversation.type === 'image') {
      await getImageData(value);
    } else {
      const newMessages: IMessage[] = [
        {
          role: role || 'user',
          content: value,
          time: time || getCurrentTime(),
          type,
        },
      ];
      const messages = currentConversation.messages.concat(newMessages);
      await getGptData(isContinuous ? messages : newMessages);
    }
  };

  const onStop = () => {
    controller?.abort?.();
    updateStorage({
      type: 'all',
      messages: curMessage,
    });
    setLoading(false);
    setCurMessage([]);
  };

  useEffect(() => {
    var element = document.getElementById('main-conversation') as HTMLElement; // 获取需要滚动的元素
    // 在内容变化时自动滚动到底部
    element?.addEventListener('DOMSubtreeModified', function () {
      element.scrollTop = element?.scrollHeight || 0;
    });
  }, []);

  return (
    <div
      id="main"
      className="w-full relative"
      style={{ height: 'calc(100% - 60px)' }}
    >
      <div
        id="main-conversation"
        className="w-full p-4 overflow-auto h-full scroll-style"
        style={{ paddingBottom: 115 }}
      >
        {!currentConversation?.messages?.length && (
          <Empty onSend={onSend} type={currentConversation.type} />
        )}
        {currentConversation?.messages?.map((message, index) =>
          message.role === 'assistant' ? (
            <AiBubble
              keyIndex={message.time}
              content={message.content}
              loading={loading}
              config={config}
              isMobile={isMobile}
            />
          ) : (
            <UserBubble message={message} indexDB={indexDBRef.current} />
          )
        )}
        {loading && (
          <div className="w-full h-5 flex text-center justify-center">
            <Button type="dashed" onClick={onStop} danger>
              停止回答
            </Button>
          </div>
        )}
      </div>

      <InputBox
        loading={loading}
        onSend={onSend}
        type={currentConversation.type}
        indexDB={indexDBRef.current}
      />
    </div>
  );
}

export default Main;
