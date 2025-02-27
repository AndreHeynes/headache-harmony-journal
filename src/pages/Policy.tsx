
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// This would typically come from an API or config based on user's country
const getUserCountry = (): string => {
  // In a real app, you might:
  // 1. Get this from the user's profile in your database
  // 2. Detect it from their IP address or browser locale
  // 3. Let them select it explicitly
  return localStorage.getItem('userCountry') || 'US';
};

// Sample country-specific policy content
const countrySpecificPolicies: Record<string, {
  privacy: Array<{title: string, content: string}>,
  terms: Array<{title: string, content: string}>,
  dataHandling: Array<{title: string, content: string}>,
  countrySpecificRules: string
}> = {
  'US': {
    privacy: [
      { 
        title: 'Information We Collect', 
        content: 'We collect personal information that you provide directly, including your name, email address, and health information related to your headaches. We also collect usage data automatically when you use the app.' 
      },
      { 
        title: 'HIPAA Compliance', 
        content: 'For US users, we adhere to HIPAA guidelines for the protection of health information. You have the right to access, correct, and delete your health information.' 
      }
    ],
    terms: [
      { 
        title: 'User Agreement', 
        content: 'By using this app, you agree to these terms and our privacy policy. You must be at least 13 years of age to use this service.' 
      }
    ],
    dataHandling: [
      { 
        title: 'Data Storage', 
        content: 'Your data is stored securely on servers located in the United States in compliance with HIPAA regulations.' 
      }
    ],
    countrySpecificRules: 'In the United States, this application complies with HIPAA regulations and the California Consumer Privacy Act (CCPA) where applicable.'
  },
  'UK': {
    privacy: [
      { 
        title: 'Information We Collect', 
        content: 'We collect personal information that you provide directly, including your name, email address, and health information related to your headaches. We also collect usage data automatically when you use the app.' 
      },
      { 
        title: 'GDPR Compliance', 
        content: 'For UK users, we adhere to GDPR guidelines for the protection of personal data. You have the right to access, correct, delete, restrict processing, and port your data.' 
      }
    ],
    terms: [
      { 
        title: 'User Agreement', 
        content: 'By using this app, you agree to these terms and our privacy policy. You must be at least 13 years of age to use this service.' 
      }
    ],
    dataHandling: [
      { 
        title: 'Data Storage', 
        content: 'Your data is stored securely on servers located in the European Union in compliance with GDPR regulations.' 
      }
    ],
    countrySpecificRules: 'In the United Kingdom, this application complies with GDPR regulations and the UK Data Protection Act 2018.'
  },
  'default': {
    privacy: [
      { 
        title: 'Information We Collect', 
        content: 'We collect personal information that you provide directly, including your name, email address, and health information related to your headaches. We also collect usage data automatically when you use the app.' 
      }
    ],
    terms: [
      { 
        title: 'User Agreement', 
        content: 'By using this app, you agree to these terms and our privacy policy. You must be at least 13 years of age to use this service.' 
      }
    ],
    dataHandling: [
      { 
        title: 'Data Storage', 
        content: 'Your data is stored securely on our servers with appropriate safeguards in place.' 
      }
    ],
    countrySpecificRules: 'We strive to comply with local regulations in all jurisdictions where our app is available. Please contact us if you have specific concerns about compliance with your local laws.'
  }
};

const Policy = () => {
  const [userCountry, setUserCountry] = useState('default');
  const [isContentComplete, setIsContentComplete] = useState(false);
  
  useEffect(() => {
    const country = getUserCountry();
    setUserCountry(countrySpecificPolicies[country] ? country : 'default');
    
    // In a real app, you would check if the content is complete
    setIsContentComplete(false);
  }, []);

  const policy = countrySpecificPolicies[userCountry] || countrySpecificPolicies['default'];

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Legal Policies</h1>
          
          {!isContentComplete && (
            <Alert variant="destructive" className="w-auto inline-flex ml-4 p-2 h-10">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="ml-2">Admin Notice</AlertTitle>
            </Alert>
          )}
        </div>
        
        <Alert className="mb-6 bg-amber-900/20 border-amber-500 text-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The policies shown below are specific to {userCountry === 'default' ? 'general international guidelines' : userCountry}. You can change your country in your profile settings.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
            <TabsTrigger value="terms">Terms of Service</TabsTrigger>
            <TabsTrigger value="data">Data Handling</TabsTrigger>
          </TabsList>
          
          <TabsContent value="privacy">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
                <CardDescription>
                  Last updated: {new Date().toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {policy.privacy.map((section, index) => (
                      <AccordionItem key={index} value={`privacy-${index}`}>
                        <AccordionTrigger className="text-white">{section.title}</AccordionTrigger>
                        <AccordionContent className="text-gray-300">
                          {section.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="terms">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Terms of Service</CardTitle>
                <CardDescription>
                  Last updated: {new Date().toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {policy.terms.map((section, index) => (
                      <AccordionItem key={index} value={`terms-${index}`}>
                        <AccordionTrigger className="text-white">{section.title}</AccordionTrigger>
                        <AccordionContent className="text-gray-300">
                          {section.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Data Handling & Country-Specific Rules</CardTitle>
                <CardDescription>
                  How we process and store your information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    {policy.dataHandling.map((section, index) => (
                      <AccordionItem key={index} value={`data-${index}`}>
                        <AccordionTrigger className="text-white">{section.title}</AccordionTrigger>
                        <AccordionContent className="text-gray-300">
                          {section.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  <div className="p-4 border border-gray-700 rounded-lg bg-gray-900/30 mt-4">
                    <h3 className="text-lg font-medium text-white mb-2">Country-Specific Regulatory Compliance</h3>
                    <p className="text-gray-300">{policy.countrySpecificRules}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Policy;
