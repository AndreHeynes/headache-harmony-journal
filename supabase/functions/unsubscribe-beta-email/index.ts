import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("[unsubscribe-beta-email] Edge function loaded");

const handler = async (req: Request): Promise<Response> => {
  const requestId = crypto.randomUUID().slice(0, 8);
  console.log(`[${requestId}] unsubscribe-beta-email invoked`);

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const userId = url.searchParams.get("user_id");

    // Need at least one identifier
    if (!email && !userId) {
      return new Response(
        getHtmlPage("Error", "Invalid unsubscribe link. Please contact support."),
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }

    console.log(`[${requestId}] Unsubscribe request for email: ${email}, user_id: ${userId}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Build query to find and cancel pending emails
    let query = supabase
      .from("beta_email_queue")
      .update({ 
        status: "cancelled",
        updated_at: new Date().toISOString()
      })
      .eq("status", "pending");

    if (userId) {
      query = query.eq("user_id", userId);
    } else if (email) {
      query = query.eq("email", email);
    }

    const { data, error } = await query.select();

    if (error) {
      console.error(`[${requestId}] Error cancelling emails:`, error);
      return new Response(
        getHtmlPage("Error", "Something went wrong. Please try again or contact support."),
        { status: 500, headers: { "Content-Type": "text/html" } }
      );
    }

    const cancelledCount = data?.length || 0;
    console.log(`[${requestId}] Cancelled ${cancelledCount} pending emails`);

    return new Response(
      getHtmlPage(
        "Unsubscribed Successfully",
        `You have been unsubscribed from beta emails. ${cancelledCount} scheduled email(s) have been cancelled. You will no longer receive automated emails from the beta program.`
      ),
      { status: 200, headers: { "Content-Type": "text/html" } }
    );

  } catch (error: any) {
    console.error(`[${requestId}] Error:`, error);
    return new Response(
      getHtmlPage("Error", "Something went wrong. Please try again or contact support."),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
};

function getHtmlPage(title: string, message: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Headache Experience Journal</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
      font-size: 24px;
    }
    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    a {
      display: inline-block;
      background: #6366f1;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.2s;
    }
    a:hover {
      background: #4f46e5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">${title.includes("Error") ? "❌" : "✅"}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="https://headache-harmony-journal.lovable.app">Return to App</a>
  </div>
</body>
</html>`;
}

serve(handler);
