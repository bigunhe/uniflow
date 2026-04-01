import { redirect } from "next/navigation";

export default function MessagesLandingPage() {
  // Default to the first dummy mentor conversation.
  redirect("/messages/alex-rivers");
}

