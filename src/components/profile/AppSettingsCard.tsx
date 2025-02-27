
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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

  return (
    <Card className="bg-white/5 border-white/10">
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold text-white">App Settings</h3>
        
        <div className="space-y-3">
          <div>
            <Label className="text-white/60">Language</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white/60">Country</Label>
            <Select value={userCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-sm text-white/60">
              Your country selection affects which privacy policies and regulations apply to your account
              <button 
                className="ml-1 text-sm underline text-white/80 hover:text-white" 
                onClick={onViewPolicies}
              >
                View policies
              </button>
            </p>
          </div>

          <div>
            <Label className="text-white/60">Time Zone</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC-05:00 Eastern Time</SelectItem>
                <SelectItem value="pst">UTC-08:00 Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white/60">Date Format</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
