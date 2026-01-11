import { format } from 'date-fns';
import { Award, MessageCircleWarning, ThumbsUp, Lightbulb, User } from 'lucide-react';
import { Engagement, EngagementFeedbackCategory, EngagementMilestone, User as Staff } from '@shared/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';
interface EngagementTimelineProps {
  engagements: Engagement[];
  staffList: Staff[];
}
const milestoneIcons: Record<EngagementMilestone, React.ElementType> = {
  '1 Month': Award,
  '6 Months': Award,
  '1 Year': Award,
  'Anniversary': Award,
  'Other': Lightbulb,
};
const feedbackIcons: Record<EngagementFeedbackCategory, React.ElementType> = {
  'Praise': ThumbsUp,
  'Concern': MessageCircleWarning,
  'Suggestion': Lightbulb,
};
const feedbackColors: Record<EngagementFeedbackCategory, string> = {
    'Praise': 'text-green-500',
    'Concern': 'text-red-500',
    'Suggestion': 'text-blue-500',
};
export function EngagementTimeline({ engagements, staffList }: EngagementTimelineProps) {
  const staffMap = useMemo(() => new Map(staffList.map(s => [s.id, s])), [staffList]);
  const sortedEngagements = useMemo(() => 
    [...engagements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [engagements]
  );
  if (sortedEngagements.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-muted-foreground">No Engagements Logged Yet</h3>
        <p className="text-sm text-muted-foreground mt-1">Use the Quick Add button to log the first one!</p>
      </div>
    );
  }
  return (
    <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-border after:left-0">
      {sortedEngagements.map((engagement, index) => {
        const staffMember = staffMap.get(engagement.staffId);
        const FeedbackIcon = feedbackIcons[engagement.feedbackCategory];
        return (
          <div key={engagement.id} className="grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 mb-8">
            <div className="flex items-center gap-x-3">
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background ring-2 ring-border">
                <FeedbackIcon className={`h-4 w-4 ${feedbackColors[engagement.feedbackCategory]}`} />
              </div>
            </div>
            <div className="pt-1.5">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      {engagement.parentName} - <span className="font-medium text-muted-foreground">{engagement.milestone}</span>
                    </CardTitle>
                    <time className="text-sm text-muted-foreground">
                      {format(new Date(engagement.createdAt), 'MMM d, yyyy')}
                    </time>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">{engagement.notes}</p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={staffMember?.avatarUrl} />
                      <AvatarFallback>{staffMember?.name.charAt(0) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <span>Logged by {staffMember?.name ?? 'Unknown Staff'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      })}
    </div>
  );
}