import type { Student } from "./api";

const KEY = "soft_skills_student";

// On garde le profil élève (code + token) en local pour un retour fluide sur le même appareil.
// Aucune donnée personnelle réelle : juste un identifiant pseudonyme.
export function saveStudent(student: Student): void {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        studentId: student.studentId,
        token: student.token,
        accessCode: student.accessCode,
        pseudonym: student.pseudonym,
      }),
    );
  } catch {
    /* localStorage indisponible : on continue sans persistance */
  }
}

export function loadStudent(): Student | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Student) : null;
  } catch {
    return null;
  }
}

export function clearStudent(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* no-op */
  }
}
