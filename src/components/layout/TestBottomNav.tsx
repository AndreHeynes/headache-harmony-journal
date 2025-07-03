
import { Link, useLocation } from "react-router-dom";
import { Home, Activity, Plus, BarChart2, User, Beaker } from "lucide-react";
import { useTestContext } from "@/contexts/TestContext";

export default function TestBottomNav() {
  const { isTestMode } = useTestContext();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 h-16 flex items-center justify-around">
      <Link
        to="/dashboard"
        className={`flex flex-col items-center justify-center w-1/5 ${
          isActive('/dashboard') ? 'text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link
        to="/log"
        className={`flex flex-col items-center justify-center w-1/5 ${
          isActive('/log') ? 'text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        <Activity className="h-5 w-5" />
        <span className="text-xs mt-1">Log</span>
      </Link>
      
      <Link
        to="/log"
        className="flex flex-col items-center justify-center -mt-8 bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full w-14 h-14 shadow-lg border-4 border-gray-900"
      >
        <Plus className="h-6 w-6" />
      </Link>
      
      <Link
        to="/analysis"
        className={`flex flex-col items-center justify-center w-1/5 ${
          isActive('/analysis') ? 'text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        <BarChart2 className="h-5 w-5" />
        <span className="text-xs mt-1">Analysis</span>
      </Link>
      
      {isTestMode ? (
        <Link
          to="/test-dashboard"
          className={`flex flex-col items-center justify-center w-1/5 relative ${
            isActive('/test-dashboard') ? 'text-purple-300' : 'text-purple-400 hover:text-purple-300'
          }`}
        >
          <Beaker className="h-5 w-5" />
          <span className="text-xs mt-1">Test</span>
          {/* Active indicator dot */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        </Link>
      ) : (
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center w-1/5 ${
            isActive('/profile') ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      )}
    </div>
  );
}
