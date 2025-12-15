/**
 * Authentication utilities for Edge Functions
 * Validates JWT tokens and returns authenticated user
 */

import {
    createClient,
    SupabaseClient,
    User,
} from "https://esm.sh/@supabase/supabase-js@2";

export interface AuthResult {
    user: User;
    supabaseClient: SupabaseClient;
}

/**
 * Validate authentication from request headers
 * Throws error if auth is invalid or missing
 */
export async function validateAuth(req: Request): Promise<AuthResult> {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
        throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");

    const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: { Authorization: authHeader },
            },
        },
    );

    const { data: { user }, error } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
        throw new Error("Invalid or expired token");
    }

    return { user, supabaseClient };
}

/**
 * Check if user has access to a specific subject
 */
export async function validateSubjectAccess(
    supabaseClient: SupabaseClient,
    userId: string,
    subjectId: string,
): Promise<boolean> {
    const { data, error } = await supabaseClient
        .from("subjects")
        .select("id")
        .eq("id", subjectId)
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        console.error("Error checking subject access:", error);
        return false;
    }

    return !!data;
}

/**
 * Check if user has access to specific materials
 */
export async function validateMaterialsAccess(
    supabaseClient: SupabaseClient,
    userId: string,
    materialIds: string[],
): Promise<boolean> {
    const { data, error } = await supabaseClient
        .from("study_materials")
        .select("id")
        .in("id", materialIds)
        .eq("user_id", userId);

    if (error) {
        console.error("Error checking materials access:", error);
        return false;
    }

    // All materials must belong to user
    return data.length === materialIds.length;
}
