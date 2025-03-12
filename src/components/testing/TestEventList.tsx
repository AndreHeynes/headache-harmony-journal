
import { useState, useMemo } from "react";
import { TestEvent } from "@/contexts/TestContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListFilter, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TestEventListProps {
  events: TestEvent[];
}

export function TestEventList({ events }: TestEventListProps) {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const filteredEvents = useMemo(() => {
    return events
      .filter(event => {
        if (filter === "all") return true;
        return event.type === filter;
      })
      .filter(event => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          event.details.toLowerCase().includes(query) ||
          (event.component && event.component.toLowerCase().includes(query))
        );
      });
  }, [events, filter, searchQuery]);

  if (events.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">No events recorded yet. Start interacting with the app to collect testing data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            className="pl-8 bg-gray-800 border-gray-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center w-44">
          <ListFilter className="h-4 w-4 text-gray-400 mr-2" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Filter events" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="navigation">Navigation</SelectItem>
              <SelectItem value="feature_usage">Feature Usage</SelectItem>
              <SelectItem value="error">Errors</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="action">Actions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <ScrollArea className="h-[500px] w-full rounded-md">
          <div className="p-0">
            {filteredEvents.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-400">No matching events found.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {filteredEvents.map((event, index) => (
                  <div key={index} className="p-4 hover:bg-gray-700/30">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getEventTypeColor(event.type)}`}>
                          {formatEventType(event.type)}
                        </span>
                        {event.component && (
                          <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                            {event.component}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-white mb-1">{event.details}</p>
                    {event.metadata && (
                      <pre className="mt-2 p-2 bg-gray-900/50 rounded text-xs text-gray-300 max-w-full overflow-x-auto">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

function formatEventType(type: string): string {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function getEventTypeColor(type: string): string {
  switch (type) {
    case 'navigation':
      return 'bg-blue-500/20 text-blue-300';
    case 'feature_usage':
      return 'bg-green-500/20 text-green-300';
    case 'error':
      return 'bg-red-500/20 text-red-300';
    case 'feedback':
      return 'bg-purple-500/20 text-purple-300';
    case 'action':
      return 'bg-yellow-500/20 text-yellow-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
  }
}
