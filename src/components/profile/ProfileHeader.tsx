import { Avatar } from "@/components/ui/avatar";
import { ChevronLeft, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileHeaderProps {
  onBack: () => void;
}

export function ProfileHeader({ onBack }: ProfileHeaderProps) {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Journal User';

  return (
    <>
      <header className="fixed top-0 w-full bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 z-50">
        <div className="flex items-center px-4 h-16">
          <ChevronLeft className="h-6 w-6 text-gray-400 cursor-pointer" onClick={onBack} />
          <span className="ml-2 font-semibold text-white">Settings</span>
        </div>
      </header>
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16 border border-gray-700 bg-muted flex items-center justify-center">
          <User className="h-8 w-8 text-primary" aria-hidden="true" />
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-white">{name}</h2>
          <p className="text-gray-400">{user?.email || ''}</p>
        </div>
      </div>
    </>
  );
}
