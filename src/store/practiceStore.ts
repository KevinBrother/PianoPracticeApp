import { create } from 'zustand';
import { Sheet, Note, NoteState, PracticeStats } from '../types/music.types';
import InputRecognitionEngine from '../services/InputRecognitionEngine';
import AudioManager from '../services/AudioManager';

interface PracticeState {
  // 当前乐谱
  currentSheet: Sheet | null;

  // 当前音符索引
  currentNoteIndex: number;

  // 所有音符的状态
  noteStates: NoteState[];

  // 统计数据
  stats: PracticeStats;

  // 反馈消息
  feedbackMessage: string;

  // 是否显示反馈
  showFeedback: boolean;

  // Actions
  setCurrentSheet: (sheet: Sheet) => void;
  handleNoteInput: (note: string, octave: number) => Promise<void>;
  resetPractice: () => void;
  updateStats: (isCorrect: boolean) => void;
  hideFeedback: () => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  currentSheet: null,
  currentNoteIndex: 0,
  noteStates: [],
  stats: {
    correctCount: 0,
    incorrectCount: 0,
    totalTime: 0,
  },
  feedbackMessage: '',
  showFeedback: false,

  /**
   * 设置当前练习乐谱
   */
  setCurrentSheet: (sheet: Sheet) => {
    const allNotes = sheet.measures.flatMap(m => m.notes);
    InputRecognitionEngine.setExpectedNotes(allNotes);

    // 初始化音符状态: 第一个为 WAITING，其余为 COMPLETED
    const initialStates = allNotes.map((_, index) =>
      index === 0 ? NoteState.WAITING : NoteState.COMPLETED
    );

    set({
      currentSheet: sheet,
      currentNoteIndex: 0,
      noteStates: initialStates,
      stats: { correctCount: 0, incorrectCount: 0, totalTime: 0 },
      feedbackMessage: '',
      showFeedback: false,
    });
  },

  /**
   * 处理用户输入的音符
   */
  handleNoteInput: async (note: string, octave: number) => {
    const state = get();

    // 播放音符声音
    await AudioManager.playNote(note, octave, 0.3);

    // 验证输入
    const result = InputRecognitionEngine.validateInput(note, octave);

    if (result.success) {
      // 正确
      await AudioManager.playCorrectFeedback();

      // 更新音符状态
      const newStates = [...state.noteStates];
      newStates[state.currentNoteIndex] = NoteState.CORRECT;

      // 如果还有下一个音符，标记为 WAITING
      if (result.nextNoteIndex !== undefined && result.nextNoteIndex < newStates.length) {
        newStates[result.nextNoteIndex] = NoteState.WAITING;
      }

      set({
        currentNoteIndex: result.nextNoteIndex ?? state.currentNoteIndex,
        noteStates: newStates,
        feedbackMessage: result.message,
        showFeedback: true,
      });

      // 更新统计
      state.updateStats(true);

      // 2秒后隐藏反馈
      setTimeout(() => get().hideFeedback(), 2000);
    } else {
      // 错误
      await AudioManager.playIncorrectFeedback();

      // 标记当前音符为错误状态
      const newStates = [...state.noteStates];
      newStates[state.currentNoteIndex] = NoteState.INCORRECT;

      set({
        noteStates: newStates,
        feedbackMessage: result.message,
        showFeedback: true,
      });

      // 更新统计
      state.updateStats(false);

      // 1秒后恢复为 WAITING 状态
      setTimeout(() => {
        const currentState = get();
        const states = [...currentState.noteStates];
        states[currentState.currentNoteIndex] = NoteState.WAITING;
        set({ noteStates: states });
      }, 1000);

      // 3秒后隐藏反馈
      setTimeout(() => get().hideFeedback(), 3000);
    }
  },

  /**
   * 重置练习
   */
  resetPractice: () => {
    const state = get();
    if (state.currentSheet) {
      get().setCurrentSheet(state.currentSheet);
    }
  },

  /**
   * 更新统计数据
   */
  updateStats: (isCorrect: boolean) => {
    set((state) => ({
      stats: {
        ...state.stats,
        correctCount: state.stats.correctCount + (isCorrect ? 1 : 0),
        incorrectCount: state.stats.incorrectCount + (isCorrect ? 0 : 1),
      },
    }));
  },

  /**
   * 隐藏反馈消息
   */
  hideFeedback: () => {
    set({ showFeedback: false });
  },
}));
