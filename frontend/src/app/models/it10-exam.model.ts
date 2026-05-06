export interface It10Option {
  id: number;
  label: string;
  text: string;
}

export interface It10Question {
  id: number;
  question_no: number;
  text: string;
  options: It10Option[];
}

export interface It10ExamResult {
  id: number;
  tester_name: string;
  score: number;
  total_score: number;
  created_at: string;
}
