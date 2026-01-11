import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";
import { AgeVerificationModal } from "./privacy/AgeVerificationModal";
import { secureSetItem } from "@/utils/secureStorage";
import { getCSRFToken } from "@/utils/csrfProtection";
import { FormField } from "./signup/FormField";
import { PasswordStrengthIndicator } from "./signup/PasswordStrengthIndicator";
import { ConsentSection } from "./signup/ConsentSection";
import { SubmitButton } from "./signup/SubmitButton";
import { useAuth } from "@/contexts/AuthContext";

// Zod schema for sign-up validation
const signUpSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Password strength calculation
function getPasswordStrength(password: string): { score: number; feedback: string } {
  let score = 0;
  let feedback = '';

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) feedback = 'Weak password';
  else if (score <= 4) feedback = 'Moderate password';
  else feedback = 'Strong password';

  return { score: Math.min(score, 5), feedback };
}

export function SignUpForm() {
  const { signUp } = useAuth();
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

  const validateForm = (): boolean => {
    const result = signUpSchema.safeParse({ name, email, password, confirmPassword });
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof typeof errors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form with Zod
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
    
    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    
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

    // Call real Supabase auth
    const { error } = await signUp(sanitizedEmail, password, sanitizedName);
    
    if (error) {
      console.error("Sign up error:", error);
      if (error.message.includes("User already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else if (error.message.includes("Password")) {
        toast.error("Password does not meet requirements. Please use a stronger password.");
      } else {
        toast.error(error.message || "Failed to create account. Please try again.");
      }
      setIsLoading(false);
      return;
    }
    
    toast.success("Account created successfully! Please check your email to verify your account.");
    setIsLoading(false);
    navigate("/");
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
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
          icon={<User />}
        />

        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          icon={<Mail />}
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
          }}
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
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
          }}
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
