import { BASE_URL } from '@contants';
import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
  const { apiKey, prompt, size, n, password } = await request.json();
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
    const res = await fetch(`${BASE_URL}/v1/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ prompt, n, size }),
    });

    const data = await res.json();
    const { data: images = [], error } = data;

    if (error?.message) {
      return new Response(
        JSON.stringify({
          msg: error?.message,
        }),
        { status: 500 }
      );
    }
    console.log(55444, data);

    return JSON.stringify(data);

    return new Response(
      JSON.stringify({
        data: images?.map((img) => img.url) || [],
      }),
      { status: 200 }
    );
  } catch (e) {
    return new Response(JSON.stringify({ msg: e?.message || e?.stack || e }), {
      status: 500,
    });
  }
};
