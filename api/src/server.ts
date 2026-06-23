import "dotenv/config";
import { existsSync } from "fs";
import { resolve, join } from "path";
import express from "express";
import cors from "cors";
import { sessionRouter } from "./routes/session";
import { chatRouter } from "./routes/chat";
import { summaryRouter } from "./routes/summary";
import { studentRouter } from "./routes/student";
import { supabaseConfigured } from "./lib/supabase";

const app = express();
app.use(express.json({ limit: "256kb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? "*",
  }),
);

app.get("/health", (_req, res) =>
  res.json({
    ok: true,
    supabaseConfigured,
    aiConfigured: Boolean(
      process.env.OPENROUTER_API_KEY ||
        process.env.OPENROUTER_KEY ||
        process.env.OPENROUTER ||
        process.env.OPENAI_API_KEY,
    ),
    // Diagnostic : noms (jamais valeurs) des variables Supabase/IA détectées.
    detectedEnvKeys: Object.keys(process.env)
      .filter((k) => /supa|service|openrouter|openai|anthropic/i.test(k))
      .sort(),
  }),
);

app.use("/session", sessionRouter);
app.use("/chat", chatRouter);
app.use("/generate-summary", summaryRouter);
app.use("/student", studentRouter);

// Sert le front buildé (web/dist) sur la même origine, avec fallback SPA.
const webDist = [
  resolve(__dirname, "../../web/dist"), // depuis api/dist/server.js -> web/dist
  resolve(process.cwd(), "web/dist"),
  resolve(process.cwd(), "../web/dist"),
].find((p) => existsSync(p));

if (webDist) {
  console.log(`[api] front servi depuis ${webDist}`);
  app.use(express.static(webDist));
  // Toute route GET non-API renvoie l'app (routing côté client).
  app.get("*", (_req, res) => res.sendFile(join(webDist, "index.html")));
} else {
  console.warn("[api] web/dist introuvable — le front n'est pas servi.");
  app.get("/", (_req, res) =>
    res.type("text").send("API en ligne. Front non buildé (web/dist absent)."),
  );
}

const port = Number(process.env.PORT ?? 8787);
app.listen(port, () => {
  console.log(`[api] écoute sur http://localhost:${port}`);
});
