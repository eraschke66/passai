/**
 * Error handling utilities for Edge Functions
 */

import { corsHeaders } from "./cors.ts";

/**
 * Custom error class for Edge Functions
 */
export class EdgeFunctionError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code?: string,
    ) {
        super(message);
        this.name = "EdgeFunctionError";
    }
}

/**
 * Common error types
 */
export class AuthenticationError extends EdgeFunctionError {
    constructor(message = "Authentication failed") {
        super(message, 401, "AUTHENTICATION_ERROR");
    }
}

export class AuthorizationError extends EdgeFunctionError {
    constructor(message = "Access denied") {
        super(message, 403, "AUTHORIZATION_ERROR");
    }
}

export class ValidationError extends EdgeFunctionError {
    constructor(message: string) {
        super(message, 400, "VALIDATION_ERROR");
    }
}

export class NotFoundError extends EdgeFunctionError {
    constructor(message = "Resource not found") {
        super(message, 404, "NOT_FOUND");
    }
}

export class RateLimitError extends EdgeFunctionError {
    constructor(message = "Rate limit exceeded") {
        super(message, 429, "RATE_LIMIT_EXCEEDED");
    }
}

export class OpenAIError extends EdgeFunctionError {
    constructor(message: string) {
        super(message, 502, "OPENAI_ERROR");
    }
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
    error: unknown,
    defaultMessage = "Internal server error",
): Response {
    console.error("Edge Function Error:", error);

    if (error instanceof EdgeFunctionError) {
        return new Response(
            JSON.stringify({
                error: error.message,
                code: error.code,
            }),
            {
                status: error.statusCode,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            },
        );
    }

    // Unknown error - don't expose details
    return new Response(
        JSON.stringify({
            error: defaultMessage,
            code: "INTERNAL_ERROR",
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

/**
 * Create success response
 */
export function createSuccessResponse<T>(data: T, status = 200): Response {
    return new Response(
        JSON.stringify(data),
        {
            status,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
            },
        },
    );
}
