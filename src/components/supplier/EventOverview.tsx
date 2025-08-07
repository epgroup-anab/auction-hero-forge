import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventOverviewProps {
  event: {
    id: string;
    title: string;
    description: string;
    host: string;
    company: string;
  };
}

export function EventOverview({ event }: EventOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          You have accepted the event and the host has approved you to take part. Please review the Overview below to understand more about this event.
        </p>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        Please work through the tabs from left to right. The last two tabs can be used for any documentation and for messaging. The Host contact details are provided below in case you have any questions on this event.
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Brief</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{event.description}</p>
          <p className="mb-4">These must be delivered to our London office.</p>
          <p className="mb-4">Please see product specification available in the Documents tab for more details.</p>
          <p className="text-sm text-muted-foreground">
            For questions on this requirement, contact us via the Messages tab. If you have technical questions on using the Market Dojo platform, contact their support team directly on support@marketdojo.com or use the live chat in the bottom right of the website.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Host Contact Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Name:</span> {event.host}
            </div>
            <div>
              <span className="font-medium">Company:</span> {event.company}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}