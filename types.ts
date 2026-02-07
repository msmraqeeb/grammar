
export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint: string;
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export type SessionStatus = 'idle' | 'setup' | 'loading' | 'active' | 'finished';

export interface QuizSession {
  topic: Topic;
  count: number;
  currentQuestionIndex: number;
  correctCount: number;
  wrongCount: number;
  questions: Question[];
  isAnswered: boolean;
  selectedOption: number | null;
}
