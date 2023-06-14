import React from 'react';
import prompts from '@/prompts';
import type { IRole } from '@views/GlobalContext';
import { getCurrentTime } from '@utils/common';

import './index.less';
interface IEmpty {
  type: 'text' | 'image' | 'system';
  onSend: (
    value: string,
    type: 'text' | 'voice',
    time: string,
    role: IRole
  ) => void;
}

function Empty(props: IEmpty) {
  const { type, onSend } = props;

  return (
    <div>
      <div className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-2">
        welcome！
      </div>

      {type === 'text' ? (
        <>
          <div className="text-gray-400 leading-7">
            文本对话基于ChatGPT语言模型，你可以通过选择以下标签快速体验，或输入”/“获取更多提示
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            {prompts.slice(0, 10).map((item) => {
              return (
                <div
                  onClick={() =>
                    onSend(item.prompt, 'text', getCurrentTime(), 'system')
                  }
                  className="rounded-md border-dashed cursor-pointer border-gra-400 border flex-auto p-3 text-gray-500 transition-colors hover:border-solid hover:border-teal-500 hover:text-teal-500"
                >
                  {item.act}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="text-gray-400 leading-7">
            图像生成基于ChatGPT DALL·E图像模型，你可以通过输入关键词获取图片
          </div>
          <div className="text-gray-400 leading-7">
            可通过配置中心调节生成图片数量和大小
          </div>
          <div className="text-gray-400 leading-7">图片有效期为两小时</div>
        </>
      )}
    </div>
  );
}

export default Empty;
