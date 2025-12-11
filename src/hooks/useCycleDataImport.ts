import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { parseCycleCSV, ParseResult, ParsedCycleEntry } from '@/utils/cycleDataParser';
import { useToast } from '@/hooks/use-toast';

interface ImportState {
  isReading: boolean;
  isParsing: boolean;
  isImporting: boolean;
  parseResult: ParseResult | null;
  importedCount: number;
  error: string | null;
}

export function useCycleDataImport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<ImportState>({
    isReading: false,
    isParsing: false,
    isImporting: false,
    parseResult: null,
    importedCount: 0,
    error: null,
  });

  const readFile = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  const parseFile = useCallback(async (
    file: File, 
    forceFormat?: 'clue' | 'flo' | 'generic'
  ): Promise<ParseResult | null> => {
    if (!file) return null;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setState(prev => ({ ...prev, error: 'Please upload a CSV file' }));
      return null;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setState(prev => ({ ...prev, error: 'File size must be less than 5MB' }));
      return null;
    }

    setState(prev => ({ ...prev, isReading: true, isParsing: false, error: null }));

    try {
      const content = await readFile(file);
      setState(prev => ({ ...prev, isReading: false, isParsing: true }));
      
      const result = parseCycleCSV(content, forceFormat);
      
      setState(prev => ({ 
        ...prev, 
        isParsing: false, 
        parseResult: result,
        error: result.success ? null : result.errors[0] || 'Failed to parse CSV',
      }));
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to read file';
      setState(prev => ({ 
        ...prev, 
        isReading: false, 
        isParsing: false, 
        error: errorMessage,
      }));
      return null;
    }
  }, [readFile]);

  const importData = useCallback(async (entries: ParsedCycleEntry[]): Promise<boolean> => {
    if (!user || entries.length === 0) return false;

    setState(prev => ({ ...prev, isImporting: true, error: null }));

    try {
      // Prepare records for upsert
      const records = entries.map(entry => ({
        user_id: user.id,
        date: entry.date,
        data_type: 'menstrual',
        source: `csv_${entry.source}`,
        cycle_day: entry.cycleDay || null,
        menstrual_phase: entry.menstrualPhase || null,
        period_flow: entry.periodFlow || null,
      }));

      // Use upsert to handle duplicates (update existing records for same date)
      const { error } = await supabase
        .from('unified_health_data')
        .upsert(records, {
          onConflict: 'user_id,date,data_type',
          ignoreDuplicates: false,
        });

      if (error) {
        // If unique constraint error, try inserting one by one
        if (error.code === '23505') {
          let successCount = 0;
          for (const record of records) {
            const { error: insertError } = await supabase
              .from('unified_health_data')
              .upsert(record, { onConflict: 'user_id,date,data_type' });
            
            if (!insertError) successCount++;
          }
          
          setState(prev => ({ 
            ...prev, 
            isImporting: false, 
            importedCount: successCount,
          }));

          toast({
            title: 'Import Complete',
            description: `Successfully imported ${successCount} of ${records.length} cycle entries.`,
          });

          return successCount > 0;
        }
        
        throw error;
      }

      setState(prev => ({ 
        ...prev, 
        isImporting: false, 
        importedCount: records.length,
      }));

      toast({
        title: 'Import Successful',
        description: `Successfully imported ${records.length} cycle data entries.`,
      });

      return true;
    } catch (err) {
      console.error('Import error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to import data';
      setState(prev => ({ 
        ...prev, 
        isImporting: false, 
        error: errorMessage,
      }));
      
      toast({
        title: 'Import Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    }
  }, [user, toast]);

  const reset = useCallback(() => {
    setState({
      isReading: false,
      isParsing: false,
      isImporting: false,
      parseResult: null,
      importedCount: 0,
      error: null,
    });
  }, []);

  return {
    ...state,
    isLoading: state.isReading || state.isParsing || state.isImporting,
    parseFile,
    importData,
    reset,
  };
}
