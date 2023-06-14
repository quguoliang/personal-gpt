import React, { useContext, useRef, useState } from 'react';
import { Dropdown, Input, Spin, Tooltip, message } from 'antd';
import { HistoryOutlined, LoadingOutlined } from '@ant-design/icons';
import { GlobalContext, type IRole } from '@views/GlobalContext';
import prompts from '@/prompts';
import type OperateIndexDB from '@indexDB';
import { blobToString, getCurrentTime } from '@utils/common';

interface IInputBox {
  type: 'text' | 'image';
  loading: boolean;
  indexDB: OperateIndexDB;
  onSend: (
    value: string,
    type: 'text' | 'voice',
    time?: string,
    role?: IRole
  ) => void;
}

function InputBox(props: IInputBox) {
  const { config, setConfig } = useContext(GlobalContext);
  const { loading, onSend, type, indexDB } = props;
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  // 录音相关
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('text');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder>();

  const onChangeContinuous = () => {
    setConfig((pre) => ({ ...pre, isContinuous: !config.isContinuous }));
  };

  const onSendData = () => {
    if (!loading) {
      setInputValue('');
      onSend(inputValue, inputMode);
    }
  };

  const onGetWhisper = async (time: string, blob: Blob) => {
    const response = await fetch(`/api/whisper`, {
      method: 'POST',
      body: JSON.stringify({
        apikey: config.apiKey,
        password: config.password,
        blob: await blobToString(blob),
      }),
    });
    if (response.status < 400 && response.ok) {
      const { data = '' } = await response.json();
      console.log(5555, data);

      onSend(data, inputMode, time, 'user');
    } else {
      const { msg, error } = await response.json();
      message.error('语音识别失败！' + msg);
    }
  };

  const onRecord = () => {
    let audioData: any = []; // 存储录音数据块
    if (isSpeaking) {
      setIsSpeaking(false);
      mediaRecorderRef.current?.stop();
    } else {
      setIsSpeaking(true);
      // 请求麦克风权限
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          let options: any;
          if (MediaRecorder.isTypeSupported('audio/webm')) {
            options = { mimeType: 'audio/webm' };
          } else {
            options = { mimeType: 'video/mp4' };
          }
          // const mediaRecorder = new MediaRecorder(stream, options);
          // 创建媒体记录
          mediaRecorderRef.current = new MediaRecorder(stream, options);
          // 开始录制
          mediaRecorderRef.current.start();
          // 处理音频数据
          mediaRecorderRef.current.addEventListener('dataavailable', (ev) => {
            // 把数据块添加到数组
            audioData.push(ev.data);
          });
          // 录音停止
          mediaRecorderRef.current.addEventListener('stop', () => {
            const blob = new Blob(audioData, { type: options.mimeType });
            const time = getCurrentTime();
            onGetWhisper(time, blob);
            // 把音频数据块转换为 Blob存入数据库
            indexDB.addVoice(time, blob);
          });
        })
        .catch((info) => {
          alert('无法获取麦克风权限！错误信息：' + info);
        });
    }
  };

  return (
    <div className=" absolute w-full bottom-0 left-0 min-h-fit bg-white flex items-center justify-center gap-5 rounded-2xl px-7 py-3">
      <Tooltip title={`${config.isContinuous ? '关闭' : '开启'}连续对话`}>
        <HistoryOutlined
          className={`cursor-pointer ${
            config.isContinuous ? 'text-orange-500' : 'text-gray-300'
          }`}
          size={32}
          onClick={onChangeContinuous}
        />
      </Tooltip>

      <span
        onClick={() => setInputMode(inputMode === 'text' ? 'voice' : 'text')}
        className="cursor-pointer"
      >
        {inputMode === 'voice' ? (
          <img src="/keyboards.svg" />
        ) : (
          <img src="/voice.svg" />
        )}
      </span>
      {inputMode === 'voice' ? (
        <div
          className="flex-1 w-full text-center bg-slate-100 rounded-lg text-gray-500 cursor-pointer hover:bg-slate-50"
          style={{ lineHeight: '38px' }}
          onClick={onRecord}
        >
          {isSpeaking && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />}
            />
          )}
          {isSpeaking ? '正在录音，点击结束' : '点击说话'}
        </div>
      ) : (
        <Dropdown
          open={isOpen}
          menu={{
            items: prompts.map((item) => ({
              key: item.act,
              label: item.act,
              value: item.prompt,
              onClick: () => {
                onSend(item.prompt, inputMode, getCurrentTime(), 'system');
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
      )}
      {inputMode === 'text' && (
        <img
          src="/send.svg"
          className={` ${
            !inputValue || loading ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={onSendData}
        />
      )}
    </div>
  );
}

export default InputBox;
