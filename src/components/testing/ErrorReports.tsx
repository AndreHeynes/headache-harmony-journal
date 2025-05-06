
import { useMemo, useState } from "react";
import { TestEvent } from "@/contexts/TestContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronRight, AlertCircle, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ErrorSeverity } from "@/utils/errorReporting";

interface ErrorReportsProps {
  events: TestEvent[];
}

export function ErrorReports({ events }: ErrorReportsProps) {
  const [filter, setFilter] = useState<string>("all");
  const [openErrorIndex, setOpenErrorIndex] = useState<number | null>(null);
  const [selectedError, setSelectedError] = useState<TestEvent | null>(null);
  
  // Filter to only error events
  const errorEvents = useMemo(() => {
    return events.filter(event => event.type === "error");
  }, [events]);
  
  // Apply severity filter
  const filteredErrors = useMemo(() => {
    if (filter === "all") return errorEvents;
    // Use optional chaining since severity might be undefined
    return errorEvents.filter(event => event.severity === filter);
  }, [errorEvents, filter]);
  
  const handleViewDetails = (error: TestEvent) => {
    setSelectedError(error);
  };
  
  const groupedErrors = useMemo(() => {
    // Group by error message to detect patterns
    const grouped: Record<string, TestEvent[]> = {};
    
    errorEvents.forEach(error => {
      const key = error.details;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(error);
    });
    
    return Object.entries(grouped)
      .map(([message, errors]) => ({
        message,
        count: errors.length,
        latestTimestamp: Math.max(...errors.map(e => e.timestamp)),
        errors
      }))
      .sort((a, b) => b.latestTimestamp - a.latestTimestamp);
  }, [errorEvents]);
  
  if (errorEvents.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">No errors reported. Keep testing!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-medium text-lg flex items-center">
          <AlertCircle className="text-red-400 h-5 w-5 mr-2" />
          Reported Errors
          <span className="ml-2 bg-red-500/20 text-red-300 text-xs rounded-full px-2 py-0.5">
            {errorEvents.length}
          </span>
        </h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value={ErrorSeverity.LOW}>Low</SelectItem>
            <SelectItem value={ErrorSeverity.MEDIUM}>Medium</SelectItem>
            <SelectItem value={ErrorSeverity.HIGH}>High</SelectItem>
            <SelectItem value={ErrorSeverity.CRITICAL}>Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Error Summary</CardTitle>
          <CardDescription className="text-gray-400">
            Grouped errors by message - expand to see occurrences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {groupedErrors.map((group, groupIndex) => (
              <div 
                key={groupIndex} 
                className="border border-gray-700 rounded-md overflow-hidden"
              >
                <div 
                  className="flex justify-between items-center p-3 bg-gray-800 hover:bg-gray-700 cursor-pointer"
                  onClick={() => setOpenErrorIndex(openErrorIndex === groupIndex ? null : groupIndex)}
                >
                  <div className="flex items-center">
                    {openErrorIndex === groupIndex ? (
                      <ChevronDown className="h-4 w-4 text-gray-400 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />
                    )}
                    <span className="text-sm font-medium text-white truncate max-w-[400px]">
                      {group.message}
                    </span>
                    <span className="ml-2 bg-red-500/20 text-red-300 text-xs rounded-full px-2">
                      {group.count}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Latest: {formatDistanceToNow(group.latestTimestamp, { addSuffix: true })}
                  </div>
                </div>
                
                {openErrorIndex === groupIndex && (
                  <div className="bg-gray-900 border-t border-gray-700 p-2">
                    {group.errors.map((error, errorIndex) => (
                      <div 
                        key={errorIndex}
                        className="text-xs p-2 hover:bg-gray-800 rounded flex justify-between items-center"
                      >
                        <div>
                          <span className="text-gray-300">
                            {new Date(error.timestamp).toLocaleString()}
                          </span>
                          {error.component && (
                            <span className="ml-2 bg-gray-700 px-1.5 py-0.5 rounded-sm text-gray-300">
                              {error.component}
                            </span>
                          )}
                          {error.severity && (
                            <span className={`ml-2 px-1.5 py-0.5 rounded-sm ${getSeverityColor(error.severity)}`}>
                              {error.severity}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(error);
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Error details dialog */}
      <Dialog open={selectedError !== null} onOpenChange={() => setSelectedError(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Error Details</DialogTitle>
          </DialogHeader>
          
          {selectedError && (
            <div className="space-y-4">
              <Alert className="bg-red-900/20 border-red-800">
                <AlertTitle className="text-white flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {selectedError.details}
                </AlertTitle>
                <AlertDescription className="text-gray-300">
                  {selectedError.component && <p>Component: {selectedError.component}</p>}
                  <p>Time: {new Date(selectedError.timestamp).toLocaleString()}</p>
                  {selectedError.severity && <p>Severity: {selectedError.severity}</p>}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Stack Trace</h3>
                <ScrollArea className="h-[200px]">
                  <pre className="text-xs p-3 bg-gray-900 rounded whitespace-pre-wrap overflow-auto">
                    {selectedError.metadata?.stack || "No stack trace available"}
                  </pre>
                </ScrollArea>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Additional Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedError.metadata && Object.entries(selectedError.metadata)
                    .filter(([key]) => key !== 'stack')
                    .map(([key, value]) => (
                      <div key={key} className="bg-gray-900 p-2 rounded">
                        <p className="text-xs font-medium text-gray-400">{key}</p>
                        <p className="text-xs text-gray-300 break-words">
                          {typeof value === 'object' 
                            ? JSON.stringify(value) 
                            : String(value)
                          }
                        </p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case ErrorSeverity.LOW:
      return "bg-blue-500/20 text-blue-300";
    case ErrorSeverity.MEDIUM:
      return "bg-yellow-500/20 text-yellow-300";
    case ErrorSeverity.HIGH:
      return "bg-orange-500/20 text-orange-300";
    case ErrorSeverity.CRITICAL:
      return "bg-red-500/20 text-red-300";
    default:
      return "bg-gray-500/20 text-gray-300";
  }
}
