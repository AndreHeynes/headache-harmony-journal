
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
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

export function DataManagementCard() {
  const handleExportData = () => {
    // In a real app, this would trigger a data export process
    toast.success("Data export initiated", {
      description: "Your data is being prepared for download"
    });
    
    // Simulate export completion after 2 seconds
    setTimeout(() => {
      const dummyData = {
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
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'headache-harmony-data.json';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Data export complete", {
        description: "Your data has been downloaded"
      });
    }, 2000);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 p-4 mb-4">
      <div className="flex items-center space-x-2 mb-2">
        <Download className="h-5 w-5 text-teal-400" />
        <h3 className="font-medium text-white">Data Management</h3>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Export or delete your headache tracking data. Exported data can be shared with your healthcare provider.
      </p>
      
      <div className="flex flex-col space-y-3">
        <Button 
          variant="outline" 
          className="bg-teal-500/10 border-teal-500/30 text-teal-300 hover:bg-teal-500/20"
          onClick={handleExportData}
        >
          <Download className="h-4 w-4 mr-2" />
          Export My Data
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete My Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-900 border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete all your headache history, 
                triggers, treatments, and analysis data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  toast.success("Data deletion initiated", {
                    description: "All your data will be permanently removed"
                  });
                }}
              >
                Delete All Data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <div className="flex items-center mt-2 p-2 bg-amber-500/10 rounded-md border border-amber-500/20">
          <AlertCircle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
          <p className="text-xs text-amber-300">
            Data export includes all your headache entries, triggers, treatments, and analysis insights.
          </p>
        </div>
      </div>
    </Card>
  );
}
