import { B as BASE_URL } from './completions_73105a5f.mjs';

const post = async ({ request }) => {
  const { apiKey, prompt, size, n, password } = await request.json();
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
    const res = await fetch(`${BASE_URL}/v1/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({ prompt, n, size })
    });
    const data = await res.json();
    const { data: images = [], error } = data;
    if (error?.message) {
      return new Response(
        JSON.stringify({
          msg: error?.message
        }),
        { status: 500 }
      );
    }
    return {
      body: JSON.stringify({ data: images?.map((img) => img.url) || [] })
    };
  } catch (e) {
    return new Response(JSON.stringify({ msg: e?.message || e?.stack || e }), {
      status: 500
    });
  }
};

export { post };
