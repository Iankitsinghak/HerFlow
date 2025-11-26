
"use client";

import { useUser, type UserHookResult } from "@/firebase";

export const useAuth = (): { user: UserHookResult['user']; loading: UserHookResult['isUserLoading']; error: UserHookResult['userError'] } => {
  const { user, isUserLoading, userError } = useUser();
  return { user, loading: isUserLoading, error: userError };
};
