import { TrackedEvent, UserProfile } from '@/types';
import ContributionGraph from '@/components/graph/ContributionGraph';
import GraphLegend from '@/components/graph/GraphLegend';

interface Props {
  user: UserProfile;
  events: TrackedEvent[];
}

export default function FeedCard({ user, events }: Props) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <p className="font-semibold text-sm mb-3">{user.username}</p>
      <ContributionGraph events={events} size="sm" />
      <GraphLegend />
    </div>
  );
}
