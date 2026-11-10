import { handleCors } from "../_shared/cors.ts";
import { json, badRequest, unauthorized, forbidden, serverError } from "../_shared/http.ts";
import { requireUser, requireRole, HttpAuthError } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== "POST") {
    return badRequest("Method not allowed", req);
  }

  // 1. Enforce Authentication & Role
  let authCtx;
  try {
    authCtx = await requireUser(req);
    await requireRole(authCtx, ["employer"]);
  } catch (err) {
    if (err instanceof HttpAuthError) {
      if (err.status === 401) return unauthorized(err.message, req);
      if (err.status === 403) return forbidden(err.message, req);
    }
    return unauthorized("Authentication required", req);
  }

  try {
    // 2. Validate & Cap Request Body
    const body = await req.json().catch(() => ({}));
    const rawSkills = Array.isArray(body.skills) ? body.skills : [];
    const skills = rawSkills
      .filter((s: unknown) => typeof s === "string" && s.trim().length > 0)
      .slice(0, 20); // Cap at 20 skills

    const domain = typeof body.domain === "string" && body.domain.trim().length > 0
      ? body.domain.trim().slice(0, 100)
      : "Software Engineering";

    const experience_level = typeof body.experience_level === "string"
      ? body.experience_level.trim().slice(0, 50)
      : "Senior";

    // Cap question count to max 30 (min 1)
    const count = Math.min(Math.max(1, Number(body.num_questions) || 10), 30);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return json({ error: "AI gateway service not configured" }, 503, req);
    }

    const skillList = skills.join(", ") || "General Technical Skills";

    const systemPrompt = `You are an expert technical assessment generator for the "${domain}" domain. Generate exactly ${count} multiple-choice questions to test skills in: ${skillList}. Experience level: ${experience_level}.

RULES:
- Each question must test practical, applied knowledge (not trivia)
- Include a mix of difficulty levels: 30% easy, 40% medium, 30% hard
- Each question has exactly 4 options with ONE correct answer
- Questions should be scenario-based when possible
- Include the skill being tested and difficulty level for each question

You MUST respond using the generate_questions tool.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate ${count} assessment questions for: ${skillList}. Domain: ${domain}. Level: ${experience_level}.` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_questions",
              description: "Return assessment questions as structured data",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number", description: "Question number starting from 1" },
                        question: { type: "string", description: "The question text" },
                        options: {
                          type: "array",
                          items: { type: "string" },
                          description: "Exactly 4 answer options",
                        },
                        correct_index: { type: "number", description: "Index of correct answer (0-3)" },
                        skill: { type: "string", description: "The skill being tested" },
                        difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
                        explanation: { type: "string", description: "Brief explanation of the correct answer" },
                      },
                      required: ["id", "question", "options", "correct_index", "skill", "difficulty", "explanation"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["questions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_questions" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return json({ error: "Rate limit exceeded. Please try again later." }, 429, req);
      }
      if (response.status === 402) {
        return json({ error: "Usage limit reached. Please add credits." }, 402, req);
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return json({ error: "AI generation service temporarily unavailable" }, 502, req);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return json({ error: "Invalid response format from AI model" }, 502, req);
    }

    const questions = JSON.parse(toolCall.function.arguments);
    return json(questions, 200, req);
  } catch (e) {
    return serverError(e, req);
  }
});
