import MessagesClient from "../_components/MessagesClient";

export default async function MessagesByMentorPage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;
  return <MessagesClient selectedMentorId={mentorId} />;
}

