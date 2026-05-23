export type QuestionType = 'multiple_choice' | 'true_false' | 'code_snippet' | 'mini_game';

export interface QuestStep {
  id: number;
  dialog: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string | number | boolean;
  explanation: string;
  miniGameType?: 'bug_catcher' | 'query_builder';
  gameData?: any;
}
