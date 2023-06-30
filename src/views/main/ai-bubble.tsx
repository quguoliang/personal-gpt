import React from 'react';
import { Skeleton, message } from 'antd';
import ReactMarkdown from 'react-markdown';
import { CopyFilled, SoundOutlined } from '@ant-design/icons';
import RemarkMath from 'remark-math';
import RehypeKatex from 'rehype-katex';
import RemarkGfm from 'remark-gfm';
import RemarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 代码高亮主题风格
import useSpeechSynthesis from '@/hooks/useSpeechSynthesis';
import type { IConfig } from '@views/GlobalContext';

import './index.less';

interface IAiBubble {
  keyIndex: string;
  content: string;
  loading: boolean;
  config: IConfig;
  isMobile: boolean;
}

function AiBubble(props: IAiBubble) {
  const { keyIndex, content, loading, config, isMobile } = props;

  const onEnd = () => {
    // You could do something here after speaking has finished
  };

  const { speak, cancel, speaking, voices } = useSpeechSynthesis({
    onEnd,
  });

  const onSpeck = () => {
    if (speaking) {
      cancel();
    } else {
      speak({
        text: content,
        voice: voices[config.voiceLang],
        rate: config.rate,
        pitch: config.pitch,
      });
    }
  };

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('复制成功!');
    });
  };

  return (
    <div
      className="text-bubble flex items-start justify-start gap-3 my-3 relative overflow-hidden"
      key={keyIndex}
      style={{ maxWidth: '100%' }}
    >
      <img src="/ai.svg" className="w-8 mt-2"></img>
      {loading && !content ? (
        <Skeleton.Input active />
      ) : (
        <div style={{ maxWidth: '90%' }}>
          <div className="text-xs text-gray-300 h-3 mb-2">
            <span className="hidden time ">{keyIndex}</span>
          </div>
          <div className="rounded-xl p-4 text-gray-600 bg-slate-100 relative dark:bg-gray-700	dark:text-gray-100">
            <ReactMarkdown
              children={content}
              remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
              rehypePlugins={[RehypeKatex]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return (
                    <span
                      className="code-block w-full overflow-auto scroll-style"
                      style={{ position: 'relative' }}
                    >
                      {!inline && match ? (
                        <>
                          <SyntaxHighlighter
                            showLineNumbers={true}
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                          <CopyFilled
                            className="code-copy-icon cursor-pointer absolute right-7 top-7 text-gray-300 "
                            onClick={() => onCopy(children[0] as string)}
                          />
                        </>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )}
                    </span>
                  );
                },
              }}
            />
            <SoundOutlined
              onClick={onSpeck}
              className={`speak-icon absolute text-xl ${(speaking || isMobile) && 'speak-icon-show'
                } `}
              style={{ right: -30, top: 5 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AiBubble;
