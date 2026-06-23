import { useEffect, useRef, useState } from "react";
import { streamChat, type Session } from "../lib/api";

export interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  session: Session;
  messages: Msg[];
  setMessages: React.Dispatch<React.SetStateAction<Msg[]>>;
  onPhase: (phase: number) => void;
  canSummarize: boolean;
  onSummarize: () => void;
}

export function Chat({
  session,
  messages,
  setMessages,
  onPhase,
  canSummarize,
  onSummarize,
}: Props) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "" }]);

    try {
      const phase = await streamChat(session, text, (delta) => {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + delta,
          };
          return copy;
        });
      });
      onPhase(phase);
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Oups, un souci de connexion. Tu peux réessayer ?",
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chat">
      <div className="messages" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.content || <span className="typing">…</span>}
          </div>
        ))}
      </div>

      {canSummarize && (
        <div className="summarize-cta">
          <button onClick={onSummarize}>📝 Voir mon récap</button>
        </div>
      )}

      <div className="composer">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Écris ta réponse…"
          rows={1}
          disabled={busy}
        />
        <button onClick={send} disabled={busy || !input.trim()}>
          Envoyer
        </button>
      </div>
    </div>
  );
}
