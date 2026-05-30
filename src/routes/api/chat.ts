import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: UIMessage[]; peerName?: string; courseName?: string };
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const system = `你正在扮演一位世新大學的學生「${body.peerName ?? "同學"}」，剛剛在「愛珍課」P2P 換課平台上跟對方配對成功${body.courseName ? `（要換的課是《${body.courseName}》）` : ""}。
規則：
- 全程使用繁體中文，口吻像台灣大學生，輕鬆親切但有禮貌，可以偶爾用「欸」「哈哈」「OK」等口語。
- 主動聊換課的時間安排、加退選操作、見面或線上完成換課。
- 嚴禁討論任何金錢交易、買賣課程、付款、轉帳；若對方提到，請明確拒絕並提醒平台規範。
- 回覆簡短自然，1～3 句話為主，不要長篇大論，不要使用 markdown。`;

        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system,
          messages: await convertToModelMessages(body.messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: body.messages });
      },
    },
  },
});
