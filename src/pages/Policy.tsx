
import { useState, useEffect } from "react";
import { AlertCircle, ChevronLeft, MoreVertical, Download } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
      },
      { 
        title: 'Account Creation', 
        content: 'You must provide accurate information when creating an account and maintain the confidentiality of your account credentials.' 
      },
      { 
        title: 'Prohibited Activities', 
        content: 'You may not use the service for any illegal purpose or to violate the rights of others. We reserve the right to terminate accounts that violate these terms.' 
      }
    ],
    dataHandling: [
      { 
        title: 'Data Storage', 
        content: 'Your data is stored securely on servers located in the United States in compliance with HIPAA regulations.' 
      },
      { 
        title: 'Data Sharing', 
        content: 'We only share your data with third parties with your explicit consent, or as required by law.' 
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
      },
      { 
        title: 'Account Creation', 
        content: 'You must provide accurate information when creating an account and maintain the confidentiality of your account credentials.' 
      },
      { 
        title: 'Prohibited Activities', 
        content: 'You may not use the service for any illegal purpose or to violate the rights of others. We reserve the right to terminate accounts that violate these terms.' 
      }
    ],
    dataHandling: [
      { 
        title: 'Data Storage', 
        content: 'Your data is stored securely on servers located in the European Union in compliance with GDPR regulations.' 
      },
      { 
        title: 'Data Sharing', 
        content: 'We only share your data with third parties with your explicit consent, or as required by law.' 
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
      },
      { 
        title: 'Account Creation', 
        content: 'You must provide accurate information when creating an account and maintain the confidentiality of your account credentials.' 
      },
      { 
        title: 'Prohibited Activities', 
        content: 'You may not use the service for any illegal purpose or to violate the rights of others. We reserve the right to terminate accounts that violate these terms.' 
      }
    ],
    dataHandling: [
      { 
        title: 'Data Storage', 
        content: 'Your data is stored securely on our servers with appropriate safeguards in place.' 
      },
      { 
        title: 'Data Sharing', 
        content: 'We only share your data with third parties with your explicit consent, or as required by law.' 
      }
    ],
    countrySpecificRules: 'We strive to comply with local regulations in all jurisdictions where our app is available. Please contact us if you have specific concerns about compliance with your local laws.'
  }
};

const Policy = () => {
  const [userCountry, setUserCountry] = useState('default');
  const [isContentComplete, setIsContentComplete] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const country = getUserCountry();
    setUserCountry(countrySpecificPolicies[country] ? country : 'default');
    
    // In a real app, you would check if the content is complete
    setIsContentComplete(false);
  }, []);

  const policy = countrySpecificPolicies[userCountry] || countrySpecificPolicies['default'];

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header with Admin Notice */}
        <div className="sticky top-0 z-10 flex items-center justify-between mb-6 bg-background/80 backdrop-blur-sm py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleGoBack}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-[#2DD4BF]">Legal Policies</h1>
          </div>
          
          {!isContentComplete && (
            <Alert variant="destructive" className="w-auto inline-flex ml-4 p-2 h-10">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="ml-2">Admin Notice</AlertTitle>
            </Alert>
          )}
        </div>
        
        {/* Country-specific Alert */}
        <Alert className="mb-6 bg-[#2DD4BF]/10 border-[#2DD4BF] text-[#2DD4BF]">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The policies shown below are specific to {userCountry === 'default' ? 'general international guidelines' : userCountry}. You can change your country in your profile settings.
          </AlertDescription>
        </Alert>

        <div className="mb-4 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>

        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="w-full mb-6 overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="terms">Terms of Service</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
            <TabsTrigger value="data">Data Usage</TabsTrigger>
            <TabsTrigger value="cookies">Cookie Policy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="terms">
            <Card>
              <CardHeader>
                <CardTitle>Terms of Service</CardTitle>
                <CardDescription>
                  Please read these terms carefully before using our service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">1. Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Welcome to our platform. These Terms of Service govern your use of our website, mobile applications, and services.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">2. User Agreements</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {policy.terms.map((section, index) => (
                      <AccordionItem key={index} value={`terms-${index}`}>
                        <AccordionTrigger>{section.title}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {section.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">3. Privacy & Data</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We take your privacy seriously. Learn about how we collect, use, and protect your personal information.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={() => window.open('mailto:support@headacheapp.com')}>
                  Contact Support
                </Button>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
                <CardDescription>
                  How we collect, use, and protect your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {policy.privacy.map((section, index) => (
                      <AccordionItem key={index} value={`privacy-${index}`}>
                        <AccordionTrigger>{section.title}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {section.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={() => window.open('mailto:privacy@headacheapp.com')}>
                  Privacy Inquiries
                </Button>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Usage & Storage</CardTitle>
                <CardDescription>
                  How we store, process, and protect your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    {policy.dataHandling.map((section, index) => (
                      <AccordionItem key={index} value={`data-${index}`}>
                        <AccordionTrigger>{section.title}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {section.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  <div className="p-4 border rounded-lg mt-4">
                    <h3 className="text-lg font-medium mb-2">Country-Specific Regulatory Compliance</h3>
                    <p className="text-muted-foreground">{policy.countrySpecificRules}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={() => window.open('mailto:data@headacheapp.com')}>
                  Data Requests
                </Button>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="cookies">
            <Card>
              <CardHeader>
                <CardTitle>Cookie Policy</CardTitle>
                <CardDescription>
                  How we use cookies and similar technologies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">What are cookies?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and personalizing content.
                  </p>
                  
                  <h2 className="text-xl font-semibold">How we use cookies</h2>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Essential cookies: Required for the website to function properly</li>
                    <li>Functional cookies: Help us remember your preferences and settings</li>
                    <li>Analytics cookies: Help us understand how visitors interact with our website</li>
                    <li>Marketing cookies: Used to track visitors across websites for marketing purposes</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline">Cookie Preferences</Button>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Policy;
