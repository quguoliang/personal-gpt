import 'dayjs';
import { createContext } from 'react';
import { createParser } from 'eventsource-parser';

createContext({
  config: {
    title: "PERSONAL GPT",
    model: "gpt-3.5-turbo-16k",
    apiKey: "",
    temperature: 0.7,
    currentId: "",
    n: 1,
    size: "256x256",
    isContinuous: true,
    rate: 1,
    pitch: 1,
    speakLang: "zh",
    voiceLang: 159,
    password: "",
    viewSize: "default"
  },
  allConversations: {},
  isMobile: false,
  loading: false,
  setAllConversations: () => {
  },
  setCurrentConversation: () => {
  },
  setConfig: () => {
  },
  setLoading: () => {
  },
  currentConversation: {
    id: "ewrwerrr",
    type: "text",
    messages: []
  }
});

const BASE_URL = "https://api.openai.com";

const post = async ({ request }) => {
  const { apiKey, model, temperature, messages, password } = await request.json();
  let key = apiKey;
  if (({}).PASSWORD || process.env.PASSWORD) {
    const configPassword = ({}).PASSWORD || process.env.PASSWORD;
    if (configPassword !== password) {
      return new Response(
        JSON.stringify({ msg: "访问密码不正确，当前访问已被拒绝！" }),
        {
          status: 500
        }
      );
    }
  }
  if (!key) {
    key = "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";
  }
  try {
    const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({ model, temperature, messages, stream: true })
    });
    if (!res.ok) {
      return new Response(res.body, {
        status: res.status
      });
    }
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let counter = 0;
    const stream = new ReadableStream({
      async start(controller) {
        function onParse(event) {
          if (event.type === "event") {
            const data = event.data;
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const text = json.choices[0]?.delta?.content;
              if (!text)
                return;
              if (counter < 2 && (text.match(/\n/) || []).length) {
                return;
              }
              const queue = encoder.encode(text);
              controller.enqueue(queue);
              counter++;
            } catch (e) {
              controller.error(e);
            }
          }
        }
        const parser = createParser(onParse);
        for await (const chunk of res.body) {
          parser.feed(decoder.decode(chunk));
        }
      }
    });
    return new Response(stream);
  } catch (e) {
    console.log("Error", e);
    return new Response(JSON.stringify({ msg: e?.message || e?.stack || e }), {
      status: 500
    });
  }
};

const completions = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  post
}, Symbol.toStringTag, { value: 'Module' }));

export { BASE_URL as B, completions as c };
