import { BASE_URL } from '@contants';
import type { APIRoute } from 'astro';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

export const config = {
  runtime: 'edge',
  /**
   * https://vercel.com/docs/concepts/edge-network/regions#region-list
   * disable hongkong
   * only for vercel
   */
  regions: [
    'arn1',
    'bom1',
    'bru1',
    'cdg1',
    'cle1',
    'cpt1a',
    'dub1',
    'fra1',
    'gru1',
    'hnd1',
    'iad1',
    'icn1',
    'kix1',
    'lhr1',
    'pdx1',
    'sfo1',
    'sin1',
    'syd1',
  ],
};

export const post: APIRoute = async ({ request }) => {
  const { apiKey, model, temperature, messages, password } =
    await request.json();
  let key = apiKey;

  if (import.meta.env.PASSWORD || process.env.PASSWORD) {
    const configPassword = import.meta.env.PASSWORD || process.env.PASSWORD;
    if (configPassword !== password) {
      return new Response(
        JSON.stringify({ msg: '访问密码不正确，当前访问已被拒绝！' }),
        {
          status: 500,
        }
      );
    }
  }

  if (!key) {
    if (!import.meta.env.OPEN_API_KEY && !process.env.OPEN_API_KEY) {
      return new Response(JSON.stringify({ msg: 'APIKEY 未填写或不存在！' }), {
        status: 500,
      });
    }
    key = import.meta.env.OPEN_API_KEY || process.env.OPEN_API_KEY;
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ model, temperature, messages, stream: true }),
    });

    if (!res.ok) {
      return new Response(res.body, {
        status: res.status,
      });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let counter = 0;

    const stream = new ReadableStream({
      async start(controller) {
        function onParse(event: ParsedEvent | ReconnectInterval) {
          if (event.type === 'event') {
            const data = event.data;
            if (data === '[DONE]') {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const text = json.choices[0]?.delta?.content;
              if (!text) return;
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
        for await (const chunk of res.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      },
    });
    return new Response(stream);
  } catch (e) {
    console.log('Error', e);
    return new Response(JSON.stringify({ msg: e?.message || e?.stack || e }), {
      status: 500,
    });
  }
};
