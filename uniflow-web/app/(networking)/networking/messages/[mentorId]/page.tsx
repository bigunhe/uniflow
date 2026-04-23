import MessagesClient from "../../../messages/_components/MessagesClient";

export default async function NetworkingMessagesPage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;
  return <MessagesClient selectedMentorId={mentorId} />;
}
