import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { useInitializeAuth } from "@/features/auth/hooks";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthBootstrapper() {
  useInitializeAuth();
  return null;
}

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrapper />
      {children}
    </QueryClientProvider>
  );
}
