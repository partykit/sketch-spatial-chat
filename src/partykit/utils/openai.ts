import OpenAI from "openai";
import { OpenAIStream } from "ai";

export type AIMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

type Params = {
  env: Record<string, any>;
  messages: AIMessage[];
  onStartCallback: () => void;
  onTokenCallback: (token: string) => void;
};

export async function getChatCompletionResponse(params: Params) {
  const { env, messages, onStartCallback, onTokenCallback } = params;

  try {
    const apiKey = env.OPENAI_API_KEY as string | undefined;
    const organization = env.OPENAI_API_ORGANIZATION as string | undefined;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    const openai = organization
      ? new OpenAI({ apiKey, organization })
      : new OpenAI({ apiKey });

    const openAIParams: OpenAI.Chat.ChatCompletionCreateParams = {
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    };
    const openaiResponse = await openai.chat.completions.create(openAIParams);
    const stream = OpenAIStream(openaiResponse, {
      onStart: async () => onStartCallback(),
      onToken: async (token) => onTokenCallback(token),
    });

    // @ts-ignore
    for await (const _ of stream) {
      // no-op, just read the stream, onToken callback above will handle the tokens
    }
  } catch (e) {
    console.error("Error while executing OpenAI call", e);
    throw e;
  }

  return null;
}
