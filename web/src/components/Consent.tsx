interface Props {
  onAccept: () => void;
  loading: boolean;
}

// Bandeau de transparence RGPD mineur (brief §10).
export function Consent({ onAccept, loading }: Props) {
  return (
    <div className="consent">
      <div className="consent-card">
        <h1>Avant de commencer 👋</h1>
        <p>
          On va discuter une quinzaine de minutes de ce qui te plaît et de comment
          tu fonctionnes, pour t'aider à y voir plus clair sur ton orientation.
        </p>
        <ul>
          <li>Ce n'est <strong>pas un test</strong> : pas de note, pas de profil.</li>
          <li>C'est <strong>anonyme</strong> : on ne te demande ni ton nom ni ton email.</li>
          <li>
            Ce qu'on se dit sert juste à te préparer un <strong>récap</strong> à la fin,
            et c'est <strong>supprimé automatiquement au bout de 30 jours</strong>.
          </li>
          <li>
            Si tu traverses un moment difficile, cet outil n'est pas fait pour ça —
            il te réorientera vers des personnes de confiance.
          </li>
        </ul>
        <button onClick={onAccept} disabled={loading}>
          {loading ? "Un instant…" : "C'est parti"}
        </button>
      </div>
    </div>
  );
}
