
"use client";

import { createContext, ReactNode } from "react";
import { User } from "firebase/auth";
import { useUser, type UserHookResult } from "@/firebase/provider";


export const AuthContext = createContext<UserHookResult | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const userState = useUser();

  return (
    <AuthContext.Provider value={userState}>
        {children}
    </AuthContext.Provider>
  );
}
