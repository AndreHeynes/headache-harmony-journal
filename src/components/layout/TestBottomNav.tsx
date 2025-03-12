
import { Link } from "react-router-dom";
import { Home, Activity, Plus, BarChart2, User, Beaker } from "lucide-react";
import { useTestContext } from "@/contexts/TestContext";

export default function TestBottomNav() {
  const { isTestMode } = useTestContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 h-16 flex items-center justify-around">
      <Link
        to="/dashboard"
        className="flex flex-col items-center justify-center text-gray-400 hover:text-white w-1/5"
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link
        to="/log"
        className="flex flex-col items-center justify-center text-gray-400 hover:text-white w-1/5"
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
        className="flex flex-col items-center justify-center text-gray-400 hover:text-white w-1/5"
      >
        <BarChart2 className="h-5 w-5" />
        <span className="text-xs mt-1">Analysis</span>
      </Link>
      
      {isTestMode ? (
        <Link
          to="/test-dashboard"
          className="flex flex-col items-center justify-center text-purple-400 hover:text-purple-300 w-1/5"
        >
          <Beaker className="h-5 w-5" />
          <span className="text-xs mt-1">Test</span>
        </Link>
      ) : (
        <Link
          to="/profile"
          className="flex flex-col items-center justify-center text-gray-400 hover:text-white w-1/5"
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      )}
    </div>
  );
}
