import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Trash2, Shield, History } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function DataManagementCard() {
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();

  const handleExportData = async () => {
    if (!user) {
      toast.error("Please sign in to export your data");
      return;
    }

    setIsExporting(true);
    try {
      // Fetch real headache episodes from database
      const { data: episodes, error } = await supabase
        .from('headache_episodes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Prepare export data
      const exportData = {
        exportInfo: {
          userId: user.id,
          email: user.email,
          exportedAt: new Date().toISOString(),
          totalEpisodes: episodes?.length || 0,
        },
        profile: profile || null,
        headacheEpisodes: episodes || [],
        exportMetadata: {
          version: '1.0',
          format: 'JSON',
        }
      };
      
      // Create a downloadable file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `headache-data-${user.id.slice(-8)}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Export complete", {
        description: `Exported ${episodes?.length || 0} headache episodes`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Export failed", {
        description: "Failed to export your data. Please try again."
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewExportHistory = async () => {
    if (!user) {
      toast.error("Please sign in to view export history");
      return;
    }

    // Fetch episode count as a simple history indicator
    const { count } = await supabase
      .from('headache_episodes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    toast.info(`You have ${count || 0} episodes logged`, {
      description: "Export your data to get a full backup"
    });
  };

  const handleDeleteAllData = async () => {
    if (!user) {
      toast.error("Please sign in to delete your data");
      return;
    }

    try {
      // Delete all headache episodes for this user
      const { error: episodesError } = await supabase
        .from('headache_episodes')
        .delete()
        .eq('user_id', user.id);

      if (episodesError) throw episodesError;

      // Delete health data
      const { error: healthError } = await supabase
        .from('unified_health_data')
        .delete()
        .eq('user_id', user.id);

      if (healthError) console.error('Health data deletion error:', healthError);

      // Clear local storage for this user
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith(`user_${user.id}_`) || 
        key === 'beta_token' || 
        key === 'beta_user'
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      toast.success("All data deleted", {
        description: "Your headache data has been permanently removed."
      });
      
      // Reload page to reset application state
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Delete failed", {
        description: "Failed to delete your data. Please try again."
      });
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 p-4 mb-4">
      <div className="flex items-center space-x-2 mb-2">
        <Download className="h-5 w-5 text-teal-400" />
        <h3 className="font-medium text-white">Secure Data Management</h3>
        <Shield className="h-4 w-4 text-green-400" />
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Export or delete your headache tracking data. All exports include your complete episode history.
      </p>
      
      <div className="flex flex-col space-y-3">
        <Button 
          variant="outline" 
          className="bg-teal-500/10 border-teal-500/30 text-teal-300 hover:bg-teal-500/20"
          onClick={handleExportData}
          disabled={isExporting || !user}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export My Data'}
        </Button>

        <Button 
          variant="outline" 
          className="bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
          onClick={handleViewExportHistory}
          disabled={!user}
        >
          <History className="h-4 w-4 mr-2" />
          View Data Summary
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20"
              disabled={!user}
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
                triggers, treatments, and analysis data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDeleteAllData}
              >
                Delete All My Data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {!user && (
          <p className="text-xs text-yellow-400 mt-2">
            Please sign in to manage your data
          </p>
        )}
        
        <div className="flex items-center mt-2 p-2 bg-green-500/10 rounded-md border border-green-500/20">
          <Shield className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
          <p className="text-xs text-green-300">
            Your data is encrypted and securely stored. Exports are verified against your account.
          </p>
        </div>
      </div>
    </Card>
  );
}
