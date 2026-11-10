import { z } from "https://esm.sh/zod@3.22.4";

export { z };

export async function parseAndValidate<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; errors: z.ZodIssue[] }> {
  try {
    const raw = await req.json();
    const result = schema.safeParse(raw);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, errors: result.error.issues };
  } catch (_e) {
    return {
      success: false,
      errors: [
        {
          code: z.ZodIssueCode.custom,
          path: [],
          message: "Malformed JSON payload",
        },
      ],
    };
  }
}
