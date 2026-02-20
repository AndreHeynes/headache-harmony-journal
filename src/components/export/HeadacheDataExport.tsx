import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Share2, Lock, Shield, AlertTriangle, ShieldAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTestContext } from "@/contexts/TestContext";
import { toast } from "sonner";
import { ExportConfirmationDialog } from "./ExportConfirmationDialog";
import { getUserSession, validateUserSession, logExportActivity } from "@/utils/userSession";
import { checkRateLimit } from "@/utils/rateLimiting";
import { InlineDisclaimer } from "@/components/disclaimer";
import { getDisclaimer } from "@/utils/legalContent";
import { usePatientProfile } from "@/hooks/usePatientProfile";
import { format } from "date-fns";
import type { ExportRedFlag } from "@/hooks/useExportData";

interface HeadacheDataExportProps {
  headacheData?: HeadacheRecord[];
  redFlags?: ExportRedFlag[];
  isPremium?: boolean;
  loading?: boolean;
}

interface HeadacheRecord {
  id: string;
  date: string;
  intensity: number;
  location: string;
  duration: number;
  symptoms?: string[];
  triggers?: string[];
  treatments?: string[];
  notes?: string;
}

// Sample data for demo/testing purposes
const demoHeadacheData: HeadacheRecord[] = [
  {
    id: "h1",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    intensity: 7,
    location: "Temples, left side",
    duration: 180,
    symptoms: ["Nausea", "Light sensitivity"],
    triggers: ["Stress", "Weather change"],
    treatments: ["Ibuprofen", "Dark room"],
    notes: "Started after work meeting"
  },
  {
    id: "h2",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    intensity: 4,
    location: "Forehead",
    duration: 120,
    symptoms: ["Mild nausea"],
    triggers: ["Lack of sleep"],
    treatments: ["Acetaminophen"],
    notes: "Improved after medication"
  },
  {
    id: "h3",
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    intensity: 8,
    location: "Behind right eye",
    duration: 240,
    symptoms: ["Nausea", "Light sensitivity", "Sound sensitivity"],
    triggers: ["Alcohol", "Missed meal"],
    treatments: ["Prescription medication", "Sleep"],
    notes: "Severe migraine - had to leave work early"
  }
];

export function HeadacheDataExport({ headacheData, redFlags = [], isPremium = false, loading = false }: HeadacheDataExportProps) {
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv">("pdf");
  const { logTestEvent, isTestMode } = useTestContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { profile } = usePatientProfile();
  
  // Use demo data only if no real data provided
  const exportData = headacheData && headacheData.length > 0 ? headacheData : demoHeadacheData;
  const isUsingDemoData = !headacheData || headacheData.length === 0;

  const handleExportRequest = () => {
    // Validate user session
    if (!validateUserSession()) {
      toast.error("Session validation failed", {
        description: "Please refresh the page and try again"
      });
      return;
    }

    const session = getUserSession();
    
    // Check rate limiting
    const rateLimitCheck = checkRateLimit(session.id, 'export');
    if (!rateLimitCheck.allowed) {
      toast.error("Export limit reached", {
        description: rateLimitCheck.message
      });
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmedExport = () => {
    setIsGenerating(true);

    const session = getUserSession();

    // Log the export event for testing analytics
    if (isTestMode) {
      logTestEvent({
        type: "feature_usage",
        details: `Exported headache data in ${exportFormat} format`,
        component: "HeadacheDataExport",
        metadata: {
          format: exportFormat,
          recordCount: exportData.length,
          userId: session.id,
          isBetaTester: session.isBetaTester,
          isUsingDemoData
        }
      });
    }

    setTimeout(() => {
      try {
        let fileSize: number | undefined;
        
        if (exportFormat === "pdf") {
          fileSize = generateSecurePDF(session);
        } else {
          fileSize = generateSecureCSV(session);
        }

        // Log the export activity
        logExportActivity(exportFormat, exportData.length, fileSize);

        toast.success(`Headache data exported as ${exportFormat.toUpperCase()}`, {
          description: "Export logged for security. You can now share this with your healthcare provider."
        });
      } catch (error) {
        console.error("Export error:", error);
        toast.error("Export failed", {
          description: "There was a problem exporting your data"
        });
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  const generateSecurePDF = (session: any): number => {
    const doc = new jsPDF();
    const disclaimer = getDisclaimer('ai-premium-report');
    let yPos = 20;
    
    // Add security header with user info
    doc.setFontSize(8);
    doc.text(`Export ID: ${Date.now()}-${session.id.slice(-8)}`, 20, 10);
    doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 20, 15);
    
    // Add title
    doc.setFontSize(20);
    doc.text("Headache Experience Journal: Patient Report", 20, 25);
    
    // Add patient identification section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT IDENTIFICATION", 20, 38);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const patientName = profile?.fullName || 'Not provided';
    const patientEmail = profile?.email || 'Not provided';
    const firstDataDate = profile?.firstDataDate 
      ? format(new Date(profile.firstDataDate), 'PPP')
      : 'No data recorded';
    const trackingPeriod = profile?.trackingPeriodDays 
      ? `${profile.trackingPeriodDays} days`
      : 'N/A';
    
    doc.text(`Patient Name: ${patientName}`, 20, 46);
    doc.text(`Email: ${patientEmail}`, 20, 52);
    doc.text(`First Data Recorded: ${firstDataDate}`, 20, 58);
    doc.text(`Tracking Period: ${trackingPeriod}`, 20, 64);
    doc.text(`Total Episodes: ${profile?.totalEpisodes || exportData.length}`, 20, 70);
    doc.text(`Report Generated: ${format(new Date(), 'PPP')}`, 20, 76);
    
    // Add verification note
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("This report should be verified against the patient presenting to the healthcare provider.", 20, 84);
    doc.setTextColor(0, 0, 0);
    
    // Add comprehensive legal disclaimer
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("LEGAL DISCLAIMER", 20, 92);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    
    if (disclaimer) {
      const disclaimerLines = doc.splitTextToSize(disclaimer.content, 170);
      yPos = 100;
      disclaimerLines.forEach((line: string) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 20, yPos);
        yPos += 4;
      });
      
      // Add new page for data
      doc.addPage();
      yPos = 20;
    } else {
      // Fallback basic disclaimer
      doc.text("This report contains personal health information. Handle with care and share only with trusted healthcare providers.", 20, 100);
      yPos = 110;
    }
    
    // Add patient section title
    doc.setFontSize(14);
    doc.text("Headache Records", 20, yPos);
    yPos += 10;
    
    // Add headache records
    exportData.forEach((record, index) => {
      // Ensure we don't go off the page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      const recordDate = new Date(record.date).toLocaleDateString();
      doc.text(`Record ${index + 1} - ${recordDate}`, 20, yPos);
      yPos += 6;
      
      doc.setFontSize(10);
      doc.text(`Intensity: ${record.intensity}/10`, 25, yPos); yPos += 5;
      doc.text(`Location: ${record.location}`, 25, yPos); yPos += 5;
      doc.text(`Duration: ${record.duration} minutes`, 25, yPos); yPos += 5;
      
      if (record.symptoms?.length) {
        doc.text(`Symptoms: ${record.symptoms.join(", ")}`, 25, yPos); 
        yPos += 5;
      }
      
      if (record.triggers?.length) {
        doc.text(`Triggers: ${record.triggers.join(", ")}`, 25, yPos); 
        yPos += 5;
      }
      
      if (record.treatments?.length) {
        doc.text(`Treatments: ${record.treatments.join(", ")}`, 25, yPos); 
        yPos += 5;
      }
      
      if (record.notes) {
        doc.text(`Notes: ${record.notes}`, 25, yPos); 
        yPos += 5;
      }
      
      yPos += 5; // Add some space between records
    });

    // Red Flags Section
    if (redFlags.length > 0) {
      doc.addPage();
      yPos = 20;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("RED FLAG SCREENING HISTORY", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("The following entries triggered safety screening alerts based on SNOOP criteria.", 20, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 8;

      redFlags.forEach((rf, idx) => {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        
        doc.setFontSize(11);
        const rfDate = format(new Date(rf.date), 'PPP');
        const priorityLabel = rf.priorityLevel.charAt(0).toUpperCase() + rf.priorityLevel.slice(1);
        doc.text(`${idx + 1}. ${rfDate} — ${priorityLabel} Priority`, 20, yPos);
        yPos += 6;
        
        doc.setFontSize(9);
        rf.flags.forEach((flag) => {
          if (yPos > 270) { doc.addPage(); yPos = 20; }
          const lines = doc.splitTextToSize(`• ${flag.label}: ${flag.detail}`, 165);
          lines.forEach((line: string) => {
            doc.text(line, 25, yPos);
            yPos += 4;
          });
        });
        yPos += 4;
      });
    }
    
    // Add summary section
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Summary", 20, 20);
    
    doc.setFontSize(10);
    doc.text(`Total Headache Episodes: ${exportData.length}`, 20, 30);
    
    const avgIntensity = exportData.reduce((sum, record) => sum + record.intensity, 0) / exportData.length;
    doc.text(`Average Intensity: ${avgIntensity.toFixed(1)}/10`, 20, 35);
    
    const avgDuration = exportData.reduce((sum, record) => sum + record.duration, 0) / exportData.length;
    doc.text(`Average Duration: ${avgDuration.toFixed(0)} minutes`, 20, 40);
    
    // Save the PDF with secure filename
    const filename = `Headache_Report_${session.id.slice(-8)}_${Date.now()}.pdf`;
    doc.save(filename);
    
    // Return approximate file size - use correct API
    return doc.internal.pageSize.getWidth() * doc.getNumberOfPages() * 1000; // Fixed the API call
  };

  const generateSecureCSV = (session: any): number => {
    const patientName = profile?.fullName || 'Not provided';
    const patientEmail = profile?.email || 'Not provided';
    const firstDataDate = profile?.firstDataDate 
      ? format(new Date(profile.firstDataDate), 'PPP')
      : 'No data recorded';
    
    // Create CSV content with patient identification header
    let csvContent = `# Headache Experience Journal Export\n`;
    csvContent += `# ========================================\n`;
    csvContent += `# PATIENT IDENTIFICATION\n`;
    csvContent += `# Patient Name: ${patientName}\n`;
    csvContent += `# Patient Email: ${patientEmail}\n`;
    csvContent += `# First Data Recorded: ${firstDataDate}\n`;
    csvContent += `# Tracking Period: ${profile?.trackingPeriodDays || 0} days\n`;
    csvContent += `# Total Episodes: ${profile?.totalEpisodes || exportData.length}\n`;
    csvContent += `# ========================================\n`;
    csvContent += `# Export ID: ${Date.now()}-${session.id.slice(-8)}\n`;
    csvContent += `# Generated: ${format(new Date(), 'PPpp')}\n`;
    csvContent += `# CONFIDENTIAL: Contains personal health information\n`;
    csvContent += `# This report should be verified against the patient presenting to the healthcare provider.\n#\n`;
    csvContent += "Date,Intensity,Location,Duration,Symptoms,Triggers,Treatments,Notes\n";
    
    exportData.forEach(record => {
      const row = [
        new Date(record.date).toLocaleDateString(),
        record.intensity,
        `"${record.location}"`,
        record.duration,
        `"${record.symptoms?.join("; ") || ""}"`,
        `"${record.triggers?.join("; ") || ""}"`,
        `"${record.treatments?.join("; ") || ""}"`,
        `"${record.notes || ""}"`
      ];
      
      csvContent += row.join(",") + "\n";
    });

    // Red Flags section
    if (redFlags.length > 0) {
      csvContent += "\n# RED FLAG SCREENING HISTORY\n";
      csvContent += "Date,Priority,Flags\n";
      redFlags.forEach((rf) => {
        const rfDate = format(new Date(rf.date), 'PPP');
        const flagSummary = rf.flags.map(f => `${f.label}: ${f.detail}`).join('; ');
        csvContent += `${rfDate},${rf.priorityLevel},"${flagSummary}"\n`;
      });
    }
    
    // Create and download CSV file with secure filename
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `Headache_Data_${session.id.slice(-8)}_${Date.now()}.csv`;
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return blob.size;
  };

  return (
    <>
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-400" />
            Secure Headache Data Export
            <Shield className="h-4 w-4 text-green-400" />
          </CardTitle>
          <CardDescription className="text-gray-400">
            Generate a secure, user-verified report of your headache data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isPremium && !isTestMode ? (
              <div className="bg-gray-900 p-4 rounded-lg border border-purple-500/50">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="h-5 w-5 text-purple-400" />
                  <h3 className="text-white font-medium">Premium Feature</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Data export is available to premium users. During the pilot testing period, all premium features are unlocked.
                </p>
                <Button variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
                  Enable Test Mode
                </Button>
              </div>
            ) : (
              <>
                {/* Demo Data Warning */}
                {isUsingDemoData && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <span className="text-amber-300 font-medium text-sm">No Headache Data Found</span>
                    </div>
                    <p className="text-amber-200 text-xs">
                      You haven't logged any completed headache episodes yet. The preview below shows sample data for demonstration purposes only. Start logging your headaches to export your real data.
                    </p>
                  </div>
                )}

                {/* Security Notice */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-green-300 font-medium text-sm">Security Enhanced</span>
                  </div>
                  <p className="text-green-200 text-xs">
                    This export includes user verification, rate limiting, and audit logging for your security.
                  </p>
                </div>

                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="bg-gray-900 text-gray-400">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="options">Export Options</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="preview" className="mt-4">
                    <div className="bg-gray-900 p-4 rounded-lg max-h-[400px] overflow-y-auto">
                      <Table>
                        <TableHeader className="bg-gray-800/80">
                          <TableRow>
                            <TableHead className="text-gray-400">Date</TableHead>
                            <TableHead className="text-gray-400">Intensity</TableHead>
                            <TableHead className="text-gray-400">Location</TableHead>
                            <TableHead className="text-gray-400">Duration</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {exportData.map((record) => (
                            <TableRow key={record.id} className="border-gray-800">
                              <TableCell className="text-gray-300">
                                {new Date(record.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-gray-300">{record.intensity}/10</TableCell>
                              <TableCell className="text-gray-300">{record.location}</TableCell>
                              <TableCell className="text-gray-300">{record.duration} min</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="options" className="mt-4">
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-white font-medium mb-2">Format</h3>
                          <div className="flex space-x-2">
                            <Button
                              variant={exportFormat === "pdf" ? "default" : "outline"}
                              className={exportFormat === "pdf" ? 
                                "bg-teal-600 hover:bg-teal-700" : 
                                "bg-gray-800 border-gray-700 text-gray-300"}
                              onClick={() => setExportFormat("pdf")}
                            >
                              PDF Format
                            </Button>
                            <Button
                              variant={exportFormat === "csv" ? "default" : "outline"}
                              className={exportFormat === "csv" ? 
                                "bg-teal-600 hover:bg-teal-700" : 
                                "bg-gray-800 border-gray-700 text-gray-300"}
                              onClick={() => setExportFormat("csv")}
                            >
                              CSV Format
                            </Button>
                          </div>
                          <p className="text-gray-400 text-xs mt-2">
                            {exportFormat === "pdf" ? 
                              "PDF format includes comprehensive legal disclaimer and security metadata" : 
                              "CSV format includes security headers and disclaimer information"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-4">
                  <InlineDisclaimer 
                    disclaimerId="export-disclaimer"
                    variant="info"
                    size="sm"
                    showTitle={false}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <div className="text-xs text-gray-500">
            {exportData.length} records{isUsingDemoData ? ' (demo)' : ''} • Security verified
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 text-gray-300"
              onClick={() => {
                toast.info("Share feature coming soon");
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={handleExportRequest}
              disabled={isGenerating || (!isPremium && !isTestMode)}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : `Secure Export ${exportFormat.toUpperCase()}`}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ExportConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmedExport}
        exportType={exportFormat}
        recordCount={exportData.length}
      />
    </>
  );
}
