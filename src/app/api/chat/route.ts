import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      messages,
      conversationId, // 添加对话ID支持
      model = "deepseek-chat",
      stream: streamEnabled = true,
    } = await request.json();

    console.log("Chat API request:", {
      conversationId,
      messagesCount: messages?.length,
      model,
      stream: streamEnabled,
    });

    // DeepSeek API配置
    const DEEPSEEK_API_URL =
      process.env.DEEPSEEK_API_URL ||
      "https://api.deepseek.com/v1/chat/completions";
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

    if (!DEEPSEEK_API_KEY) {
      console.error("DeepSeek API key not configured");
      return NextResponse.json(
        { error: "DeepSeek API key not configured" },
        { status: 500 }
      );
    }

    // 验证消息格式
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("Invalid messages format:", messages);
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // 构建请求体
    const requestBody = {
      model,
      messages: messages.map((msg: any) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      stream: streamEnabled,
      temperature: 0.7,
      max_tokens: 4000,
    };

    console.log("DeepSeek API request:", {
      url: DEEPSEEK_API_URL,
      model: requestBody.model,
      messagesCount: requestBody.messages.length,
      stream: requestBody.stream,
    });

    // 发起流式请求
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    console.log("DeepSeek API response successful, starting stream");

    // 返回流式响应
    const responseStream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let isControllerClosed = false;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  console.log("Stream completed");
                  if (!isControllerClosed) {
                    controller.close();
                    isControllerClosed = true;
                  }
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  console.log("Parsed stream data:", parsed);

                  if (parsed.choices?.[0]?.delta?.content) {
                    const content = parsed.choices[0].delta.content;
                    console.log("Sending content:", content);

                    // 检查控制器是否已关闭
                    if (!isControllerClosed) {
                      try {
                        controller.enqueue(
                          new TextEncoder().encode(
                            `data: ${JSON.stringify({ content })}\n\n`
                          )
                        );
                      } catch (enqueueError) {
                        console.warn(
                          "Failed to enqueue content:",
                          enqueueError
                        );
                        isControllerClosed = true;
                        break;
                      }
                    }
                  }
                } catch (e) {
                  console.warn("Failed to parse stream data:", e, data);
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
          if (!isControllerClosed) {
            controller.error(error);
            isControllerClosed = true;
          }
        } finally {
          reader.releaseLock();
          if (!isControllerClosed) {
            controller.close();
            isControllerClosed = true;
          }
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
