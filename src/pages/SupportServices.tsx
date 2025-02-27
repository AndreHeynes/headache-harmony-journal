
import { useState, useEffect } from "react";
import { AlertCircle, Search, CircleHelp, Book, Headphones, Flag, Mail, Users, ThumbsUp, ThumbsDown } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

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
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const country = getUserCountry();
    setUserCountry(countrySpecificContent[country] ? country : 'default');
    setIsContentComplete(false);
  }, []);

  const content = countrySpecificContent[userCountry] || countrySpecificContent['default'];

  return (
    <div className="min-h-screen bg-[#E6FAF8]"> {/* Light turquoise background */}
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header with Title and Admin Notice */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#2DD4BF]">Support Center</h1>
          
          {!isContentComplete && (
            <Alert variant="destructive" className="w-auto inline-flex ml-4 p-2 h-10">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="ml-2">Admin Notice</AlertTitle>
            </Alert>
          )}
        </div>
        
        {/* Country-specific Alert */}
        <Alert className="border-[#2DD4BF] bg-[#E6FAF8] text-[#2DD4BF]">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-gray-800 font-medium">
            The information shown below is specific to {userCountry === 'default' ? 'general international guidelines' : userCountry}. You can change your country in your profile settings.
          </AlertDescription>
        </Alert>

        {/* Search Section */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2DD4BF] h-4 w-4" />
          <Input 
            type="text" 
            placeholder="Search for help..." 
            className="pl-10 bg-white border-[#2DD4BF]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Main Content Tabs - We removed the Category Cards block */}
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-white">
            <TabsTrigger value="resources" className="data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-white">Resources</TabsTrigger>
            <TabsTrigger value="hotlines" className="data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-white">Emergency Hotlines</TabsTrigger>
            <TabsTrigger value="clinics" className="data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-white">Specialized Clinics</TabsTrigger>
          </TabsList>
          
          {["resources", "hotlines", "clinics"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-900">{tab === "resources" ? "Online Resources" : tab === "hotlines" ? "Emergency & Support Hotlines" : "Specialized Clinics"}</CardTitle>
                  <CardDescription className="text-gray-700">
                    {tab === "resources" 
                      ? "These organizations provide valuable information and resources for headache sufferers."
                      : tab === "hotlines"
                      ? "These hotlines can provide immediate assistance and information."
                      : "Finding specialized care for chronic or severe headaches."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tab === "resources" && content.resources.map((resource, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-white">
                        <h3 className="text-lg font-medium text-gray-900">{resource.name}</h3>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" 
                          className="text-[#2DD4BF] hover:underline mt-2 block">
                          {resource.url}
                        </a>
                      </div>
                    ))}
                    {tab === "hotlines" && content.hotlines.map((hotline, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-white">
                        <h3 className="text-lg font-medium text-gray-900">{hotline.name}</h3>
                        <p className="text-xl font-bold text-[#2DD4BF] mt-2">{hotline.number}</p>
                      </div>
                    ))}
                    {tab === "clinics" && (
                      <div className="p-4 border rounded-lg bg-white">
                        <p className="text-gray-800">{content.clinics}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Contact Form */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Contact Support</CardTitle>
            <CardDescription className="text-gray-700">Fill out this form and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-800">Name</Label>
                  <Input id="name" type="text" className="bg-white border-[#2DD4BF]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-800">Email</Label>
                  <Input id="email" type="email" className="bg-white border-[#2DD4BF]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-gray-800">Subject</Label>
                <Select>
                  <SelectTrigger id="subject" className="bg-white border-[#2DD4BF]">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="account">Account Issues</SelectItem>
                    <SelectItem value="billing">Billing Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-800">Description</Label>
                <Textarea id="description" rows={4} className="bg-white border-[#2DD4BF]" />
              </div>
              
              <Button type="submit" className="w-full bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-white">Submit</Button>
            </form>
          </CardContent>
        </Card>

        {/* Alternative Contact Methods */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Other Ways to Connect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-4 border rounded-lg border-[#2DD4BF]">
                <Mail className="h-6 w-6 text-[#2DD4BF] mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Email Support</h3>
                  <p className="text-sm text-gray-700">support@example.com</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 border rounded-lg border-[#2DD4BF]">
                <Users className="h-6 w-6 text-[#2DD4BF] mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Community Forum</h3>
                  <p className="text-sm text-gray-700">Join the discussion</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Separator className="mb-4" />
            <div className="text-center w-full">
              <p className="font-medium text-gray-800 mb-2">Was this helpful?</p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm" className="border-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-white">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Yes
                </Button>
                <Button variant="outline" size="sm" className="border-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-white">
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  No
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SupportServices;
