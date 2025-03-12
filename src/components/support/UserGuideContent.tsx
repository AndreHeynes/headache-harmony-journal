
import { useState } from "react";
import { BookOpen, BookCheck, BookPlus, ChevronRight, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UserGuideContent() {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  
  const guides = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      description: "Learn the basics of using the headache tracking app",
      content: [
        {
          title: "Creating your account",
          description: "To create your account, tap on the 'Let's Start' button on the welcome screen. Fill in your email, create a password, and follow the verification steps. Once verified, you can customize your profile with health information that will help personalize your experience."
        },
        {
          title: "Logging your first headache",
          description: "To log a headache, tap the '+' button at the bottom of the screen or the 'Log New Headache' button on the dashboard. Follow the step-by-step process to record pain location, intensity, and any associated symptoms or triggers."
        },
        {
          title: "Understanding the dashboard",
          description: "Your dashboard shows a summary of recent headaches, quick insights about patterns, and options to log new episodes. Tap on any entry to view details or on insight cards to see more in-depth analysis."
        },
        {
          title: "Setting up notifications",
          description: "Go to Profile > Notifications to customize reminders about tracking, medication, or regular check-ins. You can set specific times and frequency based on your preferences."
        }
      ]
    },
    {
      id: "advanced-features",
      title: "Advanced Features",
      icon: BookCheck,
      description: "Master the advanced features and analytics",
      content: [
        {
          title: "Using the analysis dashboard",
          description: "The Analysis page provides visualizations of your headache patterns, including frequency, intensity, triggers, and effectiveness of treatments. Toggle between different charts and timeframes to explore your data."
        },
        {
          title: "Creating custom variables",
          description: "Premium users can track custom variables by going to Profile > Custom Variables. This allows you to monitor personal triggers or factors unique to your situation."
        },
        {
          title: "Understanding correlation analysis",
          description: "The correlation tool helps identify relationships between different factors and your headaches. Look for strong correlations to identify potential triggers or effective treatments."
        },
        {
          title: "Exporting your data",
          description: "To export your data, go to Profile > App Settings > Data Management. You can download your data in CSV format for personal records or to share with healthcare providers."
        }
      ]
    },
    {
      id: "best-practices",
      title: "Tips & Best Practices",
      icon: BookPlus,
      description: "Get the most out of your tracking experience",
      content: [
        {
          title: "Consistent tracking habits",
          description: "Try to log headaches as soon as possible after they occur. Set a regular time each day to check in, even if you haven't had a headache, to maintain consistent records."
        },
        {
          title: "Using tags effectively",
          description: "Create specific, consistent tags for your symptoms and triggers. This improves the accuracy of pattern analysis and makes it easier to identify trends over time."
        },
        {
          title: "Identifying patterns",
          description: "Review your Analysis page weekly to spot recurring patterns. Look at both obvious factors (like lack of sleep) and less obvious ones (like weather changes or specific foods)."
        },
        {
          title: "Sharing with healthcare providers",
          description: "Before medical appointments, export your data or prepare summary reports to share with your doctor. This provides objective information about your headache patterns to support better treatment decisions."
        }
      ]
    }
  ];

  const handleGuideClick = (guideId: string) => {
    setSelectedGuide(guideId);
  };

  const handleBackClick = () => {
    setSelectedGuide(null);
  };

  if (selectedGuide) {
    const guide = guides.find(g => g.id === selectedGuide);
    
    if (!guide) return null;
    
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          className="text-primary hover:text-primary-dark hover:bg-primary/10 -ml-2 mb-2"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to guides
        </Button>
        
        <div className="flex items-start gap-4 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 flex-shrink-0">
            <guide.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-white text-lg">{guide.title}</h3>
            <p className="text-sm text-gray-400">{guide.description}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {guide.content.map((item, idx) => (
            <Card key={idx} className="bg-gray-800/50 border-gray-700 p-4">
              <h4 className="font-medium text-white mb-2">{item.title}</h4>
              <p className="text-sm text-gray-300">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {guides.map((guide, index) => (
        <Card 
          key={index} 
          className="bg-gray-800/50 border-gray-700 p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
          onClick={() => handleGuideClick(guide.id)}
        >
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
              <guide.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-white mb-2">{guide.title}</h3>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </div>
              <p className="text-sm text-gray-400 mb-3">{guide.description}</p>
              <ul className="space-y-2">
                {guide.content.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary"></span>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
