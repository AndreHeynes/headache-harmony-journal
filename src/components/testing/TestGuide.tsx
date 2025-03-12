
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TestBeaker, Info, CheckCircle2, ArrowRight, Lightbulb, MessageSquareText } from "lucide-react";
import { useTestContext } from "@/contexts/TestContext";

export function TestGuide({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const { logTestEvent } = useTestContext();
  
  const steps = [
    {
      title: "Welcome to Test Mode",
      description: "Thank you for helping test the Headache Experience Journal app. This guide will walk you through the testing process.",
      icon: TestBeaker,
      content: (
        <div className="space-y-3 text-gray-300">
          <p>You've successfully activated test mode, which means:</p>
          <ul className="space-y-2 ml-5 list-disc">
            <li>All premium features are now available to you</li>
            <li>Your actions will be logged for analysis</li>
            <li>You can provide feedback through the test dashboard</li>
          </ul>
          <p className="italic text-gray-400 text-sm">Note: Test data is stored separately from regular app data.</p>
        </div>
      )
    },
    {
      title: "Testing Goals",
      description: "We're looking for your feedback on specific aspects of the app.",
      icon: Info,
      content: (
        <div className="space-y-3 text-gray-300">
          <p>Please focus on testing these key areas:</p>
          <ul className="space-y-2 ml-5 list-disc">
            <li>Headache logging process</li>
            <li>Analysis dashboard and insights</li>
            <li>Overall usability and navigation</li>
            <li>Any bugs or issues you encounter</li>
          </ul>
          <p className="font-medium text-white mt-3">Try to use the app as you normally would, but pay attention to these details.</p>
        </div>
      )
    },
    {
      title: "How to Test",
      description: "Follow these steps to effectively test the application.",
      icon: CheckCircle2,
      content: (
        <div className="space-y-4 text-gray-300">
          <div className="flex items-start gap-2">
            <div className="bg-purple-500/20 text-purple-300 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
            <p>Explore the app and use all features, especially logging headaches and viewing analytics</p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="bg-purple-500/20 text-purple-300 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
            <p>Access the Test Dashboard by clicking the "Test" tab in the bottom navigation</p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="bg-purple-500/20 text-purple-300 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
            <p>Submit feedback about your experience through the feedback form</p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="bg-purple-500/20 text-purple-300 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
            <p>If you encounter bugs, please describe the steps to reproduce them</p>
          </div>
        </div>
      )
    },
    {
      title: "Providing Feedback",
      description: "Your insights will help improve the app for everyone.",
      icon: MessageSquareText,
      content: (
        <div className="space-y-3 text-gray-300">
          <p>The Test Dashboard offers multiple ways to provide feedback:</p>
          <ul className="space-y-2 ml-5 list-disc">
            <li>Use the feedback form to submit detailed comments</li>
            <li>Your actions are automatically tracked in the Events tab</li>
            <li>Export test data to share with developers</li>
          </ul>
          
          <div className="bg-indigo-900/30 border border-indigo-800/50 rounded-md p-3 mt-2 flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-indigo-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-indigo-200">Be specific with your feedback! Mention which screens or features you're referring to, and suggest improvements when possible.</p>
          </div>
        </div>
      )
    }
  ];
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      logTestEvent({
        type: "action",
        details: `Viewed test guide step ${currentStep + 1}`,
        component: "TestGuide"
      });
    } else {
      logTestEvent({
        type: "action",
        details: "Completed test guide",
        component: "TestGuide"
      });
      
      onClose();
    }
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  
  return (
    <Card className="bg-gray-800 border-gray-700 max-w-md mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-full">
            <Icon className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-white text-lg">{currentStepData.title}</CardTitle>
            <p className="text-sm text-gray-400 mt-1">{currentStepData.description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mt-2">
          {currentStepData.content}
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`h-1.5 w-6 rounded-full ${index === currentStep ? 'bg-purple-500' : 'bg-gray-600'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={handleNextStep}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {currentStep < steps.length - 1 ? (
            <>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            'Get Started'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// This is a small icon component that looks like a test beaker
function TestBeaker(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 3h6v2H9zM9 5v1a3 3 0 0 0 3 3v0a3 3 0 0 1 3 3v2M9 14v-3a3 3 0 0 0-3-3v0a3 3 0 0 1-3-3V4" />
      <path d="M8 21h8" />
      <path d="M10 17h4l2-5" />
      <path d="M15 12a5 5 0 0 0-8 2" />
    </svg>
  );
}
