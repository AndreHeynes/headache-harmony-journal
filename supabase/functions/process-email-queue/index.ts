import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

console.log("[process-email-queue] Edge function loaded");

const MAX_RETRIES = 3;
const BATCH_SIZE = 50;

const handler = async (req: Request): Promise<Response> => {
  const requestId = crypto.randomUUID().slice(0, 8);
  console.log(`[${requestId}] process-email-queue invoked`);

  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Fetch pending emails that are due
    const now = new Date().toISOString();
    console.log(`[${requestId}] Fetching pending emails due before: ${now}`);

    const { data: pendingEmails, error: fetchError } = await supabase
      .from("beta_email_queue")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_for", now)
      .lt("retry_count", MAX_RETRIES)
      .order("scheduled_for", { ascending: true })
      .limit(BATCH_SIZE);

    if (fetchError) {
      console.error(`[${requestId}] Error fetching queue:`, fetchError);
      return new Response(
        JSON.stringify({ success: false, error: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[${requestId}] Found ${pendingEmails?.length || 0} pending emails`);

    if (!pendingEmails || pendingEmails.length === 0) {
      return new Response(
        JSON.stringify({ success: true, processed: 0, message: "No pending emails" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let successCount = 0;
    let failCount = 0;

    // Process each email
    for (const email of pendingEmails) {
      console.log(`[${requestId}] Processing email ${email.id} - type: ${email.email_type}, to: ${email.email}`);

      try {
        // Call send-beta-email function
        const sendResponse = await fetch(`${supabaseUrl}/functions/v1/send-beta-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            queue_id: email.id,
            email: email.email,
            email_type: email.email_type,
            full_name: email.full_name,
          }),
        });

        const sendResult = await sendResponse.json();

        if (sendResult.success) {
          console.log(`[${requestId}] Email ${email.id} sent successfully`);
          successCount++;
        } else {
          console.error(`[${requestId}] Email ${email.id} failed:`, sendResult.error);
          
          // Update retry count and error message
          await supabase
            .from("beta_email_queue")
            .update({
              retry_count: email.retry_count + 1,
              error_message: sendResult.error || "Unknown error",
              status: email.retry_count + 1 >= MAX_RETRIES ? "failed" : "pending",
              updated_at: new Date().toISOString(),
            })
            .eq("id", email.id);

          failCount++;
        }
      } catch (sendError: any) {
        console.error(`[${requestId}] Exception sending email ${email.id}:`, sendError);
        
        // Update retry count and error message
        await supabase
          .from("beta_email_queue")
          .update({
            retry_count: email.retry_count + 1,
            error_message: sendError.message || "Exception occurred",
            status: email.retry_count + 1 >= MAX_RETRIES ? "failed" : "pending",
            updated_at: new Date().toISOString(),
          })
          .eq("id", email.id);

        failCount++;
      }
    }

    console.log(`[${requestId}] Processing complete - success: ${successCount}, failed: ${failCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: pendingEmails.length,
        successful: successCount,
        failed: failCount,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error(`[${requestId}] Error:`, error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
