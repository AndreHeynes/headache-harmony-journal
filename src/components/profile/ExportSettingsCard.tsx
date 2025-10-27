import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ExportPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  fontFamily: 'Arial' | 'Times New Roman' | 'Calibri' | 'Georgia';
  lineSpacing: 'normal' | 'relaxed' | 'loose';
}

const fontSizeLabels = {
  small: 'Small (9pt)',
  medium: 'Medium (11pt)',
  large: 'Large (13pt)',
  'x-large': 'Extra Large (15pt)'
};

const lineSpacingLabels = {
  normal: 'Normal (1.0)',
  relaxed: 'Relaxed (1.5)',
  loose: 'Loose (2.0)'
};

export default function ExportSettingsCard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<ExportPreferences>({
    fontSize: 'medium',
    fontFamily: 'Arial',
    lineSpacing: 'normal'
  });

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('export_preferences')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data?.export_preferences && typeof data.export_preferences === 'object') {
        const prefs = data.export_preferences as any;
        if (prefs.fontSize && prefs.fontFamily && prefs.lineSpacing) {
          setPreferences(prefs as ExportPreferences);
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ export_preferences: preferences as any })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Export settings saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Document Settings</CardTitle>
        <CardDescription>
          Customize the appearance of your exported PDF and CSV documents for better readability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fontSize">Font Size</Label>
          <Select
            value={preferences.fontSize}
            onValueChange={(value) => setPreferences({ ...preferences, fontSize: value as any })}
          >
            <SelectTrigger id="fontSize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(fontSizeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontFamily">Font Family</Label>
          <Select
            value={preferences.fontFamily}
            onValueChange={(value) => setPreferences({ ...preferences, fontFamily: value as any })}
          >
            <SelectTrigger id="fontFamily">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Calibri">Calibri</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lineSpacing">Line Spacing</Label>
          <Select
            value={preferences.lineSpacing}
            onValueChange={(value) => setPreferences({ ...preferences, lineSpacing: value as any })}
          >
            <SelectTrigger id="lineSpacing">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(lineSpacingLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={savePreferences} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>

        <p className="text-sm text-muted-foreground mt-4">
          These settings will be applied to all future document exports. You can change them anytime.
        </p>
      </CardContent>
    </Card>
  );
}
