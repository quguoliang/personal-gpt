import React from 'react';
import { WifiOutlined } from '@ant-design/icons';
import type OperateIndexDB from '@indexDB';
import type { IMessage } from '@views/GlobalContext';

import './index.less';

interface IUserBubble {
  message: IMessage;
  indexDB: OperateIndexDB;
}

function UserBubble(props: IUserBubble) {
  const { message, indexDB } = props;
  const { time, content, type } = message;

  const onPlayVoice = async () => {
    const blob = await indexDB.getVoice(time);
    if (blob === null) return false;
    // 创建一个 URL 资源对象给 Audio 读取
    const audio = new Audio(URL.createObjectURL(blob));
    // 播放音频
    audio.play();
  };

  return (
    <div
      className="text-bubble flex items-start justify-end gap-3 my-3 relative"
      key={time}
      style={{ fontFamily: '翩翩体-简' }}
    >
      <div style={{ maxWidth: '90%', minWidth: 120 }}>
        <div className="text-xs text-gray-300 h-3 mb-2 text-right">
          <span className="time hidden">{time}</span>
        </div>
        <div
          className={`rounded-xl p-4 bg-gradient-to-r from-green-400 to-blue-400 text-white leading-7 ${
            type === 'voice' ? 'text-right cursor-pointer' : ''
          }`}
          onClick={() => onPlayVoice()}
        >
          {type === 'text' ? (
            content
          ) : (
            <WifiOutlined
              style={{ transform: 'rotate(-90deg)', fontSize: 22 }}
            />
          )}
        </div>
      </div>

      <img src="/user.svg" className="w-8 mt-2" />
    </div>
  );
}

export default UserBubble;
