import MessagesClient from "../_components/MessagesClient";

export default function MessagesByMentorPage({
  params,
}: {
  params: { mentorId: string };
}) {
  return <MessagesClient selectedMentorId={params.mentorId} />;
}

