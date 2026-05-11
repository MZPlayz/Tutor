"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase";
import { User, AuthError } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface UserData {
  id: string;
  phoneNumber: string;
  name: string | null;
  roles: string[];
  activeMode: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function fetchUserData(userId: string) {
    const { data } = await supabase
      .from("User")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (data) {
      setUserData(data as UserData);
    }
    setLoading(false);
  }

  async function signInWithPhone(phone: string) {
    const formattedPhone = phone.startsWith("+88") ? phone : `+88${phone}`;
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });
    if (error) throw error;
  }

  async function verifyOTP(phone: string, token: string) {
    const formattedPhone = phone.startsWith("+88") ? phone : `+88${phone}`;
    
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: token,
      type: "sms",
    });
    
    if (error) throw error;
    
    if (data.user) {
      const { data: existingUser } = await supabase
        .from("User")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (!existingUser) {
        await supabase.from("User").insert({
          id: data.user.id,
          phoneNumber: formattedPhone,
        });
      }
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setUserData(null);
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, signInWithPhone, verifyOTP, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}