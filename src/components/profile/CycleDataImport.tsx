import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  Loader2, 
  AlertCircle,
  FileSpreadsheet,
  Info
} from 'lucide-react';
import { useCycleDataImport } from '@/hooks/useCycleDataImport';
import { ParsedCycleEntry } from '@/utils/cycleDataParser';

type FormatOption = 'auto' | 'clue' | 'flo' | 'generic';

export function CycleDataImport() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFormat, setSelectedFormat] = useState<FormatOption>('auto');
  const [dragOver, setDragOver] = useState(false);
  
  const {
    isLoading,
    isReading,
    isParsing,
    isImporting,
    parseResult,
    error,
    parseFile,
    importData,
    reset,
  } = useCycleDataImport();

  const handleFileSelect = useCallback(async (file: File) => {
    const format = selectedFormat === 'auto' ? undefined : selectedFormat;
    await parseFile(file, format);
  }, [parseFile, selectedFormat]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleImport = useCallback(async () => {
    if (parseResult?.entries) {
      const success = await importData(parseResult.entries);
      if (success) {
        reset();
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  }, [parseResult, importData, reset]);

  const handleCancel = useCallback(() => {
    reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [reset]);

  const getFormatBadgeColor = (format: string) => {
    switch (format) {
      case 'clue': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'flo': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'generic': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Import Cycle Data
        </CardTitle>
        <CardDescription className="text-sm">
          Import menstrual cycle data from Clue, Flo, or other CSV exports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Format Selection */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground">Format:</label>
          <Select value={selectedFormat} onValueChange={(v) => setSelectedFormat(v as FormatOption)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto-detect</SelectItem>
              <SelectItem value="clue">Clue</SelectItem>
              <SelectItem value="flo">Flo</SelectItem>
              <SelectItem value="generic">Generic CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* File Drop Zone */}
        {!parseResult && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              transition-colors duration-200
              ${dragOver 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleInputChange}
              className="hidden"
            />
            
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  {isReading ? 'Reading file...' : 'Parsing data...'}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Drop CSV file here or click to browse
                </span>
                <span className="text-xs text-muted-foreground">
                  Supports Clue, Flo, and generic CSV formats
                </span>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Parse Results Preview */}
        {parseResult && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className={getFormatBadgeColor(parseResult.detectedFormat)}>
                {parseResult.detectedFormat === 'unknown' ? 'Unknown' : parseResult.detectedFormat.charAt(0).toUpperCase() + parseResult.detectedFormat.slice(1)} Format
              </Badge>
              <span className="text-sm text-muted-foreground">
                {parseResult.validRows} of {parseResult.totalRows} rows valid
              </span>
              {parseResult.errors.length > 0 && (
                <span className="text-sm text-yellow-500">
                  {parseResult.errors.length} warning{parseResult.errors.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Preview Table */}
            {parseResult.entries.length > 0 && (
              <div className="border border-border rounded-lg overflow-hidden">
                <ScrollArea className="h-48">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Phase</TableHead>
                        <TableHead className="text-xs">Flow</TableHead>
                        <TableHead className="text-xs">Day</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parseResult.entries.slice(0, 20).map((entry, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-sm font-mono">{entry.date}</TableCell>
                          <TableCell className="text-sm capitalize">{entry.menstrualPhase || '-'}</TableCell>
                          <TableCell className="text-sm capitalize">{entry.periodFlow || '-'}</TableCell>
                          <TableCell className="text-sm">{entry.cycleDay || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                {parseResult.entries.length > 20 && (
                  <div className="p-2 text-center text-xs text-muted-foreground bg-muted/30 border-t border-border">
                    Showing first 20 of {parseResult.entries.length} entries
                  </div>
                )}
              </div>
            )}

            {/* Warnings */}
            {parseResult.errors.length > 0 && parseResult.errors.length <= 5 && (
              <div className="text-sm space-y-1">
                {parseResult.errors.map((err, idx) => (
                  <p key={idx} className="text-yellow-500 text-xs">⚠ {err}</p>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleImport}
                disabled={!parseResult.success || isImporting}
                className="flex-1"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Import {parseResult.entries.length} Entries
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isImporting}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground mb-1">How to export your data:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>Clue:</strong> Settings → Export data → Export to CSV</li>
              <li><strong>Flo:</strong> Profile → Privacy → Export my data</li>
              <li><strong>Generic:</strong> CSV with columns: date, phase, flow, cycle_day</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
