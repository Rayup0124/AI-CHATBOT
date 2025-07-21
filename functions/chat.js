// 文件路径: functions/chat.js
// 这是【正确】的、使用 Gemini API 的版本

export async function onRequest(context) {
  // 只响应 POST 请求
  if (context.request.method !== 'POST') {
    return new Response('不支持的请求方法', { status: 405 });
  }

  try {
    // 从请求中解析出用户消息和系统提示
    const { message, system_prompt } = await context.request.json();
    const { env } = context; // 获取环境变量

    // Gemini 的 API Key
    const GEMINI_API_KEY = env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
        throw new Error("API 密钥未设置");
    }

    // Gemini API 的接口地址，我们用 gemini-1.5-flash，速度快且免费额度高
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    // 准备发送给 Gemini 的数据格式
    const requestBody = {
      "contents": [
        {
          "role": "user",
          "parts": [
            { "text": `${system_prompt}\n\nUser Question: ${message}` }
          ]
        }
      ]
    };

    // 使用 fetch 调用 Gemini API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error("Gemini API 返回了错误。");
    }

    const data = await response.json();
    
    // 解析 Gemini 的响应格式
    const aiResponse = data.candidates[0].content.parts[0].text;

    // 将 Gemini 的响应返回给前端
    return new Response(JSON.stringify({ message: aiResponse.trim() }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('发生错误:', error.message);
    // 这里的错误信息也改成了 Gemini
    return new Response(JSON.stringify({ message: "因发生错误，无法从 Gemini 获取响应。" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}