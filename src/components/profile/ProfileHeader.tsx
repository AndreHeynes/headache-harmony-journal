
import { Avatar } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";

interface ProfileHeaderProps {
  onBack: () => void;
}

export function ProfileHeader({ onBack }: ProfileHeaderProps) {
  return (
    <>
      {/* Header */}
      <header className="fixed top-0 w-full bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 z-50">
        <div className="flex items-center px-4 h-16">
          <ChevronLeft className="h-6 w-6 text-gray-400 cursor-pointer" onClick={onBack} />
          <span className="ml-2 font-semibold text-white">Settings</span>
        </div>
      </header>

      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16 border border-gray-700">
          <img src="https://github.com/shadcn.png" alt="User" />
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-white">John Doe</h2>
          <p className="text-gray-400">johndoe@example.com</p>
        </div>
      </div>
    </>
  );
}
