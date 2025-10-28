// 音符定义
export interface Note {
  id: string;
  pitch: string; // 音高 (C, D, E, F, G, A, B)
  duration: number; // 时值 (1=全音符, 0.5=二分音符, 0.25=四分音符)
  octave: number; // 八度 (4 表示中央 C 所在的八度)
  accidental?: 'sharp' | 'flat' | 'natural'; // 升降记号
}

// 五线谱配置
export interface StaffConfig {
  clef: 'treble' | 'bass'; // 高音谱号或低音谱号
  keySignature: string; // 调号 (如 'C', 'G', 'F')
  timeSignature: [number, number]; // 拍号 [4, 4]
}

// 小节
export interface Measure {
  notes: Note[];
}

// 乐谱数据
export interface Sheet {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  config: StaffConfig;
  measures: Measure[];
}

// 音符状态
export enum NoteState {
  WAITING = 'waiting', // 等待弹奏
  CORRECT = 'correct', // 正确
  INCORRECT = 'incorrect', // 错误
  COMPLETED = 'completed' // 已完成
}

// 验证结果
export interface ValidationResult {
  success: boolean;
  message: string;
  nextNoteIndex?: number;
  correctNote?: Note;
}

// 练习进度
export interface PracticeProgress {
  sheetId: string;
  completedNotes: number;
  totalNotes: number;
  accuracy: number;
  lastPracticeDate: Date;
}

// 钢琴键
export interface PianoKey {
  id: string;
  note: string;
  octave: number;
  isBlack: boolean;
  frequency: number;
}

// 统计数据
export interface PracticeStats {
  correctCount: number;
  incorrectCount: number;
  totalTime: number;
}
