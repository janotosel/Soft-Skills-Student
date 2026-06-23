import type { Summary as SummaryData } from "../lib/api";

interface Props {
  summary: SummaryData;
  onRestart: () => void;
  onViewTimeline?: () => void; // présent si l'élève a un profil de suivi
}

export function Summary({ summary, onRestart, onViewTimeline }: Props) {
  return (
    <div className="summary">
      <h1>Ton récap 📝</h1>

      {summary.evolution && (
        <section className="evolution-card">
          <h2>Depuis la dernière fois</h2>
          <p>{summary.evolution}</p>
        </section>
      )}

      <section>
        <h2>Ce que j'ai entendu</h2>
        <ul>
          {summary.ce_que_jai_entendu.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Tes moteurs principaux</h2>
        <ul>
          {summary.moteurs_principaux.map((m, i) => (
            <li key={i}>
              <strong>{m.moteur}</strong> — {m.illustration}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Pistes à explorer</h2>
        <p className="hint">Des hypothèses à creuser, pas des décisions.</p>
        {summary.pistes.specialites_premiere.length > 0 && (
          <>
            <h3>Spécialités de première</h3>
            <ul>
              {summary.pistes.specialites_premiere.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </>
        )}
        {summary.pistes.voies_post_bac.length > 0 && (
          <>
            <h3>Après le bac</h3>
            <ul>
              {summary.pistes.voies_post_bac.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2>Pour aller plus loin</h2>
        <ul>
          {summary.pour_aller_plus_loin.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section>

      <p className="disclaimer">{summary.disclaimer}</p>

      {onViewTimeline && (
        <button onClick={onViewTimeline}>Voir tout mon parcours 🧭</button>
      )}
      <button className="secondary" onClick={onRestart}>
        Revenir à l'accueil
      </button>
    </div>
  );
}
