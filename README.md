<div align='center'>
<h1>PERSONAL GPT</h1>
是时候拥有一个属于你自己的ChatGPT了

[在线demo](https://quguoliang.netlify.app/)

[![Deploy to Netlify](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fa7e21562ad412585947d84ac7d08e8~tplv-k3u1fbpfcp-zoom-1.image)](https://app.netlify.com/start/deploy?repository=https://github.com/quguoliang/personal-gpt#OPENAI_API_KEY=\&PASSWORD=)

</div>

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32f542b345dd4e738a8ab4151496287e~tplv-k3u1fbpfcp-watermark.image?)

## 功能列表

*   支持文本对话
*   支持生成图片（DALL·E模型）
*   支持文本朗读以及语音输入，让你能够流利的与AI对话（主要目的是可以练口语：)）
*   支持语速、语言的调整
*   支持语言模型调整，目前免费的即是gpt-3.5，gpt-4需要购买。
*   一键启动/关闭连续对话，gpt普通用户有token限制，连续对话token会累积，超过一定限制则无法连续对话，文本与token的转换可以看官方文档。
*   内置100多条提示，让你的GPT更听话。
*   支持屏幕适配，手机、web均可优雅使用。
*   Netlify部署让你无需科学上网即可开启AI生涯

## 开始使用

*   申请一个ChatGPT 账号，然后拿到apikey。
*   点击上面一键部署Netlify，用github登录后部署。
*   部署后进入Netlify，输入环境变量，具体环境变量看以下列表。
*   可以调整域名为自己喜欢的名字，或者部署完成后也可以重定向到已购的域名。

| 环境变量名称         | 说明                                                                                  |
| -------------- | ----------------------------------------------------------------------------------- |
| OPEN\_API\_KEY | 即openAPI的apikey，可在部署前的高级配置填写，也部署完成后填写；填写后只要访问站点就可以使用相关功能，如无配置，则需要在站点的配置中心添加后使用      |
| PASSWORD       | 站点密码，为了防止站点被滥用，可以给站点配置密码，当存在密码时，使用相关功能需要在配置中心填写相关密码才可。（如果配置了OPEN\_API\_KEY，建议配置密码！） |

## 持续更新

*   fork本项目，然后再到Netlify重新部署fork的项目，后续分支有变化会自动同步更新部署。

## 二次开发

首先需要了解的相关内容：

*   [ Astro框架](https://astro.build/)
*   [Tailwindcss](https://www.tailwindcss.cn/)
*   React（应该都会吧....）

fork本项目，然后clone到本地后，在根目录创建一个.env文件，内容如下:

```js
OPEN_API_KEY=<apikey>
```

替换你自己的apikey即可。

### api开发

路径为：
/src/pages/api

### 页面开发

路径为：
/src/views

### 配置信息

/src/contants
