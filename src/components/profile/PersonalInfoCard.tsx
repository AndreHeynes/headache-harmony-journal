import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff, Save, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function PersonalInfoCard() {
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [hasConsented, setHasConsented] = useState(false);
  const [showAgeField, setShowAgeField] = useState(false);
  const [ageConsent, setAgeConsent] = useState(false);
  const [isOver16, setIsOver16] = useState(false);
  const [showParentalConsent, setShowParentalConsent] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  // Get user-scoped storage key
  const getStorageKey = (key: string) => {
    return user ? `user_${user.id}_${key}` : key;
  };

  // Check if we have stored preferences
  useEffect(() => {
    const loadUserData = async () => {
      // Load from localStorage (user-scoped)
      const savedConsent = localStorage.getItem(getStorageKey('data-consent'));
      if (savedConsent) {
        setHasConsented(JSON.parse(savedConsent));
      }
      
      const savedGender = localStorage.getItem(getStorageKey('gender'));
      if (savedGender) {
        setGender(savedGender);
      }
      
      const savedAge = localStorage.getItem(getStorageKey('age'));
      if (savedAge) {
        setAge(savedAge);
        const ageNum = parseInt(savedAge, 10);
        setIsOver16(ageNum >= 16);
        setShowParentalConsent(ageNum > 0 && ageNum < 16);
      }

      // Load name from profile if user is authenticated
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.full_name) {
          setName(profile.full_name);
        }
      }
    };

    loadUserData();
  }, [user]);

  const handleAgeChange = (value: string) => {
    setAge(value);
    const ageNum = parseInt(value, 10);
    
    if (ageNum > 0) {
      setIsOver16(ageNum >= 16);
      setShowParentalConsent(ageNum < 16);
    } else {
      setShowParentalConsent(false);
    }
  };

  const handleSaveInfo = async () => {
    // Validate consent requirements
    if (!hasConsented) {
      toast.error("You must consent to data processing to save your information");
      return;
    }
    
    // Check if age is provided and user is under 16
    if (age && parseInt(age, 10) < 16 && !parentalConsent) {
      toast.error("Parental consent is required for users under 16");
      return;
    }

    setIsSaving(true);
    
    try {
      // Save to localStorage (user-scoped)
      localStorage.setItem(getStorageKey('data-consent'), JSON.stringify(hasConsented));
      localStorage.setItem(getStorageKey('gender'), gender);
      
      if (age) {
        localStorage.setItem(getStorageKey('age'), age);
        localStorage.setItem(getStorageKey('age-consent'), JSON.stringify(ageConsent));
      }
      
      if (showParentalConsent) {
        localStorage.setItem(getStorageKey('parental-consent'), JSON.stringify(parentalConsent));
      }

      // Update profile in database if user is authenticated
      if (user && name) {
        const { error } = await supabase
          .from('profiles')
          .update({ full_name: name })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating profile:', error);
          throw error;
        }
      }
      
      toast.success("Personal information saved", {
        description: "Your information has been updated successfully"
      });
    } catch (error) {
      console.error('Save error:', error);
      toast.error("Failed to save", {
        description: "Please try again"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Personal Information</h3>
          <User className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Display Name</Label>
            <Input 
              placeholder="Enter your name" 
              className="mt-1 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Age</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAgeField(!showAgeField)}
                className="h-8 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                {showAgeField ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
            
            {showAgeField && (
              <Input 
                type="number" 
                className="mt-1 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500" 
                value={age}
                onChange={(e) => handleAgeChange(e.target.value)}
                min="0"
                max="120"
              />
            )}
            
            {showAgeField && (
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="ageConsent"
                  checked={ageConsent} 
                  onCheckedChange={(checked) => setAgeConsent(checked === true)}
                />
                <label 
                  htmlFor="ageConsent" 
                  className="text-sm text-gray-400"
                >
                  I consent to sharing my age data for personalized insights
                </label>
              </div>
            )}
          </div>

          <div>
            <Label className="text-gray-300">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="mt-1 bg-gray-900/50 border-gray-700 text-white">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Parental consent for users under 16 */}
          {showParentalConsent && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
              <h4 className="text-yellow-300 font-medium mb-2">Parental Consent Required</h4>
              <p className="text-sm text-gray-300 mb-3">
                For users under 16 years of age, we require parental/guardian consent to collect and process personal information,
                in compliance with GDPR and COPPA regulations.
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="parentalConsent"
                  checked={parentalConsent} 
                  onCheckedChange={(checked) => setParentalConsent(checked === true)}
                />
                <label 
                  htmlFor="parentalConsent" 
                  className="text-sm text-gray-300"
                >
                  I confirm I am a parent/guardian and I consent to the collection and processing of my child's personal information
                </label>
              </div>
            </div>
          )}
          
          {/* Data processing consent - required by GDPR */}
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="consent" 
                checked={hasConsented}
                onCheckedChange={(checked) => setHasConsented(checked === true)}
              />
              <label
                htmlFor="consent"
                className="text-sm text-gray-300"
              >
                I consent to the processing of my personal information as described in the{" "}
                <a href="/policy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>
          
          <Button 
            onClick={handleSaveInfo} 
            className="w-full bg-primary hover:bg-primary/90 text-black"
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
