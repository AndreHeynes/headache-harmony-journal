
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AppSettingsCardProps {
  userCountry: string;
  onCountryChange: (value: string) => void;
  onViewPolicies: () => void;
}

export function AppSettingsCard({ userCountry, onCountryChange, onViewPolicies }: AppSettingsCardProps) {
  const handleCountryChange = (value: string) => {
    onCountryChange(value);
    toast.success(`Country preference updated to ${value}`);
  };

  const handleDataExport = () => {
    // In a real app, this would trigger the data export process
    toast.success("Your data is being prepared for download", {
      description: "You'll receive a notification when it's ready"
    });
  };

  const handleDataDelete = () => {
    // In a real app, this would show a confirmation dialog first
    toast.info("Data deletion", { 
      description: "Please confirm this action in the email we've sent you" 
    });
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold text-white">App Settings</h3>
        
        <div className="space-y-3">
          <div>
            <Label className="text-gray-300">Language</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-gray-900/50 border-gray-700 text-white">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Country</Label>
            <Select value={userCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="mt-1 bg-gray-900/50 border-gray-700 text-white">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-sm text-gray-400">
              Your country selection affects which privacy policies and regulations apply to your account
              <button 
                className="ml-1 text-sm underline text-primary hover:text-primary-dark" 
                onClick={onViewPolicies}
              >
                View policies
              </button>
            </p>
          </div>

          <div>
            <Label className="text-gray-300">Time Zone</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-gray-900/50 border-gray-700 text-white">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="utc">UTC-05:00 Eastern Time</SelectItem>
                <SelectItem value="pst">UTC-08:00 Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Date Format</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-gray-900/50 border-gray-700 text-white">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-2 border-t border-gray-700">
            <h4 className="text-white font-medium mb-3">Data Management</h4>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="justify-start bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                onClick={handleDataExport}
              >
                <Download className="mr-2 h-4 w-4" />
                Export My Data
                <span className="text-xs text-gray-400 ml-auto">CSV, JSON</span>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                onClick={handleDataDelete}
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-400" />
                Delete All My Data
                <span className="text-xs text-gray-400 ml-auto">Permanent</span>
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              You can export your data anytime or permanently delete all your information from our servers
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
