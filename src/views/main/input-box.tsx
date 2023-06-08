import React, { useContext, useRef, useState } from 'react';
import { Button, Dropdown, Input, Tooltip } from 'antd';
import {
  HistoryOutlined,
  SoundOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import { GlobalContext, type IRole } from '@views/GlobalContext';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import prompts from '@/prompts';

interface IInputBox {
  type: 'text' | 'image';
  loading: boolean;
  onSend: (value: string, role?: IRole) => void;
}

function InputBox(props: IInputBox) {
  const { loading, onSend, type } = props;
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  // 录音相关
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob>();
  const mediaRecorderRef = useRef<MediaRecorder>();

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
    // listening ? stop() : listen({ lang: config.speakLang });
    let audioData: any = []; // 存储录音数据块
    if (isSpeaking) {
      mediaRecorderRef.current?.stop();
    } else {
      // 请求麦克风权限
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          // 创建媒体记录
          mediaRecorderRef.current = new MediaRecorder(stream, {
            mimeType: 'audio/webm',
          });
          // 开始录制
          mediaRecorderRef.current.start();
          // 处理音频数据
          mediaRecorderRef.current.addEventListener('dataavailable', (ev) => {
            // 把数据块添加到数组
            audioData.push(ev.data);
            console.log(4444555, audioData);
          });
          // 录音停止
          mediaRecorderRef.current.addEventListener('stop', () => {
            // 把音频数据块转换为 Blob
            setAudioBlob(new Blob(audioData));
          });
        })
        .catch((info) => {
          alert('无法获取麦克风权限！错误信息：' + info);
        });
    }
    setIsSpeaking(!isSpeaking);
  };
  console.log(6555, audioBlob);

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
      <Tooltip title={`${isSpeaking ? '关闭' : '打开'}语音输入`}>
        <AudioOutlined
          className={`cursor-pointer ${
            isSpeaking ? 'text-orange-500' : 'text-gray-300'
          }`}
          onClick={onOpenSpeak}
        />
      </Tooltip>
      <Button
        onClick={() => {
          if (audioBlob === null) return false;
          // 创建一个 URL 资源对象给 Audio 读取
          const audio = new Audio(URL.createObjectURL(audioBlob as Blob));
          // 播放音频
          audio.play();
        }}
      >
        播放
      </Button>
      <Dropdown
        open={isOpen}
        menu={{
          items: prompts.map((item) => ({
            key: item.act,
            label: item.act,
            value: item.prompt,
            onClick: () => {
              onSend(item.prompt, 'system');
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
