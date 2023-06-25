import React, { useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext } from '@views/GlobalContext';
import {
  SettingOutlined,
  ClearOutlined,
  UnorderedListOutlined,
  createFromIconfontCN,
} from '@ant-design/icons';
import {
  Form,
  Drawer,
  Input,
  Select,
  Collapse,
  Slider as ASlider,
  Tooltip,
  Switch,
} from 'antd';
import {
  LANGUAGE_OPTIONS,
  MODEL_OPTIONS,
  SIZE_OPTIONS,
  generateConverstationInit,
  VIEW_OPTIONS,
} from '../../contants';
import Slider from '@views/slider';
import useSpeechSynthesis from '@/hooks/useSpeechSynthesis';
import './index.less';

function Header() {
  const {
    config,
    setConfig,
    isMobile,
    setCurrentConversation,
    setAllConversations,
  } = useContext(GlobalContext);

  const [isOpen, setIsOpen] = useState(false);
  const [sliderVisible, setSliderVisible] = useState(false);
  const [dark, setDark] = useState(false);
  const { voices } = useSpeechSynthesis();
  const [formInst] = Form.useForm();

  const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4132366_15laece0j8k.js',
  });

  const onOpenSetting = () => {
    setIsOpen(true);
  };

  const changeDarkMode = () => {
    if (!dark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.classList.add('dark:bg-gray-700');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.classList.remove('dark:bg-gray-700');
    }
    setDark(!dark);
  };

  const onCloseSetting = () => {
    const values = formInst.getFieldsValue();
    setConfig((pre) => ({ ...pre, ...values }));
    setIsOpen(false);
  };

  const onCleanAll = () => {
    const data = generateConverstationInit('text');
    setCurrentConversation(data);
    setAllConversations({ [data.id]: data });
    setConfig((pre) => ({ ...pre, currentId: data.id }));
  };

  return (
    <header className="header">
      <div className=" flex justify-start items-center gap-4">
        {isMobile && (
          <UnorderedListOutlined
            className=" text-2xl leading-none"
            onClick={() => setSliderVisible(true)}
          />
        )}
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          {config.title}
        </div>
      </div>
      <div className="header-operate">
        <Tooltip title="夜间模式">
          <span onClick={changeDarkMode}>
            {dark ? (
              <IconFont
                type="icon-taiyang2"
                className="text-gray-400 cursor-pointer ml-3 hover:text-gray-600"
              />
            ) : (
              <IconFont
                type="icon-yueduye-yejianmoshi"
                className="text-gray-400 cursor-pointer ml-3 hover:text-gray-600"
              />
            )}
          </span>
        </Tooltip>
        <Tooltip title="清除全部对话">
          <ClearOutlined
            className="text-gray-400 cursor-pointer ml-3 hover:text-gray-600"
            onClick={onCleanAll}
          />
        </Tooltip>
        <Tooltip title="配置中心">
          <SettingOutlined
            className="text-gray-400 cursor-pointer ml-3 hover:text-gray-600"
            onClick={onOpenSetting}
          />
        </Tooltip>
      </div>
      <Drawer
        title="配置中心"
        placement="right"
        onClose={onCloseSetting}
        open={isOpen}
        getContainer={() => document.getElementById('views')}
        keyboard
        motion={false}
        width={isMobile ? 260 : 400}
      >
        <Form form={formInst} initialValues={config} className=" p-4">
          <Collapse accordion>
            <Collapse.Panel header="系统配置" key="4">
              <Form.Item label="密码:" name="password">
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
              <Form.Item label="页面大小:" name="viewSize">
                <Select options={VIEW_OPTIONS} />
              </Form.Item>
            </Collapse.Panel>
            <Collapse.Panel header="聊天相关" key="1">
              <Form.Item label="名称:" name="title">
                <Input />
              </Form.Item>
              <Form.Item label="Api Key:" name="apiKey">
                <Input />
              </Form.Item>
              <Form.Item label="模型:" name="model">
                <Select options={MODEL_OPTIONS} />
              </Form.Item>
              <Form.Item label="随机性：" name="temperature">
                <ASlider min={0} max={1} step={0.1} />
              </Form.Item>
            </Collapse.Panel>
            <Collapse.Panel header="图像生成" key="2">
              <Form.Item label="生成图片数量" name="n">
                <ASlider min={1} max={10} step={1} />
              </Form.Item>
              <Form.Item label="图片大小：" name="size">
                <Select options={SIZE_OPTIONS} />
              </Form.Item>
            </Collapse.Panel>
            <Collapse.Panel header="语音配置" key="3">
              <Form.Item label="输入语言：" name="speakLang">
                <Select options={LANGUAGE_OPTIONS} />
              </Form.Item>
              <Form.Item label="朗读语言：" name="voiceLang">
                <Select
                  options={voices.map((item, index) => ({
                    label: item.name,
                    value: index,
                  }))}
                />
              </Form.Item>
              <Form.Item label="语速：" name="rate">
                <ASlider min={0.5} max={2} step={0.1} />
              </Form.Item>
              <Form.Item label="语调：" name="pitch">
                <ASlider min={0.5} max={2} step={0.1} />
              </Form.Item>
            </Collapse.Panel>
          </Collapse>
        </Form>
      </Drawer>
      {isMobile && (
        <Drawer
          getContainer={() => document.getElementById('views')}
          placement="left"
          open={sliderVisible}
          onClose={() => setSliderVisible(false)}
          motion={false}
          width={260}
          headerStyle={{ display: 'none' }}
        >
          <Slider />
        </Drawer>
      )}
    </header>
  );
}

export default Header;
