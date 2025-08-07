import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

interface EventMessagesProps {
  event: {
    id: string;
    title: string;
    host: string;
    company: string;
  };
}

export function EventMessages({ event }: EventMessagesProps) {
  const [newMessage, setNewMessage] = useState("");
  const [subject, setSubject] = useState("");

  const messages = [
    {
      id: 1,
      from: "John Smith",
      subject: "Welcome to the Laptop Auction",
      message: "Thank you for participating in our auction. Please review all documents carefully.",
      timestamp: "January 15, 2020 10:30 AM",
      isFromHost: true
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() && subject.trim()) {
      // Handle sending message
      setNewMessage("");
      setSubject("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Message History */}
      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">
                      {message.isFromHost ? `${message.from} (Host)` : message.from}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {message.timestamp}
                    </div>
                  </div>
                  <div className="font-medium text-sm mb-1">
                    Subject: {message.subject}
                  </div>
                  <div className="text-sm">{message.message}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No messages yet. Start a conversation with the host below.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send New Message */}
      <Card>
        <CardHeader>
          <CardTitle>Send New Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Send a message to {event.host} at {event.company}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter message subject"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={6}
              />
            </div>

            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !subject.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}