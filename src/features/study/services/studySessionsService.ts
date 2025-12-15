import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

type StudySession = Tables<"study_sessions">;

interface CreateStudySessionParams {
    subjectId: string;
    sessionDate: string; // YYYY-MM-DD format
    durationMinutes: number;
    topicsCovered?: string[];
    materialsUsed?: string[];
    mood?: "confident" | "okay" | "struggling" | "confused";
    notes?: string;
}

interface CreateStudySessionResult {
    data: StudySession | null;
    error: string | null;
}

/**
 * Create a new study session record
 * Used to track study activity for garden health, streaks, and analytics
 */
export const createStudySession = async (
    params: CreateStudySessionParams,
): Promise<CreateStudySessionResult> => {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return {
                data: null,
                error: "User not authenticated",
            };
        }

        const { data, error } = await supabase
            .from("study_sessions")
            .insert({
                user_id: user.id,
                subject_id: params.subjectId,
                session_date: params.sessionDate,
                duration_minutes: params.durationMinutes,
                topics_covered: params.topicsCovered || null,
                materials_used: params.materialsUsed || null,
                mood: params.mood || null,
                notes: params.notes || null,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating study session:", error);
            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data,
            error: null,
        };
    } catch (error) {
        console.error("Unexpected error creating study session:", error);
        return {
            data: null,
            error: error instanceof Error
                ? error.message
                : "Unknown error occurred",
        };
    }
};

/**
 * Get study sessions for a subject
 */
export const getStudySessions = async (
    subjectId: string,
): Promise<{ data: StudySession[] | null; error: string | null }> => {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return {
                data: null,
                error: "User not authenticated",
            };
        }

        const { data, error } = await supabase
            .from("study_sessions")
            .select("*")
            .eq("user_id", user.id)
            .eq("subject_id", subjectId)
            .order("session_date", { ascending: false });

        if (error) {
            console.error("Error fetching study sessions:", error);
            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data,
            error: null,
        };
    } catch (error) {
        console.error("Unexpected error fetching study sessions:", error);
        return {
            data: null,
            error: error instanceof Error
                ? error.message
                : "Unknown error occurred",
        };
    }
};

/**
 * Get recent study sessions across all subjects for the user
 */
export const getRecentStudySessions = async (
    limit = 10,
): Promise<{ data: StudySession[] | null; error: string | null }> => {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return {
                data: null,
                error: "User not authenticated",
            };
        }

        const { data, error } = await supabase
            .from("study_sessions")
            .select("*")
            .eq("user_id", user.id)
            .order("session_date", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Error fetching recent study sessions:", error);
            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data,
            error: null,
        };
    } catch (error) {
        console.error(
            "Unexpected error fetching recent study sessions:",
            error,
        );
        return {
            data: null,
            error: error instanceof Error
                ? error.message
                : "Unknown error occurred",
        };
    }
};
