import { NextRequest, NextResponse } from "next/server";

// 配置管理
const API_CONFIG = {
  URL:
    process.env.DEEPSEEK_API_URL ||
    "https://api.deepseek.com/v1/chat/completions",
  KEY: process.env.DEEPSEEK_API_KEY,
  DEFAULT_MODEL: "deepseek-chat",
  DEFAULT_TEMPERATURE: 0.7,
  DEFAULT_MAX_TOKENS: 4000,
};

interface ClientMessage {
  type: "user" | "assistant";
  content: string;
}

interface DeepSeekMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: ClientMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

// 将客户端消息格式转换为 DeepSeek API 格式
const formatMessagesForApi = (messages: ClientMessage[]): DeepSeekMessage[] => {
  return messages.map((msg) => ({
    role: msg.type === "user" ? "user" : "assistant",
    content: msg.content,
  }));
};

// 处理来自 DeepSeek API 的流式响应
const handleStreamingResponse = (response: Response): ReadableStream => {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      if (!response.body) {
        controller.close();
        return;
      }

      const reader = response.body.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                controller.close();
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  const payload = `data: ${JSON.stringify({ content })}\n\n`;
                  controller.enqueue(encoder.encode(payload));
                }
              } catch (e) {
                console.warn("无法解析流中的JSON数据:", data);
              }
            }
          }
        }
      } catch (error) {
        const errorString = error ? error.toString() : "";
        if (
          errorString.includes("AbortError") ||
          errorString.includes("ResponseAborted")
        ) {
          console.log("数据流读取被客户端正常中止。");
        } else {
          console.error("读取流时发生错误:", error);
          controller.error(error);
        }
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });
};

export async function POST(request: NextRequest) {
  // 检查 API Key 是否配置
  if (!API_CONFIG.KEY) {
    console.error("DeepSeek API key 未配置");
    return NextResponse.json(
      { error: "服务器配置错误，请联系管理员。" },
      { status: 500 }
    );
  }

  try {
    const {
      messages,
      model = API_CONFIG.DEFAULT_MODEL,
      temperature = API_CONFIG.DEFAULT_TEMPERATURE,
      max_tokens = API_CONFIG.DEFAULT_MAX_TOKENS,
    } = (await request.json()) as RequestBody;

    // 验证消息格式
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "无效的消息格式。" }, { status: 400 });
    }

    const apiRequestBody = {
      model,
      messages: formatMessagesForApi(messages),
      stream: true,
      temperature,
      max_tokens,
    };

    const apiResponse = await fetch(API_CONFIG.URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_CONFIG.KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
      signal: request.signal, // 将前端请求的取消信号传递给后端请求
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("DeepSeek API 错误:", apiResponse.status, errorText);
      return NextResponse.json(
        { error: `上游服务错误: ${errorText}` },
        { status: apiResponse.status }
      );
    }

    const responseStream = handleStreamingResponse(apiResponse);

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const errorString = error ? error.toString() : "";
    // 当客户端取消请求时，fetch 会抛出 AbortError 或 ResponseAborted，这是正常行为
    if (
      errorString.includes("AbortError") ||
      errorString.includes("ResponseAborted")
    ) {
      console.log("请求被客户端中止。");
      // 返回一个特殊的 499 状态码表示客户端关闭了请求
      return new Response("Request aborted", { status: 499 });
    }
    console.error("Chat API 内部错误:", error);
    return NextResponse.json({ error: "服务器内部错误。" }, { status: 500 });
  }
}
