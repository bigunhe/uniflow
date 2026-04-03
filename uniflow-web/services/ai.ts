import { createServerSupabase } from "@/lib/supabase/server";

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function chatWithOpenAI(messages: AIMessage[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
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
    throw new Error(`OpenAI request failed: ${errorText}`);
  }

  const data = await response.json();
  const output = data.choices?.[0]?.message?.content;

  if (!output) {
    throw new Error("No AI response returned.");
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
