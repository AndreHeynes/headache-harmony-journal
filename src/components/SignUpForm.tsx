
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, User, AlertCircle } from "lucide-react";
import { AgeVerificationModal } from "./privacy/AgeVerificationModal";
import { isValidEmail, isStrongPassword, getPasswordStrength, sanitizeInput } from "@/utils/validation";
import { secureSetItem } from "@/utils/secureStorage";
import { getCSRFToken } from "@/utils/csrfProtection";
import { FormField } from "./signup/FormField";
import { PasswordStrengthIndicator } from "./signup/PasswordStrengthIndicator";
import { ConsentSection } from "./signup/ConsentSection";
import { SubmitButton } from "./signup/SubmitButton";

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
  const [isAdult, setIsAdult] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string;
  }>({ score: 0, feedback: "" });

  // CSRF token for form security
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Generate CSRF token
    setCsrfToken(getCSRFToken());
    
    // Check if we need to show age verification
    const ageVerified = localStorage.getItem('age-verified');
    if (!ageVerified) {
      // Show age verification after a short delay
      const timer = setTimeout(() => {
        setShowAgeVerification(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      try {
        // Load stored age verification status
        const ageData = JSON.parse(ageVerified);
        setIsAdult(ageData.isAdult);
      } catch (error) {
        console.error("Error parsing age verification data:", error);
        // If parsing fails, show age verification again
        setShowAgeVerification(true);
      }
    }
  }, []);

  // Password strength validation
  useEffect(() => {
    if (password) {
      setPasswordStrength(getPasswordStrength(password));
    } else {
      setPasswordStrength({ score: 0, feedback: "" });
    }
  }, [password]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!isStrongPassword(password)) {
      newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, and numbers";
      isValid = false;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAgeVerification = (isAdult: boolean) => {
    setIsAdult(isAdult);
    setShowAgeVerification(false);
    
    // Store age verification status securely
    secureSetItem('age-verified', {
      isAdult,
      verifiedAt: new Date().toISOString()
    });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }
    
    if (!agreedToTerms || !agreedToPrivacy || !agreedToDataProcessing) {
      toast.error("You must agree to the terms, privacy policy, and data processing");
      return;
    }
    
    if (!isAdult) {
      setShowAgeVerification(true);
      return;
    }
    
    setIsLoading(true);
    
    // Sanitize inputs before storing
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    
    // Store consent data securely
    const consentData = {
      termsAccepted: agreedToTerms,
      privacyAccepted: agreedToPrivacy,
      dataProcessingAccepted: agreedToDataProcessing,
      marketingAccepted: agreedToNewsletters,
      consentDate: new Date().toISOString()
    };
    
    secureSetItem('user-consent', consentData);
    secureSetItem('user-name', sanitizedName);
    secureSetItem('user-email', sanitizedEmail);

    // Simulate registration (will be replaced with actual API call)
    setTimeout(() => {
      toast.success("Account created successfully");
      setIsLoading(false);
      navigate("/profile");
    }, 1500);
  };

  return (
    <>
      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Hidden CSRF token for form security */}
        <input 
          type="hidden" 
          name="csrf_token" 
          value={csrfToken}
        />

        <FormField
          id="name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          icon={<User />}
        />

        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          icon={<Mail />}
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          icon={<Lock />}
          additionalContent={password && (
            <PasswordStrengthIndicator 
              score={passwordStrength.score}
              feedback={passwordStrength.feedback}
            />
          )}
        />

        <FormField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          icon={<Lock />}
        />
        
        <ConsentSection
          agreedToTerms={agreedToTerms}
          setAgreedToTerms={setAgreedToTerms}
          agreedToPrivacy={agreedToPrivacy}
          setAgreedToPrivacy={setAgreedToPrivacy}
          agreedToDataProcessing={agreedToDataProcessing}
          setAgreedToDataProcessing={setAgreedToDataProcessing}
          agreedToNewsletters={agreedToNewsletters}
          setAgreedToNewsletters={setAgreedToNewsletters}
        />
        
        <SubmitButton 
          isLoading={isLoading} 
          disabled={!agreedToTerms || !agreedToPrivacy || !agreedToDataProcessing}
        />
      </form>
      
      <AgeVerificationModal
        open={showAgeVerification}
        onConfirm={handleAgeVerification}
      />
    </>
  );
}
