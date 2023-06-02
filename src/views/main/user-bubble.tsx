import React from 'react';

interface IUserBubble {
  keyIndex: string;
  content: string;
}

function UserBubble(props: IUserBubble) {
  const { keyIndex, content } = props;
  return (
    <div
      className="flex items-start justify-end gap-3 my-3 relative"
      key={keyIndex}
      style={{ fontFamily: '翩翩体-简' }}
    >
      <div className="rounded-xl p-4 bg-gradient-to-r from-green-400 to-blue-400 text-white leading-7">
        {content}
      </div>
      <img src="/user.svg" className="w-8 mt-2" />
    </div>
  );
}

export default UserBubble;
