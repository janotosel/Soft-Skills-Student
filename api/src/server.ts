import "dotenv/config";
import express from "express";
import cors from "cors";
import { sessionRouter } from "./routes/session";
import { chatRouter } from "./routes/chat";
import { summaryRouter } from "./routes/summary";
import { studentRouter } from "./routes/student";

const app = express();
app.use(express.json({ limit: "256kb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? "*",
  }),
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/session", sessionRouter);
app.use("/chat", chatRouter);
app.use("/generate-summary", summaryRouter);
app.use("/student", studentRouter);

const port = Number(process.env.PORT ?? 8787);
app.listen(port, () => {
  console.log(`[api] écoute sur http://localhost:${port}`);
});
