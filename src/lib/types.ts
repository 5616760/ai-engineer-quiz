// 数据类型定义 —— 与 PRD §5 对齐

export type QuestionType = 'single' | 'multiple' | 'judge';
export type Topic =
  | 'ethics'    // AI 伦理 / 数据合规
  | 'ml'        // 机器学习基础
  | 'cv'        // 计算机视觉
  | 'nlp'       // 自然语言处理
  | 'dl'        // Python / PyTorch（深度学习）
  | 'tooling';  // Jupyter / 工程实践

export const TOPIC_LABEL: Record<Topic, string> = {
  ethics: 'AI 伦理 / 数据合规',
  ml: '机器学习基础',
  cv: '计算机视觉',
  nlp: '自然语言处理',
  dl: 'Python / PyTorch',
  tooling: '工程实践',
};

export const TYPE_LABEL: Record<QuestionType, string> = {
  single: '单选',
  multiple: '多选',
  judge: '判断',
};

export interface TheoryQuestion {
  id: number;
  type: QuestionType;
  topic: Topic;
  stem: string;
  options?: { key: string; text: string }[];
  answer: string[];
  explanation: string;
  keywords?: string[];
}

// 代码题：选段补全
export interface FillBlankQuestion {
  id: string;
  paper: 1 | 2 | 3;
  no: number;
  prompt: string;
  blanks: number;             // 填空数量 1 或 2
  options: { key: string; text: string }[];
  answer: string;             // 单空=A; 双空=AB
  explanation: string;
  topic: 'seed' | 'loss' | 'text' | 'image' | 'device' | 'io';
}

// 代码题：工具箱选编号（速查表形态）
export interface ToolboxGroup {
  id: string;                       // 'A' | 'N' | 'C' | 'E'
  title: string;                    // 'AI 共性技术工具箱'
  items: { code: string; label: string }[];
}

export interface ToolboxAnswer {
  no: number;                       // 题号
  paper: 4 | 5 | 6;
  groupId: string;                  // 'A' | 'N' | 'C' | 'E'
  code: string;                     // 正确编号 A1
  label: string;                    // 正确代码片段
  hint: string;                     // 题目中提示
}

export interface ToolboxPaper {
  paper: 4 | 5 | 6;
  title: string;                    // 业务场景
  scenario: string;                 // 题目背景描述
  answers: ToolboxAnswer[];
  toolbox: ToolboxGroup[];
}

// 速记卡
export interface CheatCard {
  id: string;
  title: string;
  body: string;
  tags?: string[];
}

// 比赛信息
export interface ContestInfo {
  examDate: string;
  examTimeTheory: string;
  examTimePractice: string;
  location: string;
  format: string;
  noElectronics: string;
  earlyEntry: string;
  lateCancel: string;
  earlyLeave: string;
  idRequired: string;
  schedule: { team: string; theory: string; practice: string }[];
  rules: { id: number; text: string }[];
  examBreakdown?: {
    theory: { single: number; multiple: number; judge: number; total: number };
    practice: { sets: number; questionsPerSet: number };
  };
}