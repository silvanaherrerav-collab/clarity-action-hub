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
  { id: "area", label: "What area do you lead?", placeholder: "e.g. Logistics, Operations, Retail", type: "text" },
  { id: "role", label: "What is your role/title?", placeholder: "e.g. Regional Manager, VP Operations", type: "text" },
  { id: "teamSize", label: "How many people are on your team?", placeholder: "e.g. 12", type: "number" },
  { id: "dependencies", label: "How many departments depend directly on your team's work?", placeholder: "e.g. 3", type: "number" },
];

export const factors: DiagnosticFactor[] = [
  {
    id: "psychological_safety",
    name: "Psychological Safety",
    description: "How safe do team members feel to take risks and be vulnerable?",
    questions: [
      { id: "ps1", text: "Team members feel comfortable admitting mistakes without fear of consequences." },
      { id: "ps2", text: "People openly share concerns or disagreements during meetings." },
      { id: "ps3", text: "It's safe to ask for help without being judged as incompetent." },
      { id: "ps4", text: "New ideas are welcomed, even if they challenge the status quo." },
      { id: "ps5", text: "No one on the team would deliberately undermine another member's efforts." },
    ],
  },
  {
    id: "dependability",
    name: "Dependability",
    description: "Can team members count on each other to deliver quality work on time?",
    questions: [
      { id: "dp1", text: "Team members consistently meet deadlines and commitments." },
      { id: "dp2", text: "When someone says they'll do something, it gets done." },
      { id: "dp3", text: "Quality standards are maintained even under pressure." },
      { id: "dp4", text: "People take ownership of their responsibilities without needing constant follow-up." },
      { id: "dp5", text: "The team can be relied upon to deliver results consistently." },
    ],
  },
  {
    id: "structure_clarity",
    name: "Structure & Clarity",
    description: "Are roles, plans, and goals clear to everyone?",
    questions: [
      { id: "sc1", text: "Each team member knows exactly what is expected of them." },
      { id: "sc2", text: "Roles and responsibilities are clearly defined and understood." },
      { id: "sc3", text: "The team has clear short-term and long-term goals." },
      { id: "sc4", text: "Processes and workflows are well-documented and followed." },
      { id: "sc5", text: "Decision-making authority is clear — people know who decides what." },
    ],
  },
  {
    id: "work_impact",
    name: "Work Impact",
    description: "Does the team believe their work matters and creates value?",
    questions: [
      { id: "wi1", text: "Team members see how their work contributes to the company's success." },
      { id: "wi2", text: "The team's output has a visible impact on business results." },
      { id: "wi3", text: "People feel their daily tasks are meaningful, not just busywork." },
      { id: "wi4", text: "The team receives recognition for contributions that drive results." },
      { id: "wi5", text: "Members can clearly articulate the value they bring to the organization." },
    ],
  },
  {
    id: "meaning",
    name: "Meaning",
    description: "Do team members find personal purpose in their work?",
    questions: [
      { id: "mn1", text: "People find personal fulfillment in the work they do here." },
      { id: "mn2", text: "Team members feel connected to a purpose beyond just earning a paycheck." },
      { id: "mn3", text: "The team's mission resonates with individual values." },
      { id: "mn4", text: "People feel energized and motivated by the challenges they face." },
      { id: "mn5", text: "Work here allows people to grow in directions that matter to them." },
    ],
  },
  {
    id: "leadership",
    name: "Leadership",
    description: "How effective is the leadership in enabling the team?",
    questions: [
      { id: "ld1", text: "Leadership provides clear direction and communicates priorities effectively." },
      { id: "ld2", text: "Leaders actively remove obstacles that slow the team down." },
      { id: "ld3", text: "Feedback from leadership is frequent, specific, and constructive." },
      { id: "ld4", text: "Leaders trust the team to make decisions within their scope." },
      { id: "ld5", text: "Leadership balances performance expectations with team well-being." },
    ],
  },
];

export interface DiagnosticResults {
  context: Record<string, string>;
  scores: Record<string, number>; // factor_id -> 0-100 score
  answers: Record<string, number>; // question_id -> 1-5 score
}

export function calculateResults(
  context: Record<string, string>,
  answers: Record<string, number>
): DiagnosticResults {
  const scores: Record<string, number> = {};

  for (const factor of factors) {
    const factorAnswers = factor.questions.map((q) => answers[q.id] || 0);
    const avg = factorAnswers.reduce((a, b) => a + b, 0) / factorAnswers.length;
    // Scale from 1-5 to 0-100
    scores[factor.id] = Math.round(((avg - 1) / 4) * 100);
  }

  return { context, scores, answers };
}
