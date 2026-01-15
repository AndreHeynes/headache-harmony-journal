import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_CONFIG } from "@/config/appConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const { user, signInWithMagicLink } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showMagicLink, setShowMagicLink] = useState(APP_CONFIG.BETA_MODE && mode === 'signin');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setIsSending(true);
    const { error } = await signInWithMagicLink(email.trim());
    setIsSending(false);

    if (error) {
      toast.error(error);
    } else {
      setEmailSent(true);
      toast.success('Magic link sent! Check your email.');
    }
  };

  // Beta mode magic link sign-in
  if (showMagicLink) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-border">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <img 
                  src="/lovable-uploads/78336bbf-2702-4d43-abaa-d5f6e646d8b4.png" 
                  alt="My Headache Experience Journal" 
                  className="h-16 w-16 rounded-full"
                />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                {emailSent 
                  ? "Check your email for the sign-in link" 
                  : "Enter the email you used to register for beta access"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emailSent ? (
                <div className="text-center space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                  <p className="text-muted-foreground">
                    We've sent a magic link to <strong>{email}</strong>. Click the link in your email to sign in.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setEmailSent(false)}
                    className="w-full"
                  >
                    Send to a different email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSending}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Magic Link
                      </>
                    )}
                  </Button>
                </form>
              )}
              
              <div className="mt-6 pt-6 border-t border-border">
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setShowMagicLink(false)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to password sign-in
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SignIn />
            {APP_CONFIG.BETA_MODE && (
              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  onClick={() => setShowMagicLink(true)}
                  className="text-sm text-muted-foreground"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Sign in with magic link instead
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="signup">
            <SignUp />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
