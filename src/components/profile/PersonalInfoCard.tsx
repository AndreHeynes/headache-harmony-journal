import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

function calculateAge(dob: string): number {
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

export function PersonalInfoCard() {
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [hasConsented, setHasConsented] = useState(false);
  const [showParentalConsent, setShowParentalConsent] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const getStorageKey = (key: string) => user ? `user_${user.id}_${key}` : key;

  useEffect(() => {
    const loadUserData = async () => {
      const savedConsent = localStorage.getItem(getStorageKey('data-consent'));
      if (savedConsent) setHasConsented(JSON.parse(savedConsent));

      const savedGender = localStorage.getItem(getStorageKey('gender'));
      if (savedGender) setGender(savedGender);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, date_of_birth')
          .eq('id', user.id)
          .single();

        if (profile?.full_name) setName(profile.full_name);
        if (profile?.date_of_birth) {
          setDateOfBirth(profile.date_of_birth);
          const age = calculateAge(profile.date_of_birth);
          setShowParentalConsent(age < 16);
        }
      }
    };
    loadUserData();
  }, [user]);

  const handleDobChange = (value: string) => {
    setDateOfBirth(value);
    if (value) {
      const age = calculateAge(value);
      setShowParentalConsent(age < 16);
    } else {
      setShowParentalConsent(false);
    }
  };

  const handleSaveInfo = async () => {
    if (!hasConsented) {
      toast.error("You must consent to data processing to save your information");
      return;
    }

    if (dateOfBirth) {
      const age = calculateAge(dateOfBirth);
      if (age < 16 && !parentalConsent) {
        toast.error("Parental consent is required for users under 16");
        return;
      }
    }

    setIsSaving(true);

    try {
      localStorage.setItem(getStorageKey('data-consent'), JSON.stringify(hasConsented));
      localStorage.setItem(getStorageKey('gender'), gender);

      if (showParentalConsent) {
        localStorage.setItem(getStorageKey('parental-consent'), JSON.stringify(parentalConsent));
      }

      if (user) {
        const updates: Record<string, unknown> = {};
        if (name) updates.full_name = name;
        if (dateOfBirth) updates.date_of_birth = dateOfBirth;

        if (Object.keys(updates).length > 0) {
          const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
          if (error) throw error;
        }
      }

      toast.success("Personal information saved", {
        description: "Your information has been updated successfully"
      });
    } catch (error) {
      console.error('Save error:', error);
      toast.error("Failed to save", { description: "Please try again" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-card/50 border-border backdrop-blur-sm">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
          <User className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Display Name</Label>
            <Input
              placeholder="Enter your name"
              className="mt-1 bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-muted-foreground">Date of Birth</Label>
            <Input
              type="date"
              className="mt-1 bg-background/50 border-border text-foreground"
              value={dateOfBirth}
              onChange={(e) => handleDobChange(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used for clinical red flag detection (e.g. SNOOP criteria). Your date of birth is stored securely and never shared.
            </p>
          </div>

          <div>
            <Label className="text-muted-foreground">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="mt-1 bg-background/50 border-border text-foreground">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showParentalConsent && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
              <h4 className="text-amber-400 font-medium mb-2">Parental Consent Required</h4>
              <p className="text-sm text-muted-foreground mb-3">
                For users under 16 years of age, we require parental/guardian consent to collect and process personal information,
                in compliance with GDPR and COPPA regulations.
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parentalConsent"
                  checked={parentalConsent}
                  onCheckedChange={(checked) => setParentalConsent(checked === true)}
                />
                <label htmlFor="parentalConsent" className="text-sm text-muted-foreground">
                  I confirm I am a parent/guardian and I consent to the collection and processing of my child's personal information
                </label>
              </div>
            </div>
          )}

          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={hasConsented}
                onCheckedChange={(checked) => setHasConsented(checked === true)}
              />
              <label htmlFor="consent" className="text-sm text-muted-foreground">
                I consent to the processing of my personal information as described in the{" "}
                <a href="/policy" className="text-primary hover:underline">Privacy Policy</a>
              </label>
            </div>
          </div>

          <Button
            onClick={handleSaveInfo}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!hasConsented || isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Information'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
