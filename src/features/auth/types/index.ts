import type { Database } from "@/lib/supabase/types";
import type { User, Session } from "@supabase/supabase-js";

export interface AuthResponse {
  success: boolean;
  error?: string;
  message?: string;
}

// export interface Profile {
//   id: string;
//   email: string;
//   first_name: string;
//   last_name: string;
//   created_at: string;
//   updated_at: string;
//   subscription_tier: "free" | "premium";
//   subscription_status: "active" | "inactive" | "cancelled";
// }

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
