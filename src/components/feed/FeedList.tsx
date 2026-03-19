import { TrackedEvent, UserProfile } from '@/types';
import FeedCard from './FeedCard';

interface Props {
  users: UserProfile[];
  events: TrackedEvent[];
}

export default function FeedList({ users, events }: Props) {
  if (users.length === 0) {
    return <p className="text-gray-500 text-sm">No users yet.</p>;
  }

  return (
    <div className="space-y-6">
      {users.map(user => {
        const userEvents = events.filter(e => e.user_id === user.id);
        return <FeedCard key={user.id} user={user} events={userEvents} />;
      })}
    </div>
  );
}
