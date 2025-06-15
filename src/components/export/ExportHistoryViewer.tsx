
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Download } from "lucide-react";
import { getUserExportHistory } from "@/utils/userSession";

export function ExportHistoryViewer() {
  const exportHistory = getUserExportHistory();

  if (exportHistory.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No Export History</h3>
          <p className="text-gray-400 text-sm">Your export activities will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-teal-400" />
          Export History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {exportHistory.slice(-10).reverse().map((log) => (
            <div key={log.id} className="bg-gray-900 p-3 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-teal-400" />
                  <Badge variant="outline" className="bg-teal-500/10 text-teal-300 border-teal-500/30">
                    {log.exportType.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(log.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                <div className="flex justify-between">
                  <span>Records:</span>
                  <span>{log.recordCount}</span>
                </div>
                {log.fileSize && (
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{(log.fileSize / 1024).toFixed(1)} KB</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
