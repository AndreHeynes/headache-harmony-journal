
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FeedbackFooter } from "@/components/support/FeedbackFooter";
import { useTestContext } from "@/contexts/TestContext";
import { exportFeedbackOnly } from "@/utils/testEventStorage";
import { toast } from "sonner";
import { Download, MessageSquare } from "lucide-react";

export function TestFeedbackForm() {
  const { logTestEvent, testEvents } = useTestContext();
  const [feedbackType, setFeedbackType] = useState("usability");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [rating, setRating] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [historyTypeFilter, setHistoryTypeFilter] = useState("all");

  // Get feedback history
  const feedbackHistory = useMemo(() => {
    return testEvents
      .filter(event => event.type === 'feedback')
      .sort((a, b) => b.timestamp - a.timestamp); // Most recent first
  }, [testEvents]);

  // Filter feedback history
  const filteredHistory = useMemo(() => {
    let filtered = [...feedbackHistory];

    // Filter by date range
    if (historyFilter !== 'all') {
      const now = Date.now();
      const daysAgo = historyFilter === '7days' ? 7 : 30;
      const cutoff = now - (daysAgo * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(event => event.timestamp >= cutoff);
    }

    // Filter by feedback type
    if (historyTypeFilter !== 'all') {
      filtered = filtered.filter(event => event.metadata?.feedbackType === historyTypeFilter);
    }

    return filtered;
  }, [feedbackHistory, historyFilter, historyTypeFilter]);

  const handleSubmitFeedback = () => {
    if (!feedbackContent.trim()) {
      toast.error("Please provide feedback content");
      return;
    }

    // Log the feedback as a test event - using the correct event type
    logTestEvent({
      type: "feedback", // Now this is a valid TestEventType
      details: `Feedback submitted: ${feedbackType}`,
      component: "TestFeedbackForm",
      metadata: {
        feedbackType,
        content: feedbackContent,
        rating
      }
    });

    // Reset form
    setFeedbackContent("");
    setRating(null);

    // Show confirmation
    toast.success("Feedback submitted", { 
      description: "Thank you for your valuable input!" 
    });
  };

  const handleExportFeedback = () => {
    try {
      exportFeedbackOnly(testEvents);
      toast.success("Feedback exported", {
        description: "Your feedback has been downloaded as JSON"
      });
    } catch (error) {
      toast.error("Export failed", {
        description: "Could not export feedback data"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Submit Test Feedback</CardTitle>
          <CardDescription className="text-gray-400">
            Share your experience with the app to help improve it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={feedbackType} onValueChange={setFeedbackType} className="mb-4">
            <TabsList className="bg-gray-900 text-gray-400">
              <TabsTrigger value="usability">Usability</TabsTrigger>
              <TabsTrigger value="bug">Bug Report</TabsTrigger>
              <TabsTrigger value="feature">Feature Request</TabsTrigger>
              <TabsTrigger value="premium">Premium Features</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {feedbackType === "usability" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience-rating" className="text-white">Rate your experience</Label>
                <RadioGroup 
                  id="experience-rating" 
                  value={rating || ""}
                  onValueChange={setRating}
                  className="flex space-x-4 pt-2"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-1">
                      <RadioGroupItem value={value.toString()} id={`rating-${value}`} className="text-purple-500" />
                      <Label htmlFor={`rating-${value}`} className="text-gray-300">{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="feedback-details" className="text-white">
              {getFeedbackPrompt(feedbackType)}
            </Label>
            <Textarea
              id="feedback-details"
              placeholder="Enter your feedback here..."
              className="h-32 bg-gray-900 border-gray-700 text-white"
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSubmitFeedback} className="bg-purple-600 hover:bg-purple-700">
            Submit Feedback
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Previously Submitted Feedback</CardTitle>
              <CardDescription className="text-gray-400 mt-1">
                {feedbackHistory.length} feedback submissions saved
              </CardDescription>
            </div>
            {feedbackHistory.length > 0 && (
              <Button 
                onClick={handleExportFeedback}
                variant="outline"
                size="sm"
                className="border-gray-600 hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export My Feedback
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {feedbackHistory.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-500" />
              <p className="text-gray-400">
                Your submitted feedback will appear here for review.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Submit feedback using the form above to see it saved here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filter Controls */}
              <div className="flex gap-3 pb-2">
                <Select value={historyFilter} onValueChange={setHistoryFilter}>
                  <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={historyTypeFilter} onValueChange={setHistoryTypeFilter}>
                  <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="usability">Usability</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="premium">Premium Features</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-gray-700" />

              {/* Feedback List */}
              {filteredHistory.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  No feedback matches the selected filters.
                </p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {filteredHistory.map((event, index) => (
                    <div 
                      key={`${event.timestamp}-${index}`}
                      className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className="capitalize border-purple-500 text-purple-400"
                          >
                            {event.metadata?.feedbackType || 'unknown'}
                          </Badge>
                          {event.metadata?.rating && (
                            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                              Rating: {event.metadata.rating}/5
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleDateString()} {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">
                        {event.metadata?.content || event.details}
                      </p>
                      {event.component && (
                        <p className="text-xs text-gray-500 mt-2">
                          Component: {event.component}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <FeedbackFooter />
    </div>
  );
}

function getFeedbackPrompt(type: string): string {
  switch (type) {
    case 'bug':
      return 'Describe the bug and steps to reproduce';
    case 'feature':
      return 'Describe the feature you would like to see';
    case 'premium':
      return 'Share your thoughts on premium features';
    case 'usability':
    default:
      return 'Share your experience with the app';
  }
}
