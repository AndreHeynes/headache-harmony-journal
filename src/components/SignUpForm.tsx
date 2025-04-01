
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import { AgeVerificationModal } from "./privacy/AgeVerificationModal";

export function SignUpForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToDataProcessing, setAgreedToDataProcessing] = useState(false);
  const [agreedToNewsletters, setAgreedToNewsletters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [isOver16, setIsOver16] = useState<boolean | null>(null);
  const [hasParentalConsent, setHasParentalConsent] = useState(false);

  useEffect(() => {
    // Check if we need to show age verification
    const ageVerified = localStorage.getItem('age-verified');
    if (!ageVerified) {
      // Show age verification after a short delay
      const timer = setTimeout(() => {
        setShowAgeVerification(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Load stored age verification status
      const ageData = JSON.parse(ageVerified);
      setIsOver16(ageData.isOver16);
      setHasParentalConsent(ageData.hasParentalConsent);
    }
  }, []);

  const handleAgeVerification = (isOver16: boolean, hasParentalConsent: boolean) => {
    setIsOver16(isOver16);
    setHasParentalConsent(hasParentalConsent);
    setShowAgeVerification(false);
    
    // Store age verification status
    localStorage.setItem('age-verified', JSON.stringify({
      isOver16,
      hasParentalConsent,
      verifiedAt: new Date().toISOString()
    }));
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (!agreedToTerms || !agreedToPrivacy || !agreedToDataProcessing) {
      toast.error("You must agree to the terms, privacy policy, and data processing");
      return;
    }
    
    if (!isOver16 && !hasParentalConsent) {
      setShowAgeVerification(true);
      return;
    }
    
    setIsLoading(true);
    
    // Store consent data
    const consentData = {
      termsAccepted: agreedToTerms,
      privacyAccepted: agreedToPrivacy,
      dataProcessingAccepted: agreedToDataProcessing,
      marketingAccepted: agreedToNewsletters,
      consentDate: new Date().toISOString()
    };
    
    localStorage.setItem('user-consent', JSON.stringify(consentData));
    localStorage.setItem('user-name', name);
    localStorage.setItem('user-email', email);

    // Simulate registration
    setTimeout(() => {
      toast.success("Account created successfully");
      setIsLoading(false);
      navigate("/profile");
    }, 1500);
  };

  return (
    <>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300">Full Name</Label>
          <div className="relative">
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
            />
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
            />
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
            />
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
            />
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          </div>
        </div>
        
        <div className="space-y-3 border border-gray-700 rounded-md p-3 bg-gray-800/50">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              className="mt-1"
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-300 leading-tight"
            >
              I agree to the{" "}
              <Link to="/policy?tab=terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
            </label>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="privacy" 
              checked={agreedToPrivacy}
              onCheckedChange={(checked) => setAgreedToPrivacy(checked === true)}
              className="mt-1"
            />
            <label
              htmlFor="privacy"
              className="text-sm text-gray-300 leading-tight"
            >
              I agree to the{" "}
              <Link to="/policy?tab=privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="dataProcessing" 
              checked={agreedToDataProcessing}
              onCheckedChange={(checked) => setAgreedToDataProcessing(checked === true)}
              className="mt-1"
            />
            <label
              htmlFor="dataProcessing"
              className="text-sm text-gray-300 leading-tight"
            >
              I consent to the collection and processing of my personal data, including health data related to headaches (required)
            </label>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="marketing" 
              checked={agreedToNewsletters}
              onCheckedChange={(checked) => setAgreedToNewsletters(checked === true)}
              className="mt-1"
            />
            <label
              htmlFor="marketing"
              className="text-sm text-gray-300 leading-tight"
            >
              I would like to receive newsletter, marketing communications, and updates (optional)
            </label>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !agreedToTerms || !agreedToPrivacy || !agreedToDataProcessing}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create Account
            </span>
          )}
        </Button>
      </form>
      
      <AgeVerificationModal
        open={showAgeVerification}
        onConfirm={handleAgeVerification}
      />
    </>
  );
}
