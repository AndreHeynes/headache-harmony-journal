
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle } from "lucide-react";

interface AgeVerificationProps {
  open: boolean;
  onConfirm: (isOver16: boolean, hasParentalConsent: boolean) => void;
}

export function AgeVerificationModal({ open, onConfirm }: AgeVerificationProps) {
  const [age, setAge] = useState<string>("");
  const [hasParentalConsent, setHasParentalConsent] = useState(false);
  const [showParentalConsent, setShowParentalConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAge(value);
    
    const ageNum = parseInt(value, 10);
    if (!isNaN(ageNum) && ageNum > 0) {
      setShowParentalConsent(ageNum < 16);
      setError(null);
    }
  };

  const handleSubmit = () => {
    const ageNum = parseInt(age, 10);
    
    if (!age || isNaN(ageNum) || ageNum <= 0) {
      setError("Please enter a valid age");
      return;
    }
    
    if (ageNum < 16 && !hasParentalConsent) {
      setError("Parental consent is required for users under 16");
      return;
    }
    
    onConfirm(ageNum >= 16, hasParentalConsent);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
        <DialogHeader className="space-y-3">
          <div className="mx-auto bg-indigo-900/30 p-3 rounded-full">
            <Shield className="h-6 w-6 text-indigo-400" />
          </div>
          <DialogTitle className="text-center text-white">Age Verification</DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            To comply with privacy regulations, we need to verify your age before you continue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="age" className="text-gray-300">How old are you?</Label>
            <Input
              id="age"
              type="number"
              min="1"
              max="120"
              value={age}
              onChange={handleAgeChange}
              placeholder="Enter your age"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          {showParentalConsent && (
            <div className="space-y-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-yellow-300 font-medium">Parental Consent Required</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Users under 16 years old need parental or guardian consent to use this app.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="parentalConsent" 
                  checked={hasParentalConsent}
                  onCheckedChange={(checked) => setHasParentalConsent(checked === true)}
                />
                <label
                  htmlFor="parentalConsent"
                  className="text-sm text-gray-300"
                >
                  I confirm I am a parent/guardian and I consent to my child using this app
                </label>
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-md text-red-300 text-sm">
              {error}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-primary hover:bg-primary/90 text-black"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
