/**
 * Test Edge Function
 * Purpose: Verify deployment and environment configuration
 *
 * This is a simple hello-world function to test:
 * 1. Edge Function deployment process works
 * 2. Environment variables are configured correctly
 * 3. CORS and auth setup is working
 *
 * NOTE: Self-contained single file for dashboard deployment
 * No external imports from _shared/ - everything is inline
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================================================
// CORS Configuration
// ============================================================================
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// Auth Validation
// ============================================================================
async function validateAuth(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
        throw new Error("Invalid or expired token");
    }

    return { user, supabaseClient };
}

// ============================================================================
// Main Handler
// ============================================================================
serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // Test authentication (optional for test function)
        let authStatus = "not-tested";
        let userId: string | null = null;

        try {
            const { user } = await validateAuth(req);
            authStatus = "authenticated";
            userId = user.id;
        } catch (error) {
            console.log("An error occured: ", error); // This was added
            authStatus = "failed";
            // Continue anyway for test function
        }

        // Parse request body
        const body = await req.json().catch(() => ({}));
        const { name } = body;

        // Build response
        const data = {
            message: `Hello ${name || "World"}!`,
            timestamp: new Date().toISOString(),
            auth: {
                status: authStatus,
                userId: userId,
            },
            environment: {
                supabase_url: !!Deno.env.get("SUPABASE_URL"),
                supabase_anon_key: !!Deno.env.get("SUPABASE_ANON_KEY"),
                openai_api_key: !!Deno.env.get("OPENAI_API_KEY"),
            },
            request: {
                method: req.method,
                headers: {
                    "content-type": req.headers.get("content-type"),
                    "has-auth": !!req.headers.get("Authorization"),
                },
            },
        };

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Test function error:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error
                    ? error.message
                    : "Test function failed",
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            },
        );
    }
});
