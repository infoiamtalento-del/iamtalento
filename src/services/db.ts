import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The generated `types.ts` predates the platform migrations, so the new tables and RPCs
 * are accessed through an untyped client. Regenerate types with
 * `supabase gen types typescript --project-id <id>` and switch this to `supabase` when ready.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = supabase as unknown as SupabaseClient<any>;

export class BackendError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "BackendError";
  }
}

/** Calls a Postgres function and converts failures into readable errors. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function rpc<T = any>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await db.rpc(fn, args);
  if (error) throw new BackendError(friendlyMessage(error.message, error.code), error.code);
  return data as T;
}

const friendlyMessage = (message: string, code?: string): string => {
  if (code === "28000") return "Please sign in to continue.";
  if (code === "P0402") return message.includes("balance") ? "Your wallet balance is too low." : "Payment is required for this item.";
  if (code === "P0403") return message;
  if (code === "P0410") return "Time is up for this attempt.";
  return message || "Something went wrong. Please try again.";
};

export async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

/** Stable numeric id for UI code that predates UUIDs (48 bits, safe in a JS number). */
export const toNumId = (uuid: string): number => parseInt(uuid.replace(/-/g, "").slice(0, 12), 16);

const registry = new Map<number, string>();
export const registerId = (uuid: string): number => {
  const n = toNumId(uuid);
  registry.set(n, uuid);
  return n;
};
export const uuidFor = (numId: number): string | undefined => registry.get(numId);
