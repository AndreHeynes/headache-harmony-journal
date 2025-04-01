
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Cookie, Settings, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type CookieSettings = {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsentBanner() {
  const [open, setOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    necessary: true, // Always required
    preferences: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const settings = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    };
    saveCookieSettings(settings);
  };

  const handleAcceptSelected = () => {
    saveCookieSettings(cookieSettings);
  };

  const saveCookieSettings = (settings: CookieSettings) => {
    // Save settings to localStorage
    localStorage.setItem('cookie-consent', JSON.stringify(settings));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowSettingsDialog(false);
    
    // Apply cookie settings logic here
    console.log('Cookie settings saved:', settings);
  };

  const handleOpenSettings = () => {
    setShowBanner(false);
    setShowSettingsDialog(true);
  };

  return (
    <>
      {/* Main Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 z-50 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Cookie className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-white mb-1">We Value Your Privacy</h3>
                  <p className="text-sm text-gray-300">
                    This site uses cookies to enhance your experience, analyze site usage, and assist with our marketing efforts. 
                    By clicking "Accept All", you consent to our use of cookies or click "Cookie Settings" to choose your preferences.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 flex-col sm:flex-row">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleOpenSettings}
                  className="whitespace-nowrap bg-transparent border-gray-600 hover:bg-gray-700 text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Cookie Settings
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAcceptAll}
                  className="whitespace-nowrap bg-primary hover:bg-primary/90 text-black"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Cookie className="h-5 w-5" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Manage your cookie preferences for this site
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="necessary" className="mt-4">
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="necessary">Necessary</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="necessary" className="border border-gray-700 rounded-md p-4 mt-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-white font-medium">Necessary Cookies</h4>
                  <p className="text-gray-400 text-sm">Required for the website to function properly</p>
                </div>
                <Switch disabled checked id="necessary" />
              </div>
              <p className="text-sm text-gray-300 mt-2">
                These cookies are essential for the website to function properly and cannot be disabled.
                They include cookies for security, authentication, and remembering your preferences.
              </p>
            </TabsContent>
            
            <TabsContent value="preferences" className="border border-gray-700 rounded-md p-4 mt-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-white font-medium">Preference Cookies</h4>
                  <p className="text-gray-400 text-sm">Remember your settings and preferences</p>
                </div>
                <Switch 
                  id="preferences" 
                  checked={cookieSettings.preferences}
                  onCheckedChange={(checked) => 
                    setCookieSettings({...cookieSettings, preferences: checked})}
                />
              </div>
              <p className="text-sm text-gray-300 mt-2">
                These cookies allow the website to remember choices you make and provide enhanced, 
                personalized features, such as your language preferences and display settings.
              </p>
            </TabsContent>
            
            <TabsContent value="analytics" className="border border-gray-700 rounded-md p-4 mt-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-white font-medium">Analytics Cookies</h4>
                  <p className="text-gray-400 text-sm">Help us understand how you use our site</p>
                </div>
                <Switch 
                  id="analytics" 
                  checked={cookieSettings.analytics}
                  onCheckedChange={(checked) => 
                    setCookieSettings({...cookieSettings, analytics: checked})}
                />
              </div>
              <p className="text-sm text-gray-300 mt-2">
                These cookies collect information about how you use our website, which pages you 
                visited and which links you clicked on. All of the data is anonymized and cannot 
                be used to identify you.
              </p>
            </TabsContent>
            
            <TabsContent value="marketing" className="border border-gray-700 rounded-md p-4 mt-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-white font-medium">Marketing Cookies</h4>
                  <p className="text-gray-400 text-sm">Used for advertising and personalized content</p>
                </div>
                <Switch 
                  id="marketing" 
                  checked={cookieSettings.marketing}
                  onCheckedChange={(checked) => 
                    setCookieSettings({...cookieSettings, marketing: checked})}
                />
              </div>
              <p className="text-sm text-gray-300 mt-2">
                These cookies may be set through our site by our advertising partners. They may 
                be used by those companies to build a profile of your interests and show you 
                relevant ads on other sites.
              </p>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSettingsDialog(false)}
              className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleAcceptSelected}
              className="bg-primary hover:bg-primary/90 text-black"
            >
              <Shield className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
            <Button 
              onClick={handleAcceptAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Accept All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Privacy Settings Button (always visible in the corner) */}
      {!showBanner && !showSettingsDialog && (
        <div className="fixed bottom-4 left-4 z-40">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSettingsDialog(true)}
            className="rounded-full h-10 w-10 p-0 bg-gray-800/80 backdrop-blur-sm border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700"
            title="Privacy Settings"
          >
            <Cookie className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  );
}
