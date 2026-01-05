// DEPRECATED: December 14, 2025
// This file has been deprecated and replaced with Edge Functions for security.
// OpenAI API keys should never be exposed in the frontend bundle.
//
// Migration:
// - Quiz generation: Use `supabase.functions.invoke('generate-quiz', {...})`
// - AI grading: Use `supabase.functions.invoke('grade-response', {...})`
//
// See: src/lib/ai/DEPRECATED.md for details

// ⚠️ DEPRECATED - DO NOT USE
// Keeping this file temporarily for reference during testing phase.
// Will be deleted after full verification of Edge Functions.
//
// If you see imports of this file, they should be removed or updated to use Edge Functions.

// Stub export to prevent build errors in deprecated files that still import this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const openai: any = {
    chat: {
        completions: {
            create: () => {
                throw new Error(
                    "OpenAI client is deprecated. Use Edge Functions instead.",
                );
            },
        },
    },
};
