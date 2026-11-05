import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { computeBetaStatus, type BetaStatus } from "@/lib/betaStatus";

export function useBetaStatus(): BetaStatus & { loading: boolean } {
  const { user } = useAuth();
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!user) {
      setExpiresAt(null);
      setLoading(false);
      return;
    }
    supabase
      .from("profiles")
      .select("premium_expires_at")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setExpiresAt((data as { premium_expires_at?: string | null } | null)?.premium_expires_at ?? null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  return { ...computeBetaStatus(expiresAt), loading };
}
