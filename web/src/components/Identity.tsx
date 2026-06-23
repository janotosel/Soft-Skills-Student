import { useState } from "react";
import { createStudent, resumeStudent, type Student } from "../lib/api";

interface Props {
  // Élève reconnu sur cet appareil (localStorage), s'il existe.
  known: Student | null;
  // isNew = profil tout juste créé (→ afficher le code à conserver).
  onReady: (student: Student | null, isNew: boolean) => void;
}

type Mode = "choice" | "code";

export function Identity({ known, onReady }: Props) {
  const [mode, setMode] = useState<Mode>("choice");
  const [code, setCode] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function startNew() {
    setBusy(true);
    setError("");
    try {
      const s = await createStudent(pseudo.trim() || undefined);
      onReady(s, true);
    } catch {
      setError("Souci de connexion. Réessaie.");
    } finally {
      setBusy(false);
    }
  }

  async function resume() {
    setBusy(true);
    setError("");
    try {
      const s = await resumeStudent(code);
      onReady(s, false);
    } catch (e) {
      setError(
        (e as Error).message === "code_inconnu"
          ? "Ce code n'existe pas. Vérifie-le bien (sans espaces)."
          : "Souci de connexion. Réessaie.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="consent">
      <div className="consent-card">
        <h1>On y va 🚀</h1>

        {known && (
          <button
            className="known"
            onClick={() => onReady(known, false)}
            disabled={busy}
          >
            Continuer en tant que <strong>{known.pseudonym || known.accessCode}</strong>
          </button>
        )}

        {mode === "choice" && (
          <>
            <p>Tu veux qu'on garde une trace pour suivre ton évolution d'une année sur l'autre ?</p>
            <div className="field">
              <label htmlFor="pseudo">Un surnom (facultatif, pas ton vrai nom)</label>
              <input
                id="pseudo"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="ex: Le_Capitaine"
                maxLength={30}
              />
            </div>
            <button onClick={startNew} disabled={busy}>
              {busy ? "…" : "Créer mon profil de suivi"}
            </button>
            <button className="link" onClick={() => setMode("code")} disabled={busy}>
              J'ai déjà un code
            </button>
            <button className="link" onClick={() => onReady(null, false)} disabled={busy}>
              Juste essayer une fois (sans suivi)
            </button>
          </>
        )}

        {mode === "code" && (
          <>
            <p>Entre le code que tu avais gardé la dernière fois :</p>
            <div className="field">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="XXXX-XXXX"
                autoCapitalize="characters"
              />
            </div>
            <button onClick={resume} disabled={busy || !code.trim()}>
              {busy ? "…" : "Reprendre mon suivi"}
            </button>
            <button className="link" onClick={() => setMode("choice")} disabled={busy}>
              ← Retour
            </button>
          </>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
