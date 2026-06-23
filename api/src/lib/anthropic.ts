import Anthropic from "@anthropic-ai/sdk";

// Sonnet : bon ratio qualité/latence pour du conversationnel (brief §7).
export const CHAT_MODEL = "claude-sonnet-4-6";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});
