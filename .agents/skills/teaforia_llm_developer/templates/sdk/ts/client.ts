// Teaforia LLM Gateway - Production TypeScript Client
// 專為 Qwen2-VL-7B 邊緣推理優化，內建 SSE 打字機串流解析與事實包工具掛載

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

export interface CompletionOptions {
  temperature?: number; // 考官模式推薦 0.2，結構化提取推薦 0.0
  maxTokens?: number;   // 預設 1024
  enableWebSearch?: boolean; // 是否掛載 web_search 工具自動注入事實包
  onChunk?: (text: string) => void;
  onDone?: () => void;
  onError?: (error: Error) => void;
}

export class TeaforiaClient {
  private baseUrl: string;
  private apiKey: string;
  private model: string;

  constructor(config?: { baseUrl?: string; apiKey?: string; model?: string }) {
    this.baseUrl = config?.baseUrl || 'https://llm.teaforia.in/v1';
    this.apiKey = config?.apiKey || 'teaforia-live-trustcv-gateway-2026';
    this.model = config?.model || 'qwen2-vl-7b-instruct';
  }

  /**
   * 發起高壓技術考官提問 (Grill Mode)
   * 自動鎖定 0.2 溫度並啟用 web_search 事實包注入
   */
  async grillCandidate(
    jobTarget: string,
    candidateBackground: string,
    options?: CompletionOptions
  ): Promise<string> {
    const systemPrompt = 
      "你是 TrustCV 資深技術考官。請直接以第一人稱考官身份，" +
      "依據客觀技術事實對候選人發起 2 道直擊底層架構痛點的硬核考題。" +
      "嚴禁任何客套話與廢話，直接發問！";

    const userPrompt = `職缺需求：${jobTarget}\n候選人自稱經歷：${candidateBackground}`;

    return this.chatStream(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      {
        temperature: 0.2,
        enableWebSearch: true,
        ...options
      }
    );
  }

  /**
   * 標準 SSE 流式對話
   */
  async chatStream(
    messages: ChatMessage[],
    options?: CompletionOptions
  ): Promise<string> {
    const payload: Record<string, any> = {
      model: this.model,
      messages: messages,
      temperature: options?.temperature ?? 0.2,
      max_tokens: options?.maxTokens ?? 1024,
      stream: true
    };

    if (options?.enableWebSearch) {
      payload.tools = [{ type: 'function', function: { name: 'web_search' } }];
    }

    let fullText = '';

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Teaforia Gateway 回應失敗 HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream not supported');

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;

          if (trimmed === 'data: [DONE]') {
            options?.onDone?.();
            return fullText;
          }

          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              const chunk = data.choices?.[0]?.delta?.content || '';
              if (chunk) {
                fullText += chunk;
                options?.onChunk?.(chunk);
              }
            } catch (e) {
              // 容錯跳過
            }
          }
        }
      }

      options?.onDone?.();
      return fullText;
    } catch (err: any) {
      options?.onError?.(err);
      throw err;
    }
  }
}
