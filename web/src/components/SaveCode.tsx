interface Props {
  code: string;
  onContinue: () => void;
}

// Affiché une fois, juste après la création d'un profil : l'élève doit noter son code.
export function SaveCode({ code, onContinue }: Props) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard indisponible */
    }
  }

  return (
    <div className="consent">
      <div className="consent-card">
        <h1>Garde bien ce code 🔑</h1>
        <p>
          C'est lui qui te permettra de revenir l'an prochain et de voir comment tu
          as évolué. Note-le quelque part (ou prends une capture d'écran).
        </p>
        <div className="code-display" onClick={copy} title="Copier">
          {code}
        </div>
        <p className="hint">
          Il est aussi gardé sur cet appareil — mais si tu changes de téléphone,
          c'est ce code qu'il te faudra.
        </p>
        <button onClick={onContinue}>C'est noté, on commence</button>
      </div>
    </div>
  );
}
