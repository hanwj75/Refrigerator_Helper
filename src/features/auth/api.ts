import type { AuthChangeEvent, Session, Subscription, User } from "@supabase/supabase-js";
import type { AuthUserSummary } from "@/store/useRecipeStore";
import { getSupabaseClient } from "@/lib/supabase";

export function toAuthUserSummary(user: User | null): AuthUserSummary | null {
  if (!user) {
    return null;
  }

  const metadata = user.user_metadata ?? {};

  return {
    id: user.id,
    email: user.email ?? null,
    displayName:
      metadata.full_name ??
      metadata.name ??
      (typeof user.email === "string" ? user.email.split("@")[0] : null) ??
      null,
    avatarUrl: metadata.avatar_url ?? metadata.picture ?? null,
  };
}

export async function signInWithGoogle() {
  const redirectTo = `${window.location.origin}/`;
  const { data, error } = await getSupabaseClient().auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await getSupabaseClient().auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getCurrentSession() {
  const { data, error } = await getSupabaseClient().auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function getCurrentUser() {
  const { data, error } = await getSupabaseClient().auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}

export function subscribeToAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
): Subscription {
  const {
    data: { subscription },
  } = getSupabaseClient().auth.onAuthStateChange(callback);

  return subscription;
}
