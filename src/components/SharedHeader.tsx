import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG } from '@/config/appConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const SharedHeader = () => {
  const { user, betaUser, signOut, justAuthenticated } = useAuth();
  
  // Use betaUser for display, fall back to Supabase user
  const displayName = betaUser?.full_name || user?.user_metadata?.full_name || 'User';
  const displayEmail = betaUser?.email || user?.email;
  const isLoggedIn = !!user || !!betaUser;

  // Show welcome toast on first authentication
  useEffect(() => {
    if (justAuthenticated && displayEmail) {
      toast.success(`Welcome! You're signed in as ${displayEmail}`, {
        duration: 4000,
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
    }
  }, [justAuthenticated, displayEmail]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/78336bbf-2702-4d43-abaa-d5f6e646d8b4.png" 
            alt="My Headache Experience Journal" 
            className="h-8 w-8 rounded-full"
          />
          <span className="font-semibold text-lg hidden sm:inline">
            My Headache Experience Journal!™
          </span>
          {APP_CONFIG.BETA_MODE && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Beta
            </span>
          )}
        </div>

        {isLoggedIn && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="relative">
                  <User className="h-4 w-4" />
                  <CheckCircle2 className="h-2.5 w-2.5 text-green-500 absolute -bottom-0.5 -right-0.5" />
                </div>
                <span className="hidden sm:inline">
                  {displayName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{displayName}</p>
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">{displayEmail}</p>
                  <p className="text-xs text-green-600">Authenticated</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};
