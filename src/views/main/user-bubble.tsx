import React from 'react';
import './index.less';

interface IUserBubble {
  keyIndex: string;
  content: string;
}

function UserBubble(props: IUserBubble) {
  const { keyIndex, content } = props;
  return (
    <div
      className="text-bubble flex items-start justify-end gap-3 my-3 relative"
      key={keyIndex}
      style={{ fontFamily: '翩翩体-简' }}
    >
      <div style={{ maxWidth: '90%' }}>
        <div className="text-xs text-gray-300 h-3 mb-2 text-right">
          <span className="time hidden">{keyIndex}</span>
        </div>
        <div className="rounded-xl p-4 bg-gradient-to-r from-green-400 to-blue-400 text-white leading-7">
          {content}
        </div>
      </div>

      <img src="/user.svg" className="w-8 mt-2" />
    </div>
  );
}

export default UserBubble;
