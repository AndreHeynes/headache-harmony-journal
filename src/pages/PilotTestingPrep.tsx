
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clipboard, ClipboardCheck, CheckCircle } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import BottomNavWithTest from "@/components/layout/BottomNavWithTest";
import { PilotTestInvitation } from '@/components/testing/PilotTestInvitation';
import { toast } from 'sonner';

export default function PilotTestingPrep() {
  const [activeTab, setActiveTab] = useState("invitation");
  const [recipientName, setRecipientName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [invitationCode, setInvitationCode] = useState("PILOTTEST2023");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  
  const formatDate = (date?: Date) => {
    return date ? format(date, 'MMMM d, yyyy') : '[Date]';
  };
  
  const handleCopyChecklist = () => {
    const checklist = `
PILOT TESTING PREPARATION CHECKLIST:

1. Finalize Test Environment:
   ☐ Configure test mode settings
   ☐ Set up test user accounts
   ☐ Verify premium features are accessible in test mode

2. App Distribution:
   ☐ Prepare download links
   ☐ Test installation process
   ☐ Ensure invitation codes work correctly

3. Documentation:
   ☐ Finalize user guide for testers
   ☐ Prepare feedback collection templates
   ☐ Create testing scenarios/tasks

4. Communication:
   ☐ Send invitation emails
   ☐ Schedule kick-off session
   ☐ Plan mid-test check-ins
   ☐ Schedule final feedback sessions

5. Success Metrics:
   ☐ Define key performance indicators
   ☐ Set up analytics tracking
   ☐ Create feedback analysis framework
    `;
    
    navigator.clipboard.writeText(checklist).then(() => {
      setCopied(true);
      toast.success("Checklist copied to clipboard");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen pb-24">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Pilot Testing Preparation</h1>
          <p className="text-gray-400 mt-2">
            Organize and manage your app pilot testing phase
          </p>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invitation">Invitation Letter</TabsTrigger>
            <TabsTrigger value="checklist">Preparation Checklist</TabsTrigger>
            <TabsTrigger value="settings">Test Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invitation" className="space-y-4">
            <Card className="bg-gray-800/50 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Customize Invitation</CardTitle>
                <CardDescription className="text-gray-400">
                  Personalize the invitation letter for your testers
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName" className="text-white">Recipient Name</Label>
                    <Input 
                      id="recipientName" 
                      placeholder="Enter recipient name" 
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="text-white">Contact Email</Label>
                    <Input 
                      id="contactEmail" 
                      type="email"
                      placeholder="Your contact email" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="invitationCode" className="text-white">Invitation Code</Label>
                  <Input 
                    id="invitationCode" 
                    placeholder="Enter invitation code" 
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
                            !startDate && "text-gray-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          className="bg-gray-800"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
                            !endDate && "text-gray-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          fromDate={startDate}
                          initialFocus
                          className="bg-gray-800"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-white rounded-lg p-6 overflow-auto max-w-4xl mx-auto">
              <PilotTestInvitation
                recipientName={recipientName || undefined}
                startDate={startDate ? formatDate(startDate) : undefined}
                endDate={endDate ? formatDate(endDate) : undefined}
                contactEmail={contactEmail || undefined}
                invitationCode={invitationCode || undefined}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="checklist">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Pilot Testing Preparation Checklist</CardTitle>
                <CardDescription className="text-gray-400">
                  Steps to complete before launching your pilot test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 text-white">
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-indigo-400">1. Finalize Test Environment</h3>
                      <CheckCircle className="h-5 w-5 text-indigo-400" />
                    </div>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Configure test mode settings</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Set up test user accounts</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Verify premium features are accessible in test mode</span>
                      </li>
                    </ul>
                  </section>
                  
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-indigo-400">2. App Distribution</h3>
                      <CheckCircle className="h-5 w-5 text-indigo-400" />
                    </div>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Prepare download links</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Test installation process</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Ensure invitation codes work correctly</span>
                      </li>
                    </ul>
                  </section>
                  
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-indigo-400">3. Documentation</h3>
                      <CheckCircle className="h-5 w-5 text-indigo-400" />
                    </div>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Finalize user guide for testers</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Prepare feedback collection templates</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Create testing scenarios/tasks</span>
                      </li>
                    </ul>
                  </section>
                  
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-indigo-400">4. Communication</h3>
                      <CheckCircle className="h-5 w-5 text-indigo-400" />
                    </div>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Send invitation emails</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Schedule kick-off session</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Plan mid-test check-ins</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Schedule final feedback sessions</span>
                      </li>
                    </ul>
                  </section>
                  
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-indigo-400">5. Success Metrics</h3>
                      <CheckCircle className="h-5 w-5 text-indigo-400" />
                    </div>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Define key performance indicators</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Set up analytics tracking</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded border border-gray-600 mr-2" />
                        <span>Create feedback analysis framework</span>
                      </li>
                    </ul>
                  </section>
                </div>
                
                <Button 
                  onClick={handleCopyChecklist}
                  className="mt-8 bg-indigo-600 hover:bg-indigo-700 w-full flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <ClipboardCheck className="h-4 w-4" />
                      Copied to clipboard
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4" />
                      Copy checklist to clipboard
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Configure Test Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Adjust settings for your pilot testing phase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-300">
                    Your app already has a robust testing framework in place! You can configure test settings through:
                  </p>
                  
                  <ul className="space-y-3 text-gray-300 list-disc ml-6">
                    <li>
                      Enable test mode for users via the profile page
                    </li>
                    <li>
                      Use the TestDashboard page to collect feedback and monitor testing activities
                    </li>
                    <li>
                      Leverage the existing TestContext to control test behavior and data collection
                    </li>
                    <li>
                      Display the TestGuide to help testers understand how to participate effectively
                    </li>
                  </ul>
                  
                  <div className="bg-indigo-900/30 border border-indigo-800 rounded-md p-4 mt-4">
                    <p className="text-indigo-200">
                      Your application already includes a comprehensive test mode with event tracking, feedback collection,
                      test analytics, and test settings management. These features are ready to use for your pilot testing!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavWithTest />
    </div>
  );
}
