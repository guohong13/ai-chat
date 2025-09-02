export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface StreamChatOptions {
  onMessage?: (message: ChatMessage) => void;
  onStreamStart?: () => void;
  onStreamEnd?: () => void;
  onError?: (error: string) => void;
}

export class StreamChat {
  private messages: ChatMessage[] = [];
  private isStreaming = false;
  private abortController: AbortController | null = null;
  private options: StreamChatOptions;
  constructor(options: StreamChatOptions = {}) {
    this.options = options;
  }

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  async startStreaming(userMessage: string): Promise<void> {
    if (this.isStreaming) {
      throw new Error("Already streaming");
    }

    this.addUserMessage(userMessage);

    const aiMessage: ChatMessage = {
      id: this.generateId(),
      type: "assistant",
      content: "",
      timestamp: this.getCurrentTimestamp(),
      isStreaming: true,
    };

    this.messages.push(aiMessage);
    this.options.onMessage?.(aiMessage);
    this.options.onStreamStart?.();

    this.isStreaming = true;
    this.abortController = new AbortController();

    try {
      await this.streamResponse(aiMessage);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        aiMessage.content += "\n[对话已取消]";
      } else {
        aiMessage.content += `\n[错误: ${
          error instanceof Error ? error.message : "未知错误"
        }]`;
        this.options.onError?.(
          error instanceof Error ? error.message : "未知错误"
        );
      }
    } finally {
      aiMessage.isStreaming = false;
      aiMessage.timestamp = this.getCurrentTimestamp();
      this.isStreaming = false;
      this.abortController = null;
      this.options.onStreamEnd?.();
    }
  }

  private async streamResponse(aiMessage: ChatMessage): Promise<void> {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: this.messages.slice(0, -1),
        stream: true,
      }),
      signal: this.abortController?.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                aiMessage.content += data.content;
                this.options.onMessage?.(aiMessage);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  stopStreaming(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  clearHistory(): void {
    this.messages = [];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  public getCurrentTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private addUserMessage(content: string): ChatMessage {
    const message: ChatMessage = {
      id: this.generateId(),
      type: "user",
      content,
      timestamp: this.getCurrentTimestamp(),
    };

    this.messages.push(message);
    this.options.onMessage?.(message);
    return message;
  }
}
