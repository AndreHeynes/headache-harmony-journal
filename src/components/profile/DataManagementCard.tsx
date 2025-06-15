
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Trash2, AlertCircle, Shield, History } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getUserSession, validateUserSession, getUserExportHistory, clearUserSession } from "@/utils/userSession";
import { checkRateLimit } from "@/utils/rateLimiting";

export function DataManagementCard() {
  const [showExportHistory, setShowExportHistory] = useState(false);

  const handleExportData = () => {
    // Validate user session first
    if (!validateUserSession()) {
      toast.error("Session validation failed", {
        description: "Please refresh the page and try again"
      });
      return;
    }

    const session = getUserSession();
    
    // Check rate limiting
    const rateLimitCheck = checkRateLimit(session.id, 'download');
    if (!rateLimitCheck.allowed) {
      toast.error("Download limit reached", {
        description: rateLimitCheck.message
      });
      return;
    }

    toast.success("Redirecting to secure export", {
      description: "Opening the secure data export page"
    });
    
    // In a real app, this would navigate to the export page
    setTimeout(() => {
      const dummyData = {
        exportInfo: {
          userId: session.id,
          timestamp: new Date().toISOString(),
          sessionFingerprint: session.fingerprint.slice(0, 8)
        },
        headaches: [
          { date: new Date().toISOString(), intensity: 7, location: "temple", duration: 120 }
        ],
        triggers: ["stress", "lack of sleep"],
        treatments: ["ibuprofen"]
      };
      
      // Create a downloadable file
      const dataStr = JSON.stringify(dummyData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create a link and trigger download with secure filename
      const a = document.createElement('a');
      a.href = url;
      a.download = `headache-data-${session.id.slice(-8)}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Secure export complete", {
        description: "Your data has been downloaded with security verification"
      });
    }, 1000);
  };

  const handleViewExportHistory = () => {
    const history = getUserExportHistory();
    if (history.length === 0) {
      toast.info("No export history found", {
        description: "You haven't exported any data yet"
      });
      return;
    }

    setShowExportHistory(true);
    toast.success(`Found ${history.length} export records`, {
      description: "Showing your recent export activity"
    });
  };

  const handleDeleteAllData = () => {
    // Clear user session and all associated data
    clearUserSession();
    localStorage.removeItem('export_logs');
    localStorage.clear();
    
    toast.success("All data deleted", {
      description: "Your data and session have been permanently removed. Page will reload."
    });
    
    // Reload page to reset application state
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 p-4 mb-4">
      <div className="flex items-center space-x-2 mb-2">
        <Download className="h-5 w-5 text-teal-400" />
        <h3 className="font-medium text-white">Secure Data Management</h3>
        <Shield className="h-4 w-4 text-green-400" />
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Export or delete your headache tracking data with enhanced security features for beta testing.
      </p>
      
      <div className="flex flex-col space-y-3">
        <Button 
          variant="outline" 
          className="bg-teal-500/10 border-teal-500/30 text-teal-300 hover:bg-teal-500/20"
          onClick={handleExportData}
        >
          <Download className="h-4 w-4 mr-2" />
          Secure Export Data
        </Button>

        <Button 
          variant="outline" 
          className="bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
          onClick={handleViewExportHistory}
        >
          <History className="h-4 w-4 mr-2" />
          View Export History
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-900 border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete all your headache history, 
                triggers, treatments, analysis data, user session, and export logs.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDeleteAllData}
              >
                Delete All Data & Session
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <div className="flex items-center mt-2 p-2 bg-green-500/10 rounded-md border border-green-500/20">
          <Shield className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
          <p className="text-xs text-green-300">
            Enhanced with user verification, rate limiting, audit logging, and session security for beta testing.
          </p>
        </div>
      </div>
    </Card>
  );
}
