
import { BookOpen, BookCheck, BookPlus } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function UserGuideContent() {
  const guides = [
    {
      title: "Getting Started",
      icon: BookOpen,
      description: "Learn the basics of using the headache tracking app",
      content: [
        "Creating your account",
        "Logging your first headache",
        "Understanding the dashboard",
        "Setting up notifications"
      ]
    },
    {
      title: "Advanced Features",
      icon: BookCheck,
      description: "Master the advanced features and analytics",
      content: [
        "Using the analysis dashboard",
        "Creating custom variables",
        "Understanding correlation analysis",
        "Exporting your data"
      ]
    },
    {
      title: "Tips & Best Practices",
      icon: BookPlus,
      description: "Get the most out of your tracking experience",
      content: [
        "Consistent tracking habits",
        "Using tags effectively",
        "Identifying patterns",
        "Sharing with healthcare providers"
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {guides.map((guide, index) => (
        <Card key={index} className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
              <guide.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white mb-2">{guide.title}</h3>
              <p className="text-sm text-gray-400 mb-3">{guide.description}</p>
              <ul className="space-y-2">
                {guide.content.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary"></span>
                    {item}
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
