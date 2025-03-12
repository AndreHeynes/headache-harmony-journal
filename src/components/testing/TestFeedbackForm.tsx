
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedbackFooter } from "@/components/support/FeedbackFooter";
import { useTestContext } from "@/contexts/TestContext";
import { toast } from "sonner";

export function TestFeedbackForm() {
  const { logTestEvent } = useTestContext();
  const [feedbackType, setFeedbackType] = useState("usability");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [rating, setRating] = useState<string | null>(null);

  const handleSubmitFeedback = () => {
    if (!feedbackContent.trim()) {
      toast.error("Please provide feedback content");
      return;
    }

    // Log the feedback as a test event
    logTestEvent({
      type: "feedback",
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
          <CardTitle className="text-white">Previously Submitted Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-6">
            Your submitted feedback will appear here for review.
          </p>
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
