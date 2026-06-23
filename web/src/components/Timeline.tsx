import { useState } from "react";
import type { Bilan } from "../lib/api";

interface Props {
  bilans: Bilan[];
  pseudonym: string | null;
  onNewBilan: () => void;
}

function frenchDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function Timeline({ bilans, pseudonym, onNewBilan }: Props) {
  const [open, setOpen] = useState<number | null>(
    bilans.length > 0 ? bilans.length - 1 : null,
  );

  return (
    <div className="summary">
      <h1>Ton parcours{pseudonym ? `, ${pseudonym}` : ""} 🧭</h1>

      {bilans.length === 0 ? (
        <p className="hint">
          C'est ton premier point ! Reviens dans un an pour voir comment ça évolue.
        </p>
      ) : (
        <p className="hint">
          {bilans.length} bilan{bilans.length > 1 ? "s" : ""} — du plus ancien au
          plus récent. L'idée n'est pas de coller au passé, mais de voir ce qui
          bouge.
        </p>
      )}

      {bilans.map((b, i) => {
        const p = b.payload;
        const isOpen = open === i;
        return (
          <section key={i} className="timeline-item">
            <button
              className="timeline-head"
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{frenchDate(b.created_at)}</span>
              <span className="moteurs">
                {p.moteurs_principaux.map((m) => m.moteur).join(" · ")}
              </span>
            </button>
            {isOpen && (
              <div className="timeline-body">
                {p.evolution && (
                  <p className="evolution">↪ {p.evolution}</p>
                )}
                <h3>Ce qui ressortait</h3>
                <ul>
                  {p.ce_que_jai_entendu.map((x, k) => (
                    <li key={k}>{x}</li>
                  ))}
                </ul>
                <h3>Pistes évoquées</h3>
                <ul>
                  {[...p.pistes.specialites_premiere, ...p.pistes.voies_post_bac].map(
                    (x, k) => (
                      <li key={k}>{x}</li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </section>
        );
      })}

      <button onClick={onNewBilan}>Refaire le point cette année</button>
    </div>
  );
}
