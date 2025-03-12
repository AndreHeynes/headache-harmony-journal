
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function FeedbackFooter() {
  const handleFeedback = (isHelpful: boolean) => {
    toast.success(
      isHelpful ? "Thank you for your feedback!" : "We'll try to improve our help center"
    );
  };

  return (
    <footer className="bg-gray-800/80 border-t border-gray-700 px-4 py-6">
      <div className="text-center">
        <div className="mb-4">
          <p className="font-medium text-white">Was this helpful?</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="px-6 border-gray-700 text-gray-300 hover:bg-gray-700"
              onClick={() => handleFeedback(true)}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Yes
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="px-6 border-gray-700 text-gray-300 hover:bg-gray-700"
              onClick={() => handleFeedback(false)}
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              No
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
