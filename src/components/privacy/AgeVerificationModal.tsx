
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle } from "lucide-react";

interface AgeVerificationProps {
  open: boolean;
  onConfirm: (isAdult: boolean) => void;
}

export function AgeVerificationModal({ open, onConfirm }: AgeVerificationProps) {
  const [age, setAge] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAge(value);
    
    if (parseInt(value, 10) > 0) {
      setError(null);
    }
  };

  const handleSubmit = () => {
    const ageNum = parseInt(age, 10);
    
    if (!age || isNaN(ageNum) || ageNum <= 0) {
      setError("Please enter a valid age");
      return;
    }
    
    if (ageNum < 18) {
      setError("You must be at least 18 years old to use this app");
      return;
    }
    
    onConfirm(ageNum >= 18);
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
            You must be at least 18 years old to use this app. Please verify your age to continue.
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
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="text-red-300 text-sm">{error}</div>
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
