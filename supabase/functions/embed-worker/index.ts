import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { getAiClient } from "../_shared/ai.ts";
import { handleCors } from "../_shared/cors.ts";
import { json, serverError } from "../_shared/http.ts";

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const ai = getAiClient();

  try {
    // 1. Fetch pending items from queue
    const { data: queueItems, error: fetchErr } = await supabase
      .from("embedding_queue")
      .select("id, entity, entity_id")
      .is("processed_at", null)
      .limit(20);

    if (fetchErr) throw fetchErr;
    if (!queueItems || queueItems.length === 0) {
      return json({ processed: 0, message: "Queue empty" }, 200, req);
    }

    let processedCount = 0;

    for (const item of queueItems) {
      try {
        if (item.entity === "job") {
          const { data: job } = await supabase
            .from("employer_job_openings")
            .select("id, designation, skills, job_description, source_hash")
            .eq("id", item.entity_id)
            .maybeSingle();

          if (job) {
            const content = `${job.designation ?? ""} ${(job.skills ?? []).join(" ")} ${job.job_description ?? ""}`.trim();
            const encoder = new TextEncoder();
            const data = encoder.encode(content);
            const hashBuffer = await crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const currentHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

            if (job.source_hash !== currentHash) {
              const [embedding] = await ai.embed([content]);
              await supabase
                .from("employer_job_openings")
                .update({
                  jd_embedding: embedding,
                  source_hash: currentHash,
                  embedding_model: "text-embedding-004",
                })
                .eq("id", job.id);
            }
          }
        }

        // Mark item as processed
        await supabase
          .from("embedding_queue")
          .update({ processed_at: new Date().toISOString() })
          .eq("id", item.id);

        processedCount++;
      } catch (itemErr: unknown) {
        const errorMsg = itemErr instanceof Error ? itemErr.message : String(itemErr);
        await supabase
          .from("embedding_queue")
          .update({
            attempts: 1,
            error: errorMsg,
          })
          .eq("id", item.id);
      }
    }

    return json({ processed: processedCount }, 200, req);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return serverError(`Embedding worker failed: ${errorMsg}`, req);
  }
});
