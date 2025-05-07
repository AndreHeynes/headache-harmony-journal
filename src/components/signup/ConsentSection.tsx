
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

interface ConsentSectionProps {
  agreedToTerms: boolean;
  setAgreedToTerms: (value: boolean) => void;
  agreedToPrivacy: boolean;
  setAgreedToPrivacy: (value: boolean) => void;
  agreedToDataProcessing: boolean;
  setAgreedToDataProcessing: (value: boolean) => void;
  agreedToNewsletters: boolean;
  setAgreedToNewsletters: (value: boolean) => void;
}

export function ConsentSection({
  agreedToTerms,
  setAgreedToTerms,
  agreedToPrivacy,
  setAgreedToPrivacy,
  agreedToDataProcessing,
  setAgreedToDataProcessing,
  agreedToNewsletters,
  setAgreedToNewsletters
}: ConsentSectionProps) {
  return (
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
  );
}
