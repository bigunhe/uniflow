import { getMentors } from "./actions";
import FindMentorsClient from "./_components/FindMentorsClient";

export default async function MentorsPage() {
  const mentors = await getMentors();

  return <FindMentorsClient mentors={mentors} />;
}
