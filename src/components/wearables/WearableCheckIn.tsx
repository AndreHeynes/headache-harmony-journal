import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Watch, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isDemoMode } from "@/lib/demoMode";

export const WEARABLE_TIP =
  "Wear a Fitbit, Apple Watch, or Oura Ring? Use your morning sleep score and HRV to populate your daily check-in. Our AI correlation engine will analyze how sleep architecture affects your episode frequency.";

interface Props {
  title?: string;
  compact?: boolean;
}

const toNum = (v: string) => (v.trim() === "" ? null : Number(v));

/** Manual sleep & wearable check-in for today. Saves one manual row per day. */
export function WearableCheckIn({ title = "Daily Sleep & Wearable Check-in", compact = false }: Props) {
  const { user } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");
  const [hours, setHours] = useState(() => isDemoMode() ? "6.5" : "");
  const [score, setScore] = useState(() => isDemoMode() ? "72" : "");
  const [rhr, setRhr] = useState(() => isDemoMode() ? "62" : "");
  const [hrv, setHrv] = useState(() => isDemoMode() ? "48" : "");
  const [saving, setSaving] = useState(false);
  const [savedToday, setSavedToday] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("unified_health_data")
      .select("sleep_duration_minutes,sleep_quality_score,resting_heart_rate,hrv")
      .eq("user_id", user.id)
      .eq("date", today)
      .eq("data_type", "sleep")
      .eq("source", "manual")
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        const d = data as Record<string, number | null>;
        if (d.sleep_duration_minutes != null) setHours(String(Math.round((d.sleep_duration_minutes / 60) * 10) / 10));
        if (d.sleep_quality_score != null) setScore(String(d.sleep_quality_score));
        if (d.resting_heart_rate != null) setRhr(String(d.resting_heart_rate));
        if (d.hrv != null) setHrv(String(d.hrv));
        setSavedToday(true);
      });
  }, [user, today]);

  const save = async () => {
    if (!user) return;
    const h = toNum(hours), s = toNum(score), r = toNum(rhr), v = toNum(hrv);
    if (h == null && s == null && r == null && v == null) {
      toast.error("Enter at least one value");
      return;
    }
    if ((h != null && (h < 0 || h > 24)) || (s != null && (s < 1 || s > 100)) ||
        (r != null && (r < 20 || r > 220)) || (v != null && (v < 1 || v > 300))) {
      toast.error("Please check the values: sleep 0–24 h, score 1–100, heart rate 20–220, HRV 1–300");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("unified_health_data").upsert(
      {
        user_id: user.id,
        date: today,
        data_type: "sleep",
        source: "manual",
        sleep_duration_minutes: h == null ? null : Math.round(h * 60),
        sleep_quality_score: s == null ? null : Math.round(s),
        resting_heart_rate: r == null ? null : Math.round(r),
        hrv: v == null ? null : Math.round(v),
      },
      { onConflict: "user_id,date,data_type,source" },
    );
    setSaving(false);
    if (error) {
      console.error("[WearableCheckIn]", error);
      toast.error("Could not save your check-in");
      return;
    }
    setSavedToday(true);
    toast.success("Check-in saved");
  };

  return (
    <Card id="wearable-checkin" className="bg-card border-border">
      <CardHeader className={compact ? "pb-2" : undefined}>
        <CardTitle className="text-foreground flex items-center gap-2 text-base">
          <Watch className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{WEARABLE_TIP}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="wc-hours">Sleep duration (hours)</Label>
            <Input id="wc-hours" type="number" inputMode="decimal" step="0.1" min={0} max={24} value={hours} onChange={(e) => setHours(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wc-score">Sleep score (1–100)</Label>
            <Input id="wc-score" type="number" inputMode="numeric" min={1} max={100} value={score} onChange={(e) => setScore(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wc-rhr">Resting heart rate (optional)</Label>
            <Input id="wc-rhr" type="number" inputMode="numeric" value={rhr} onChange={(e) => setRhr(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wc-hrv">HRV, ms (optional)</Label>
            <Input id="wc-hrv" type="number" inputMode="numeric" value={hrv} onChange={(e) => setHrv(e.target.value)} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">From your smartwatch or tracker.</p>
        <Button onClick={save} disabled={saving} className="w-full">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {savedToday ? "Update today's check-in" : "Save check-in"}
        </Button>
      </CardContent>
    </Card>
  );
}
