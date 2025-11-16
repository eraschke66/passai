import { supabase } from "@/lib/supabase/client";
import type {
  SignUpInput,
  SignInInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from "./schemas";
import type { AuthResponse } from "../types";
import type { Profile } from "../types";

// =============================================
// Error Handler
// =============================================

function handleAuthError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: string }).message;

    // Map Supabase error messages to user-friendly messages
    if (message.includes("Email not confirmed")) {
      return "Please confirm your email address before logging in. Check your inbox for the confirmation link.";
    }
    if (message.includes("Invalid login credentials")) {
      return "Invalid email or password. Please try again.";
    }
    if (message.includes("User already registered")) {
      return "An account with this email already exists. Please log in or use a different email.";
    }
    if (message.includes("Email rate limit exceeded")) {
      return "Too many attempts. Please wait a few minutes and try again.";
    }

    return message;
  }

  return "An unexpected error occurred. Please try again.";
}

// =============================================
// Authentication Services
// =============================================

/**
 * Sign up a new user with email and password
 */
export async function signUp(input: SignUpInput): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          first_name: input.firstName,
          last_name: input.lastName,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: handleAuthError(error),
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Failed to create account. Please try again.",
      };
    }

    return {
      success: true,
      message:
        "Account created successfully! Please check your email to confirm your account.",
    };
  } catch (error) {
    return {
      success: false,
      error: handleAuthError(error),
    };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(input: SignInInput): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      return {
        success: false,
        error: handleAuthError(error),
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Failed to log in. Please try again.",
      };
    }

    return {
      success: true,
      message: "Successfully logged in!",
    };
  } catch (error) {
    return {
      success: false,
      error: handleAuthError(error),
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: handleAuthError(error),
      };
    }

    return {
      success: true,
      message: "Successfully logged out!",
    };
  } catch (error) {
    return {
      success: false,
      error: handleAuthError(error),
    };
  }
}

/**
 * Send a password reset email
 */
export async function forgotPassword(
  input: ForgotPasswordInput
): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: handleAuthError(error),
      };
    }

    return {
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link shortly.",
    };
  } catch (error) {
    return {
      success: false,
      error: handleAuthError(error),
    };
  }
}

/**
 * Reset password with a new password (called from reset link)
 */
export async function resetPassword(
  input: ResetPasswordInput
): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: input.password,
    });

    if (error) {
      return {
        success: false,
        error: handleAuthError(error),
      };
    }

    return {
      success: true,
      message:
        "Password updated successfully! You can now log in with your new password.",
    };
  } catch (error) {
    return {
      success: false,
      error: handleAuthError(error),
    };
  }
}

/**
 * Get the current user's session
 */
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error);
    return null;
  }

  return data.session;
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting user:", error);
    return null;
  }

  return data.user;
}

// =============================================
// Profile Services
// =============================================

/**
 * Get the current user's profile
 */
export async function getProfile(): Promise<Profile | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

/**
 * Update the current user's profile
 */
export async function updateProfile(
  input: UpdateProfileInput
): Promise<AuthResponse> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to update your profile.",
      };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: input.firstName,
        last_name: input.lastName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      return {
        success: false,
        error: handleAuthError(error),
      };
    }

    return {
      success: true,
      message: "Profile updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      error: handleAuthError(error),
    };
  }
}

/**
 * Change the current user's password
 */
export async function changePassword(
  input: ChangePasswordInput
): Promise<AuthResponse> {
  try {
    // First verify current password by attempting to sign in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return {
        success: false,
        error: "You must be logged in to change your password.",
      };
    }

    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: input.currentPassword,
    });

    if (signInError) {
      return {
        success: false,
        error: "Current password is incorrect.",
      };
    }

    // Update to new password
    const { error } = await supabase.auth.updateUser({
      password: input.newPassword,
    });

    if (error) {
      return {
        success: false,
        error: handleAuthError(error),
      };
    }

    return {
      success: true,
      message: "Password changed successfully!",
    };
  } catch (error) {
    return {
      success: false,
      error: handleAuthError(error),
    };
  }
}
