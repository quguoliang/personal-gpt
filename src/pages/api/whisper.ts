import { BASE_URL } from '@contants';
import type { APIRoute } from 'astro';
import { dataURLtoFile, stringToBlob } from '.';
// import { stringToBlob } from '.';

export const post: APIRoute = async ({ request }) => {
  const { apiKey, password, blob } = await request.json();
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
    if (!import.meta.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ msg: 'APIKEY 未填写或不存在！' }), {
        status: 500,
      });
    }
    key = import.meta.env.OPENAI_API_KEY;
  }

  try {
    const formData = new FormData();
    formData.append('file', dataURLtoFile(blob, 'test'), 'filename.webm');
    formData.append('model', 'whisper-1');
    const res = await fetch(`${BASE_URL}/v1/audio/transcriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
      },
      body: formData,
    });

    const resData = await res.json();
    const { text, error } = resData;
    if (error?.message) {
      return new Response(
        JSON.stringify({
          msg: error?.message,
        }),
        { status: 500 }
      );
    }

    return {
      body: JSON.stringify({ data: text }),
    };
  } catch (e) {
    return new Response(JSON.stringify({ msg: e?.message || e?.stack || e }), {
      status: 500,
    });
  }
};
