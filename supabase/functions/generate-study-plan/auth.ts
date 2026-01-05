/**
 * Authentication utilities for generate-study-plan Edge Function
 * Copied from generate-quiz pattern
 */

import {
    createClient,
    SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

export interface AuthResult {
    user: {
        id: string;
        email?: string;
    };
    supabaseClient: SupabaseClient;
}

export async function validateAuth(req: Request): Promise<AuthResult> {
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

    const {
        data: { user },
        error,
    } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
        throw new Error("Invalid or expired token");
    }

    return { user, supabaseClient };
}
