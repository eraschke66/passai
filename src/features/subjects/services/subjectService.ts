import { supabase } from "@/lib/supabase/client";
import type { Subject, SubjectServiceResponse } from "../types";
import type { CreateSubjectInput, UpdateSubjectInput } from "./schemas";
import { getRandomPreset } from "../types/constants";

// =============================================
// Error Handler
// =============================================

function handleDatabaseError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: string; code?: string }).message;
    const code = (error as { code?: string }).code;

    // Handle specific PostgreSQL error codes
    if (code === "23505") {
      // Unique violation - duplicate subject name
      return "A subject with this name already exists. Please choose a different name.";
    }

    if (code === "23503") {
      // Foreign key violation
      return "Unable to complete operation. Please try again.";
    }

    if (message.includes("row-level security")) {
      return "You do not have permission to perform this action.";
    }

    return message;
  }

  return "An unexpected error occurred. Please try again.";
}

// =============================================
// CRUD Operations
// =============================================

/**
 * Create a new subject
 */
export async function createSubject(
  input: CreateSubjectInput
): Promise<SubjectServiceResponse<Subject>> {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to create a subject.",
      };
    }

    // TODO: Check free tier limit when subscription system is implemented
    // const { data: existingSubjects } = await supabase
    //   .from('subjects')
    //   .select('id', { count: 'exact', head: true })
    //   .eq('user_id', user.id);
    //
    // const userProfile = await getUserProfile(user.id);
    // if (userProfile.subscription_tier === 'free' &&
    //     existingSubjects && existingSubjects.length >= SUBJECT_LIMITS.FREE_TIER) {
    //   return {
    //     success: false,
    //     error: `Free tier users can only create up to ${SUBJECT_LIMITS.FREE_TIER} subjects. Upgrade to premium for unlimited subjects.`,
    //   };
    // }

    // Get random icon and color if not provided
    const preset = getRandomPreset();
    const icon = input.icon || preset.icon;
    const color = input.color || preset.color;

    // Insert subject
    const { data, error } = await supabase
      .from("subjects")
      .insert({
        user_id: user.id,
        name: input.name,
        description: input.description || null,
        test_date: input.test_date || null,
        exam_board: input.exam_board || null,
        teacher_emphasis: input.teacher_emphasis || null,
        icon,
        color,
        progress: 0, // Start at 0%
        pass_chance: null, // Not enough data yet
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Failed to create subject. Please try again.",
      };
    }

    return {
      success: true,
      data: data as Subject,
      message: "Subject created successfully!",
    };
  } catch (error) {
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Get all subjects for the current user
 */
export async function getSubjects(): Promise<
  SubjectServiceResponse<Subject[]>
> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to view subjects.",
      };
    }

    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    return {
      success: true,
      data: (data || []) as Subject[],
    };
  } catch (error) {
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Get a single subject by ID
 */
export async function getSubjectById(
  id: string
): Promise<SubjectServiceResponse<Subject>> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to view this subject.",
      };
    }

    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          success: false,
          error: "Subject not found.",
        };
      }
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Subject not found.",
      };
    }

    return {
      success: true,
      data: data as Subject,
    };
  } catch (error) {
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Update a subject
 */
export async function updateSubject(
  id: string,
  input: UpdateSubjectInput
): Promise<SubjectServiceResponse<Subject>> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to update this subject.",
      };
    }

    const { data, error } = await supabase
      .from("subjects")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          success: false,
          error:
            "Subject not found or you do not have permission to update it.",
        };
      }
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Failed to update subject. Please try again.",
      };
    }

    return {
      success: true,
      data: data as Subject,
      message: "Subject updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Delete a subject
 * This will cascade delete all related materials, quizzes, etc.
 */
export async function deleteSubject(
  id: string
): Promise<SubjectServiceResponse> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to delete this subject.",
      };
    }

    const { error } = await supabase
      .from("subjects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    return {
      success: true,
      message: "Subject deleted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Update subject's last studied timestamp
 * Called when user takes a quiz or performs study actions
 */
export async function updateLastStudied(
  id: string
): Promise<SubjectServiceResponse> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in.",
      };
    }

    const { error } = await supabase
      .from("subjects")
      .update({
        last_studied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Update subject progress and pass chance
 * Called after quiz completion or when recalculating stats
 */
export async function updateSubjectStats(
  id: string,
  progress: number,
  passChance: number | null
): Promise<SubjectServiceResponse> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in.",
      };
    }

    const { error } = await supabase
      .from("subjects")
      .update({
        progress,
        pass_chance: passChance,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}
