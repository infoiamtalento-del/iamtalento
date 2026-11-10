// Provider-agnostic AI interface with Gemini, OpenAI, and Anthropic adapters.

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CompleteOptions {
  system?: string;
  messages: ChatMessage[];
  schema?: Record<string, unknown>;
  maxTokens?: number;
  temperature?: number;
}

export interface AiClient {
  complete(opts: CompleteOptions): Promise<string>;
  embed(texts: string[]): Promise<number[][]>;
}

// 1. Google Gemini adapter
class GeminiAdapter implements AiClient {
  private apiKey: string;
  private model: string;
  private embeddingModel: string;

  constructor(apiKey: string, model = "gemini-1.5-flash", embeddingModel = "text-embedding-004") {
    this.apiKey = apiKey;
    this.model = model;
    this.embeddingModel = embeddingModel;
  }

  async complete(opts: CompleteOptions): Promise<string> {
    const contents = opts.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const payload: Record<string, unknown> = { contents };

    if (opts.system) {
      payload.systemInstruction = { parts: [{ text: opts.system }] };
    }
    if (opts.schema) {
      payload.generationConfig = {
        responseMimeType: "application/json",
        responseSchema: opts.schema,
      };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error [${res.status}]: ${errText}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }

  async embed(texts: string[]): Promise<number[][]> {
    const results: number[][] = [];
    for (const text of texts) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.embeddingModel}:embedContent?key=${this.apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: `models/${this.embeddingModel}`,
          content: { parts: [{ text }] },
          outputDimensionality: 1536,
        }),
      });
      if (!res.ok) throw new Error(`Gemini embedding error [${res.status}]: ${await res.text()}`);
      const data = await res.json();
      results.push(data.embedding.values);
    }
    return results;
  }
}

// 2. OpenAI adapter
class OpenAIAdapter implements AiClient {
  private apiKey: string;
  private model: string;
  private embeddingModel: string;

  constructor(apiKey: string, model = "gpt-4o-mini", embeddingModel = "text-embedding-3-small") {
    this.apiKey = apiKey;
    this.model = model;
    this.embeddingModel = embeddingModel;
  }

  async complete(opts: CompleteOptions): Promise<string> {
    const messages: ChatMessage[] = [];
    if (opts.system) messages.push({ role: "system", content: opts.system });
    messages.push(...opts.messages);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: opts.temperature ?? 0.3,
        response_format: opts.schema ? { type: "json_object" } : undefined,
      }),
    });

    if (!res.ok) throw new Error(`OpenAI API error [${res.status}]: ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  async embed(texts: string[]): Promise<number[][]> {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.embeddingModel,
        input: texts,
        dimensions: 1536,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI embeddings error: ${await res.text()}`);
    const data = await res.json();
    return data.data.map((d: { embedding: number[] }) => d.embedding);
  }
}

// 3. Anthropic adapter
class AnthropicAdapter implements AiClient {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "claude-3-5-haiku-20241022") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async complete(opts: CompleteOptions): Promise<string> {
    const messages = opts.messages.map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    }));

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: opts.maxTokens ?? 1024,
        system: opts.system,
        messages,
      }),
    });

    if (!res.ok) throw new Error(`Anthropic API error: ${await res.text()}`);
    const data = await res.json();
    return data.content?.[0]?.text ?? "";
  }

  async embed(_texts: string[]): Promise<number[][]> {
    throw new Error("Anthropic does not offer an embedding API; configure OpenAI or Gemini for embeddings.");
  }
}

// Factory function
export function getAiClient(): AiClient {
  const provider = (Deno.env.get("AI_PROVIDER") ?? "gemini").toLowerCase();
  const apiKey = Deno.env.get("AI_API_KEY");

  if (!apiKey) {
    throw new Error(`AI_API_KEY is not configured for provider: ${provider}`);
  }

  const model = Deno.env.get("AI_MODEL");
  const embeddingModel = Deno.env.get("EMBEDDING_MODEL");

  switch (provider) {
    case "openai":
      return new OpenAIAdapter(apiKey, model, embeddingModel);
    case "anthropic":
      return new AnthropicAdapter(apiKey, model);
    case "gemini":
    default:
      return new GeminiAdapter(apiKey, model, embeddingModel);
  }
}
