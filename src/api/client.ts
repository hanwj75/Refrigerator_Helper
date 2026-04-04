import { env } from "@/lib/env";

type RequestOptions = RequestInit & {
  path: string;
};

export async function apiClient<T>({ path, headers, ...init }: RequestOptions): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
    throw new Error(errorBody?.error ?? errorBody?.message ?? `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
