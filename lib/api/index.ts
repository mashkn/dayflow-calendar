/**
 * Single entry point for the API client.
 * v1: Supabase implementation.
 * v2: Switch to your own backend by exporting createCustomApiClient() here
 *     and using it wherever api is needed.
 */

import { createSupabaseApiClient } from "./supabase";

let apiInstance: ReturnType<typeof createSupabaseApiClient> | null = null;

export function getApi() {
  if (!apiInstance) {
    apiInstance = createSupabaseApiClient();
  }
  return apiInstance;
}

export type { ApiClient } from "./client";
export * from "./client";
