
import { SessionInfo } from "@/contexts/TestContext";

interface SessionInfoPanelProps {
  sessionInfo: SessionInfo;
}

export function SessionInfoPanel({ sessionInfo }: SessionInfoPanelProps) {
  return (
    <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-md">
      <h3 className="text-sm font-medium text-white mb-2">Session Information</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-gray-900/50 p-2 rounded">
          <span className="text-gray-400">Session ID:</span>
          <div className="text-gray-300 truncate">{sessionInfo.sessionId}</div>
        </div>
        <div className="bg-gray-900/50 p-2 rounded">
          <span className="text-gray-400">Started:</span>
          <div className="text-gray-300">
            {new Date(sessionInfo.startTime).toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-900/50 p-2 rounded">
          <span className="text-gray-400">Events:</span>
          <div className="text-gray-300">{sessionInfo.totalEvents}</div>
        </div>
        <div className="bg-gray-900/50 p-2 rounded">
          <span className="text-gray-400">Errors:</span>
          <div className="text-gray-300">{sessionInfo.errorCount}</div>
        </div>
      </div>
    </div>
  );
}
