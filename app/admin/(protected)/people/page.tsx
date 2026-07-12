import {
  listApplications,
  listContactMessages,
} from "@/lib/data/submissions";
import PeopleList from "./PeopleList";

export default async function AdminPeoplePage() {
  const [applications, messages] = await Promise.all([
    listApplications(),
    listContactMessages(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-copper">People</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
          Applications &amp; messages
        </h1>
        <p className="mt-2 text-sm text-mist">
          Everyone who applied to a role or wrote in through the contact form.
        </p>
      </div>

      <PeopleList applications={applications} messages={messages} />
    </div>
  );
}
