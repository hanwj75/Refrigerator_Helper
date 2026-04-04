import { useState } from "react";
import { signInWithGoogle, signOut } from "@/features/auth/api";
import { useAuthState } from "@/features/auth/hooks";
import { isSupabaseConfigured } from "@/lib/supabase";

const copy = {
  ko: {
    signIn: "Google로 로그인",
    signOut: "로그아웃",
    notConfigured: "Supabase 인증 설정이 필요합니다",
    loading: "로그인 상태를 확인하고 있습니다...",
  },
  en: {
    signIn: "Continue with Google",
    signOut: "Sign out",
    notConfigured: "Supabase auth not configured",
    loading: "Checking session...",
  },
} as const;

type GoogleLoginButtonProps = {
  language: "ko" | "en";
};

export function GoogleLoginButton({ language }: GoogleLoginButtonProps) {
  const { authReady, authUser, isAuthenticated } = useAuthState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentCopy = copy[language];

  if (!isSupabaseConfigured()) {
    return (
      <span className="rounded-full border border-dashed border-stone-300 px-3 py-2 text-xs text-stone-500">
        {currentCopy.notConfigured}
      </span>
    );
  }

  if (!authReady) {
    return (
      <span className="rounded-full border border-stone-200 px-3 py-2 text-xs text-stone-500">
        {currentCopy.loading}
      </span>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className="rounded-full bg-white px-3 py-2 text-xs text-stone-600">
          {authUser?.displayName ?? authUser?.email ?? "Signed in"}
        </span>
        <button
          type="button"
          onClick={() => {
            setIsSubmitting(true);
            void signOut().finally(() => setIsSubmitting(false));
          }}
          disabled={isSubmitting}
          className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {currentCopy.signOut}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setIsSubmitting(true);
        void signInWithGoogle().finally(() => setIsSubmitting(false));
      }}
      disabled={isSubmitting}
      className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {currentCopy.signIn}
    </button>
  );
}
