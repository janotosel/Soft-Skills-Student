import { useEffect, useState } from "react";
import { Consent } from "./components/Consent";
import { Identity } from "./components/Identity";
import { SaveCode } from "./components/SaveCode";
import { Timeline } from "./components/Timeline";
import { Chat, type Msg } from "./components/Chat";
import { Summary } from "./components/Summary";
import {
  createSession,
  generateSummary,
  fetchTimeline,
  type Session,
  type Student,
  type Bilan,
  type Summary as SummaryData,
} from "./lib/api";
import { loadStudent, saveStudent, clearStudent } from "./lib/storage";

type Screen =
  | "consent"
  | "identity"
  | "savecode"
  | "timeline"
  | "chat"
  | "summary";

export function App() {
  const [screen, setScreen] = useState<Screen>("consent");
  const [student, setStudent] = useState<Student | null>(null);
  const [knownStudent, setKnownStudent] = useState<Student | null>(null);
  const [bilans, setBilans] = useState<Bilan[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [phase, setPhase] = useState(0);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setKnownStudent(loadStudent());
  }, []);

  async function startSession(forStudent: Student | null) {
    setLoading(true);
    try {
      const s = await createSession(forStudent);
      setSession(s);
      setMessages([{ role: "assistant", content: s.greeting }]);
      setPhase(0);
      setSummary(null);
      setScreen("chat");
    } catch {
      alert("Impossible de démarrer. Réessaie dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  function onIdentityReady(s: Student | null, isNew: boolean) {
    setStudent(s);
    if (s) {
      saveStudent(s);
      setKnownStudent(s);
      setBilans(s.bilans ?? []);
    }
    if (s && isNew) {
      setScreen("savecode");
    } else if (s && (s.bilans?.length ?? 0) > 0) {
      setScreen("timeline");
    } else {
      void startSession(s);
    }
  }

  async function summarize() {
    if (!session) return;
    setLoading(true);
    try {
      const result = await generateSummary(session);
      setSummary(result);
      setScreen("summary");
    } catch {
      alert("Le récap n'a pas pu être généré. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  async function viewTimeline() {
    if (!student) return;
    setLoading(true);
    try {
      const list = await fetchTimeline(student);
      setBilans(list);
      setScreen("timeline");
    } catch {
      alert("Impossible de charger ton parcours.");
    } finally {
      setLoading(false);
    }
  }

  function backToHome() {
    setSession(null);
    setMessages([]);
    setPhase(0);
    setSummary(null);
    setScreen("identity");
  }

  // --- Rendu par écran ---
  if (screen === "consent")
    return <Consent onAccept={() => setScreen("identity")} loading={false} />;

  if (screen === "identity")
    return (
      <Identity
        known={knownStudent}
        onReady={onIdentityReady}
      />
    );

  if (screen === "savecode" && student)
    return (
      <SaveCode code={student.accessCode} onContinue={() => startSession(student)} />
    );

  if (screen === "timeline" && student)
    return (
      <Timeline
        bilans={bilans}
        pseudonym={student.pseudonym}
        onNewBilan={() => startSession(student)}
      />
    );

  if (screen === "summary" && summary)
    return (
      <Summary
        summary={summary}
        onRestart={() => {
          if (!student) clearStudent();
          backToHome();
        }}
        onViewTimeline={student ? viewTimeline : undefined}
      />
    );

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
