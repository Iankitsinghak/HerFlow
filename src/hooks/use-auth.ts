
"use client";

import { AuthContext } from "@/components/auth-provider";
import { useContext } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  // The context now provides { user, isUserLoading, userError }
  // To keep it compatible with the old useAuth that returned { user, loading }
  // we can remap it here.
  return { user: context.user, loading: context.isUserLoading, error: context.userError };
};
