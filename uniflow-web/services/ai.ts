import { createServerSupabase } from "@/lib/supabase/server";

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function buildFallbackReply(messages: AIMessage[], reason: string) {
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  const question = lastUser?.content?.trim() || "your question";

  return [
    "I am currently running in fallback mode, so this answer is a guided best-effort response.",
    `You asked: \"${question}\"`,
    "Try this approach:",
    "1) Break the problem into small parts and solve one part at a time.",
    "2) Write down what you already know and what is still unclear.",
    "3) Test one concrete example and verify the expected result.",
    "4) If you are still blocked, ask a focused follow-up with your exact error or output.",
    "",
    `Technical note: ${reason}`,
  ].join("\n");
}

export async function chatWithOpenAI(messages: AIMessage[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return buildFallbackReply(messages, "OPENAI_API_KEY is not configured.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return buildFallbackReply(messages, `OpenAI request failed: ${errorText}`);
  }

  const data = await response.json();
  const output = data.choices?.[0]?.message?.content;

  if (!output) {
    return buildFallbackReply(messages, "OpenAI returned an empty response.");
  }

  return output as string;
}

export async function suggestMentorsFromTopics(topics: string[]) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, full_name, subject_tags, rating, role")
    .eq("role", "mentor");

  if (error) {
    throw error;
  }

  const normalized = topics.map((item) => item.toLowerCase());
  return (data || []).filter((mentor) => {
    const tags = ((mentor.subject_tags || []) as string[]).map((item) => item.toLowerCase());
    return normalized.some((topic) => tags.includes(topic));
  });
}
