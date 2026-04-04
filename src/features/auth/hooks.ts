import { useEffect } from "react";
import { getCurrentSession, subscribeToAuthStateChange, toAuthUserSummary } from "@/features/auth/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useRecipeStore } from "@/store/useRecipeStore";

export function useInitializeAuth() {
  const setAuthReady = useRecipeStore((state) => state.setAuthReady);
  const setAuthState = useRecipeStore((state) => state.setAuthState);

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured()) {
      setAuthState(null, null);
      setAuthReady(true);
      return undefined;
    }

    void getCurrentSession()
      .then((session) => {
        if (!isMounted) {
          return;
        }

        setAuthState(session, toAuthUserSummary(session?.user ?? null));
        setAuthReady(true);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setAuthState(null, null);
        setAuthReady(true);
      });

    const subscription = subscribeToAuthStateChange((_event, session) => {
      setAuthState(session, toAuthUserSummary(session?.user ?? null));
      setAuthReady(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setAuthReady, setAuthState]);
}

export function useAuthState() {
  const authReady = useRecipeStore((state) => state.authReady);
  const authSession = useRecipeStore((state) => state.authSession);
  const authUser = useRecipeStore((state) => state.authUser);

  return {
    authReady,
    authSession,
    authUser,
    isAuthenticated: Boolean(authUser),
  };
}
