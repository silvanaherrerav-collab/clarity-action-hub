export interface DiagnosticQuestion {
  id: string;
  text: string;
}

export interface DiagnosticFactor {
  id: string;
  name: string;
  description: string;
  questions: DiagnosticQuestion[];
}

export interface ContextQuestion {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "number";
}

export const contextQuestions: ContextQuestion[] = [
  { id: "area", label: "¿Qué área lideras?", placeholder: "Ej. Logística, Operaciones, Retail", type: "text" },
  { id: "role", label: "¿Cuál es tu rol o título?", placeholder: "Ej. Gerente Regional, VP Operaciones", type: "text" },
  { id: "teamSize", label: "¿Cuántas personas hay en tu equipo?", placeholder: "Ej. 12", type: "number" },
  { id: "dependencies", label: "¿Cuántos departamentos dependen directamente del trabajo de tu equipo?", placeholder: "Ej. 3", type: "number" },
];

export const factors: DiagnosticFactor[] = [
  {
    id: "psychological_safety",
    name: "Seguridad Psicológica",
    description: "En este equipo las personas pueden expresarse sin miedo.",
    questions: [
      { id: "ps1", text: "En este equipo puedo expresar desacuerdos sin temor a consecuencias negativas." },
      { id: "ps2", text: "Cuando cometo un error, no se usa en mi contra." },
      { id: "ps3", text: "Las ideas nuevas son bien recibidas." },
      { id: "ps4", text: "Puedo hacer preguntas sin sentir que quedo mal." },
      { id: "ps5", text: "Los conflictos se hablan de forma abierta." },
    ],
  },
  {
    id: "structure_clarity",
    name: "Estructura y Claridad",
    description: "El equipo sabe qué hacer, quién lo hace y cuándo.",
    questions: [
      { id: "sc1", text: "Tengo claridad sobre mis responsabilidades." },
      { id: "sc2", text: "Sé cómo se mide mi desempeño." },
      { id: "sc3", text: "Las prioridades del equipo están claras." },
      { id: "sc4", text: "Las tareas tienen responsables definidos." },
      { id: "sc5", text: "Entiendo cómo mi trabajo contribuye a los objetivos del área." },
    ],
  },
  {
    id: "dependability",
    name: "Confiabilidad",
    description: "Las personas cumplen lo que prometen.",
    questions: [
      { id: "dp1", text: "Mi equipo cumple los compromisos acordados." },
      { id: "dp2", text: "Los entregables se realizan a tiempo." },
      { id: "dp3", text: "Si alguien no puede cumplir, lo comunica." },
      { id: "dp4", text: "Existe seguimiento real a los acuerdos." },
      { id: "dp5", text: "Se corrigen los errores sin repetirlos constantemente." },
    ],
  },
  {
    id: "work_impact",
    name: "Impacto",
    description: "El trabajo genera resultados reales.",
    questions: [
      { id: "wi1", text: "Mi trabajo impacta directamente en los resultados del área." },
      { id: "wi2", text: "Las metas del equipo están alineadas con el negocio." },
      { id: "wi3", text: "Veo resultados concretos de nuestro trabajo." },
      { id: "wi4", text: "Sabemos qué indicadores afectan más al negocio." },
      { id: "wi5", text: "Cuando mejoramos algo, se refleja en resultados." },
    ],
  },
  {
    id: "meaning",
    name: "Significado",
    description: "El trabajo tiene sentido y propósito.",
    questions: [
      { id: "mn1", text: "Mi trabajo es importante para la organización." },
      { id: "mn2", text: "Me siento orgulloso(a) de lo que hace mi equipo." },
      { id: "mn3", text: "Entiendo el propósito de lo que hacemos." },
      { id: "mn4", text: "Siento que aporto valor." },
      { id: "mn5", text: "Me motiva contribuir al crecimiento del equipo." },
    ],
  },
  {
    id: "leadership",
    name: "Liderazgo",
    description: "El liderazgo impulsa el desempeño y la cultura.",
    questions: [
      { id: "ld1", text: "Mi líder comunica con claridad las prioridades." },
      { id: "ld2", text: "Recibo retroalimentación útil." },
      { id: "ld3", text: "Mi líder actúa cuando el desempeño baja." },
      { id: "ld4", text: "Las decisiones del líder son coherentes con los valores del equipo." },
      { id: "ld5", text: "Confío en el criterio de mi líder." },
    ],
  },
];

export interface DiagnosticResults {
  context: Record<string, string>;
  scores: Record<string, number>; // factor_id -> 0-100 score
  answers: Record<string, number>; // question_id -> 1-5 score
  overallScore: number;
}

export function calculateResults(
  context: Record<string, string>,
  answers: Record<string, number>
): DiagnosticResults {
  const scores: Record<string, number> = {};

  for (const factor of factors) {
    const factorAnswers = factor.questions.map((q) => answers[q.id] || 0);
    const avg = factorAnswers.reduce((a, b) => a + b, 0) / factorAnswers.length;
    // Scale from 1-5 to 0-100: ((avg - 1) / 4) * 100
    scores[factor.id] = Math.round(((avg - 1) / 4) * 100);
  }

  const scoreValues = Object.values(scores);
  const overallScore = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);

  return { context, scores, answers, overallScore };
}
