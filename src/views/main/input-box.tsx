import React, { useContext, useState } from 'react';
import { Dropdown, Input, Tooltip } from 'antd';
import {
  HistoryOutlined,
  SoundOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import { GlobalContext } from '@views/GlobalContext';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import prompts from '@/prompts';

interface IInputBox {
  type: 'text' | 'image';
  loading: boolean;
  onSend: (value: string) => void;
}

function InputBox(props: IInputBox) {
  const { loading, onSend, type } = props;
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { config, setConfig } = useContext(GlobalContext);

  const onEnd = () => {
    // You could do something here after listening has finished
  };

  const onResult = (result) => {
    setInputValue(result);
  };

  const onError = (event) => {};

  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult,
    onEnd,
    onError,
  });

  const onChangeContinuous = () => {
    setConfig((pre) => ({ ...pre, isContinuous: !config.isContinuous }));
  };

  const onSendData = () => {
    if (!loading) {
      setInputValue('');
      onSend(inputValue);
    }
  };

  const onOpenSpeak = () => {
    listening ? stop() : listen({ lang: config.speakLang });
  };

  return (
    <div className=" absolute w-full bottom-0 left-0 min-h-fit bg-white flex items-center justify-center gap-5 rounded-2xl px-7 py-3">
      <Tooltip title={`${config.isContinuous ? '关闭' : '开启'}连续对话`}>
        <HistoryOutlined
          className={`cursor-pointer ${
            config.isContinuous ? 'text-orange-500' : 'text-gray-300'
          }`}
          onClick={onChangeContinuous}
        />
      </Tooltip>
      <Tooltip title={`${listening ? '关闭' : '打开'}语音输入`}>
        <AudioOutlined
          className={`cursor-pointer ${
            listening ? 'text-orange-500' : 'text-gray-300'
          }`}
          onClick={onOpenSpeak}
        />
      </Tooltip>
      <Dropdown
        open={isOpen}
        menu={{
          items: prompts.map((item) => ({
            key: item.act,
            label: item.act,
            value: item.prompt,
            onClick: () => {
              onSend(item.prompt);
              setInputValue('');
              setIsOpen(false);
            },
          })),
        }}
        overlayStyle={{ height: 500, overflow: 'auto' }}
      >
        <Input.TextArea
          allowClear
          value={inputValue}
          autoSize={{ minRows: 1, maxRows: 3 }}
          className="flex-1"
          size="large"
          placeholder="输入一条消息"
          onChange={(e) => {
            setInputValue(e.target.value);
            if (e.target.value === '/' && type === 'text') {
              setIsOpen(true);
            } else {
              setIsOpen(false);
            }
          }}
          onBlur={() => setTimeout(() => setIsOpen(false), 500)}
          onFocus={() =>
            inputValue === '/' && type === 'text' && setIsOpen(true)
          }
          onPressEnter={(e) => {
            if (!e.shiftKey && !loading) {
              e.preventDefault();
              onSendData();
            }
          }}
        />
      </Dropdown>
      <img
        src="/send.svg"
        className={` ${
          !inputValue || loading ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={onSendData}
      />
    </div>
  );
}

export default InputBox;
