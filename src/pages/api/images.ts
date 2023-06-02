import { BASE_URL } from '@contants';
import type { APIRoute } from 'astro';

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
    if (!import.meta.env.OPEN_API_KEY) {
      return JSON.stringify({ msg: 'APIKEY 未填写或不存在！' });
    }
    key = import.meta.env.OPEN_API_KEY;
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
