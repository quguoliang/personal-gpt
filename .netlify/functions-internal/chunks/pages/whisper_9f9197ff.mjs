import { B as BASE_URL } from './completions_73105a5f.mjs';
import { dataURLtoFile } from './index_be1ea2ef.mjs';

const post = async ({ request }) => {
  const { apiKey, password, blob } = await request.json();
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
  const typeMap = {
    "audio/webm": "webm",
    "audio/x-m4a": "m4a",
    "audio/mpeg": "mp3",
    "audio/x-wav": "wav",
    "video/mp4": "mp4"
  };
  try {
    const formData = new FormData();
    const { file, type } = dataURLtoFile(blob, "test");
    formData.append("file", file, "filename." + typeMap[type]);
    formData.append("model", "whisper-1");
    const res = await fetch(`${BASE_URL}/v1/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`
      },
      body: formData
    });
    const resData = await res.json();
    const { text, error } = resData;
    if (error?.message) {
      return new Response(
        JSON.stringify({
          msg: error?.message
        }),
        { status: 500 }
      );
    }
    return {
      body: JSON.stringify({ data: text })
    };
  } catch (e) {
    return new Response(JSON.stringify({ msg: e?.message || e?.stack || e }), {
      status: 500
    });
  }
};

export { post };
