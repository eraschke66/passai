import { useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import { AuthContext } from "../hooks/useAuth";
import type { AuthContextType } from "../types";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Fetch profile data when user changes
    const fetchProfile = async (userId: string) => {
      console.log("Fetching profile for user ID:", userId);
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Profile fetch timeout")), 10000)
        );

        const fetchPromise = supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        const result = await Promise.race([fetchPromise, timeoutPromise]);

        console.log("Profile data fetched:", result.data);

        if (result.error) {
          console.error("Error fetching profile:", result.error);
          setProfile(null);
          return;
        }

        setProfile(result.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      }
    };

    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session with timeout
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      console.log(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
