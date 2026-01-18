
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

interface PilotTestInvitationProps {
  recipientName?: string;
  startDate?: string;
  endDate?: string;
  contactEmail?: string;
  invitationCode?: string;
}

export function PilotTestInvitation({
  recipientName = "[Participant's Name]",
  startDate = "[Start Date]",
  endDate = "[End Date]",
  contactEmail = "[Your Email]",
  invitationCode = "PILOTTEST2023"
}: PilotTestInvitationProps) {
  
  const handleDownloadLetter = () => {
    const letterContent = `
Dear ${recipientName},

I'm excited to invite you to participate in the pilot testing phase of Headache Experience Journal, a new application designed to help users better understand and gather any relationships or pattern identification of your headache experience. This you can share with your doctor in order to better understand your headache disorder.

Purpose of Testing:
The main objective of this pilot testing is to gather valuable feedback on the usability, functionality, and effectiveness of our application before its official launch. Your insights will directly influence the final product and help us ensure it genuinely addresses the needs of people who experience headaches.

Duration of Testing:
The pilot testing period will run for eight weeks, from ${startDate} to ${endDate}. During this time, we ask that you use the application as you normally would to track your headache experiences, explore the analysis features, and test various functionalities.

What's Involved:
- Use the app to log your headache experiences and related factors
- Explore the analysis dashboard to view patterns and insights
- Test both basic and premium features (all premium features will be available during testing)
- Provide feedback through the in-app feedback form

How to Provide Feedback:
Our application includes a dedicated test dashboard accessible through the "Test" tab in the navigation menu. This dashboard allows you to:
- Submit detailed feedback on specific features
- Report any bugs or issues you encounter
- Suggest improvements or new features
- View your testing activity and analytics

Getting Started:
1. Download the application using the link provided in your email
2. Create an account using the invitation code: ${invitationCode}
3. Enable "Test Mode" in your profile settings
4. Begin exploring and using the app

Your participation is entirely voluntary, and all data collected during this testing phase will be used solely for improving the application. Your personal headache data will not be shared with any third parties.

If you have any questions or need assistance during the testing period, please don't hesitate to contact me directly at ${contactEmail}.

Thank you for considering this opportunity to help shape the future of headache tracking and analysis. Your feedback is invaluable to us!

Sincerely,

The Headache Experience Journal Team
    `;
    
    const blob = new Blob([letterContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = "Headache_Experience_Journal_Invitation.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader className="bg-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-xl md:text-2xl font-semibold">
          Invitation to Participate in Headache Experience Journal Pilot Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <p className="text-gray-800">Dear {recipientName},</p>
        
        <p className="text-gray-800">
          I'm excited to invite you to participate in the pilot testing phase of <strong>Headache Experience Journal</strong>,
          a new application designed to help users better understand and gather any relationships or pattern identification 
          of your headache experience. This you can share with your doctor in order to better understand your headache disorder.
        </p>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-indigo-700">Purpose of Testing:</h3>
          <p className="text-gray-800">
            The main objective of this pilot testing is to gather valuable feedback on the usability, 
            functionality, and effectiveness of our application before its official launch. Your insights 
            will directly influence the final product and help us ensure it genuinely addresses the needs 
            of people who experience headaches.
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-indigo-700">Duration of Testing:</h3>
          <p className="text-gray-800">
            The pilot testing period will run for eight weeks, from {startDate} to {endDate}. 
            During this time, we ask that you use the application as you normally would to track your 
            headache experiences, explore the analysis features, and test various functionalities.
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-indigo-700">What's Involved:</h3>
          <ul className="list-disc pl-5 text-gray-800 space-y-1">
            <li>Use the app to log your headache experiences and related factors</li>
            <li>Explore the analysis dashboard to view patterns and insights</li>
            <li>Test both basic and premium features (all premium features will be available during testing)</li>
            <li>Provide feedback through the in-app feedback form</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-indigo-700">How to Provide Feedback:</h3>
          <p className="text-gray-800">
            Our application includes a dedicated test dashboard accessible through the "Test" tab 
            in the navigation menu. This dashboard allows you to:
          </p>
          <ul className="list-disc pl-5 text-gray-800 space-y-1">
            <li>Submit detailed feedback on specific features</li>
            <li>Report any bugs or issues you encounter</li>
            <li>Suggest improvements or new features</li>
            <li>View your testing activity and analytics</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-indigo-700">Getting Started:</h3>
          <ol className="list-decimal pl-5 text-gray-800 space-y-1">
            <li>Download the application using the link provided in your email</li>
            <li>Create an account using the invitation code: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{invitationCode}</span></li>
            <li>Enable "Test Mode" in your profile settings</li>
            <li>Begin exploring and using the app</li>
          </ol>
        </div>
        
        <p className="text-gray-800">
          Your participation is entirely voluntary, and all data collected during this testing phase 
          will be used solely for improving the application. Your personal headache data will not be 
          shared with any third parties.
        </p>
        
        <p className="text-gray-800">
          If you have any questions or need assistance during the testing period, please don't 
          hesitate to contact me directly at <a href={`mailto:${contactEmail}`} className="text-indigo-600 underline">{contactEmail}</a>.
        </p>
        
        <p className="text-gray-800">
          Thank you for considering this opportunity to help shape the future of headache tracking and analysis. 
          Your feedback is invaluable to us!
        </p>
        
        <div className="pt-2">
          <p className="text-gray-800">Sincerely,</p>
          <p className="text-gray-800">The Headache Experience Journal Team</p>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 rounded-b-lg border-t border-gray-100">
        <Button onClick={handleDownloadLetter} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Download size={16} />
          Download Invitation Letter
        </Button>
      </CardFooter>
    </Card>
  );
}
