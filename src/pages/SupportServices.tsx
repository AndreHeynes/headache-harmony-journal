
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// This would typically come from an API or config based on user's country
const getUserCountry = (): string => {
  // In a real app, you might:
  // 1. Get this from the user's profile in your database
  // 2. Detect it from their IP address or browser locale
  // 3. Let them select it explicitly
  return localStorage.getItem('userCountry') || 'US';
};

// Sample country-specific content - in a real app, this would come from your backend
const countrySpecificContent: Record<string, {
  hotlines: Array<{name: string, number: string}>,
  resources: Array<{name: string, url: string}>,
  clinics: string
}> = {
  'US': {
    hotlines: [
      { name: 'National Headache Foundation', number: '1-888-NHF-5552' },
      { name: 'American Migraine Foundation', number: '1-856-423-0043' }
    ],
    resources: [
      { name: 'National Headache Foundation', url: 'https://headaches.org/' },
      { name: 'American Migraine Foundation', url: 'https://americanmigrainefoundation.org/' }
    ],
    clinics: 'For specialized headache clinics in the US, please consult the directory provided by the National Headache Foundation or ask your primary care physician for a referral.'
  },
  'UK': {
    hotlines: [
      { name: 'The Migraine Trust', number: '0808 802 0066' },
      { name: 'National Migraine Centre', number: '020 7251 3322' }
    ],
    resources: [
      { name: 'The Migraine Trust', url: 'https://migrainetrust.org/' },
      { name: 'National Migraine Centre', url: 'https://nationalmigrainecentre.org.uk/' }
    ],
    clinics: 'For specialized headache clinics in the UK, speak with your GP about a referral to a neurologist or headache specialist through the NHS.'
  },
  'default': {
    hotlines: [
      { name: 'International Headache Society', number: 'Please check your local resources' }
    ],
    resources: [
      { name: 'International Headache Society', url: 'https://ihs-headache.org/' },
      { name: 'World Health Organization', url: 'https://www.who.int/' }
    ],
    clinics: 'Please consult with your local healthcare provider for information about specialized headache clinics in your area.'
  }
};

const SupportServices = () => {
  const [userCountry, setUserCountry] = useState('default');
  const [isContentComplete, setIsContentComplete] = useState(false);
  
  useEffect(() => {
    const country = getUserCountry();
    setUserCountry(countrySpecificContent[country] ? country : 'default');
    
    // In a real app, you would check if the content is complete
    setIsContentComplete(false);
  }, []);

  const content = countrySpecificContent[userCountry] || countrySpecificContent['default'];

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Support Services</h1>
          
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
            The information shown below is specific to {userCountry === 'default' ? 'general international guidelines' : userCountry}. You can change your country in your profile settings.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="hotlines" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="hotlines">Emergency Hotlines</TabsTrigger>
            <TabsTrigger value="resources">Online Resources</TabsTrigger>
            <TabsTrigger value="clinics">Specialized Clinics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hotlines">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Emergency & Support Hotlines</CardTitle>
                <CardDescription>
                  These hotlines can provide immediate assistance and information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.hotlines.map((hotline, index) => (
                    <div key={index} className="p-4 border border-gray-700 rounded-lg bg-gray-900/30">
                      <h3 className="text-lg font-medium text-white">{hotline.name}</h3>
                      <p className="text-xl font-bold text-primary mt-2">{hotline.number}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Online Resources</CardTitle>
                <CardDescription>
                  These organizations provide valuable information and resources for headache sufferers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.resources.map((resource, index) => (
                    <div key={index} className="p-4 border border-gray-700 rounded-lg bg-gray-900/30">
                      <h3 className="text-lg font-medium text-white">{resource.name}</h3>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" 
                        className="text-primary hover:underline mt-2 block">
                        {resource.url}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clinics">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Specialized Headache Clinics</CardTitle>
                <CardDescription>
                  Finding specialized care for chronic or severe headaches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border border-gray-700 rounded-lg bg-gray-900/30">
                  <p className="text-gray-300">{content.clinics}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SupportServices;
