import OpenAI from "openai";
import { OpenAIStream } from "ai";

export type AIMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;
export type AIFunction = OpenAI.Chat.ChatCompletionCreateParams.Function;

type Params = {
  env: Record<string, any>;
  messages: AIMessage[];
  functions?: any[];
  onStartCallback: () => void;
  onTokenCallback: (token: string) => void;
};

export async function getChatCompletionResponse(params: Params) {
  const { env, messages, functions, onStartCallback, onTokenCallback } = params;
  const openai = new OpenAI({
    organization: env.OPENAI_API_ORGANIZATION,
    apiKey: env.OPENAI_API_KEY,
  });

  const openAIParams: OpenAI.Chat.ChatCompletionCreateParams = {
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
    functions,
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

  return null;
}
