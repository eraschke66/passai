// types/database.ts
import type { Database } from "./supabase";

// Extract table types
export type Tables = Database["public"]["Tables"];

// Extract specific table row types
export type Profile = Tables["profiles"]["Row"];
export type ProfileInsert = Tables["profiles"]["Insert"];
export type ProfileUpdate = Tables["profiles"]["Update"];

// Helper type for all row types
export type TableRow<T extends keyof Tables> = Tables[T]["Row"];
export type TableInsert<T extends keyof Tables> = Tables[T]["Insert"];
export type TableUpdate<T extends keyof Tables> = Tables[T]["Update"];
