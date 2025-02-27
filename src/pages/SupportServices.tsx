
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
    
    // In a real app, you would check if the content is complete
    setIsContentComplete(false);
  }, []);

  const content = countrySpecificContent[userCountry] || countrySpecificContent['default'];

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header with Title and Admin Notice */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Support Center</h1>
          
          {!isContentComplete && (
            <Alert variant="destructive" className="w-auto inline-flex ml-4 p-2 h-10">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="ml-2">Admin Notice</AlertTitle>
            </Alert>
          )}
        </div>
        
        {/* Country-specific Alert */}
        <Alert className="bg-primary/10 border-primary text-primary">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The information shown below is specific to {userCountry === 'default' ? 'general international guidelines' : userCountry}. You can change your country in your profile settings.
          </AlertDescription>
        </Alert>

        {/* Search Section */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            type="text" 
            placeholder="Search for help..." 
            className="pl-10 bg-background border-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <CircleHelp className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold">FAQs</h3>
              <p className="text-sm text-muted-foreground">Common questions</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Book className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-semibold">User Guide</h3>
              <p className="text-sm text-muted-foreground">How-to guides</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Headphones className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-semibold">Contact</h3>
              <p className="text-sm text-muted-foreground">Get help</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Flag className="h-8 w-8 text-primary-dark mb-3" />
              <h3 className="font-semibold">Report</h3>
              <p className="text-sm text-muted-foreground">Report an issue</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="hotlines">Emergency Hotlines</TabsTrigger>
            <TabsTrigger value="clinics">Specialized Clinics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Online Resources</CardTitle>
                <CardDescription>
                  These organizations provide valuable information and resources for headache sufferers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.resources.map((resource, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-card/30">
                      <h3 className="text-lg font-medium">{resource.name}</h3>
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
          
          <TabsContent value="hotlines">
            <Card>
              <CardHeader>
                <CardTitle>Emergency & Support Hotlines</CardTitle>
                <CardDescription>
                  These hotlines can provide immediate assistance and information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.hotlines.map((hotline, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-card/30">
                      <h3 className="text-lg font-medium">{hotline.name}</h3>
                      <p className="text-xl font-bold text-primary mt-2">{hotline.number}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clinics">
            <Card>
              <CardHeader>
                <CardTitle>Specialized Headache Clinics</CardTitle>
                <CardDescription>
                  Finding specialized care for chronic or severe headaches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-card/30">
                  <p>{content.clinics}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Fill out this form and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger id="subject">
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
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} />
              </div>
              
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </CardContent>
        </Card>

        {/* Alternative Contact Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Other Ways to Connect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-4 border rounded-lg">
                <Mail className="h-6 w-6 text-primary mr-3" />
                <div>
                  <h3 className="font-medium">Email Support</h3>
                  <p className="text-sm text-muted-foreground">support@example.com</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 border rounded-lg">
                <Users className="h-6 w-6 text-secondary mr-3" />
                <div>
                  <h3 className="font-medium">Community Forum</h3>
                  <p className="text-sm text-muted-foreground">Join the discussion</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Separator className="mb-4" />
            <div className="text-center w-full">
              <p className="font-medium mb-2">Was this helpful?</p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Yes
                </Button>
                <Button variant="outline" size="sm">
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  No
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SupportServices;
