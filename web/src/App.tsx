import { useState } from "react";
import { Consent } from "./components/Consent";
import { Chat, type Msg } from "./components/Chat";
import { Summary } from "./components/Summary";
import {
  createSession,
  generateSummary,
  type Session,
  type Summary as SummaryData,
} from "./lib/api";

type Screen = "consent" | "chat" | "summary";

export function App() {
  const [screen, setScreen] = useState<Screen>("consent");
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [phase, setPhase] = useState(0);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    try {
      const s = await createSession();
      setSession(s);
      setMessages([{ role: "assistant", content: s.greeting }]);
      setScreen("chat");
    } catch {
      alert("Impossible de démarrer. Réessaie dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  async function summarize() {
    if (!session) return;
    setLoading(true);
    try {
      const s = await generateSummary(session);
      setSummary(s);
      setScreen("summary");
    } catch {
      alert("Le récap n'a pas pu être généré. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setSession(null);
    setMessages([]);
    setPhase(0);
    setSummary(null);
    setScreen("consent");
  }

  if (screen === "consent") return <Consent onAccept={start} loading={loading} />;
  if (screen === "summary" && summary)
    return <Summary summary={summary} onRestart={restart} />;
  if (screen === "chat" && session)
    return (
      <Chat
        session={session}
        messages={messages}
        setMessages={setMessages}
        onPhase={setPhase}
        canSummarize={phase >= 4 && !loading}
        onSummarize={summarize}
      />
    );

  return <div className="loading">Chargement…</div>;
}
