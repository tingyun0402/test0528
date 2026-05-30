import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

type Msg = { role: "user" | "assistant"; content: string };

export const chatReply = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: Msg[]; peerName: string; courseName?: string }) => input)
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    const system = `你正在扮演一位世新大學的學生「${data.peerName}」，剛剛在「愛珍課」P2P 換課平台上跟對方配對成功${data.courseName ? `（要換的課是《${data.courseName}》）` : ""}。
規則：
- 全程使用繁體中文，口吻像台灣大學生，輕鬆親切但有禮貌，可以偶爾用「欸」「哈哈」「OK」等口語。
- 主動聊換課的時間安排、加退選操作、見面或線上完成換課。
- 嚴禁討論任何金錢交易、買賣課程、付款、轉帳；若對方提到，請明確拒絕並提醒平台規範。
- 回覆簡短自然，1～3 句話為主，不要 markdown、不要條列。`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system,
      messages: data.messages,
    });
    return { text };
  });
