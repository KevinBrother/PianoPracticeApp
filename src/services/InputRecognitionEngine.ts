import { Note, ValidationResult } from '../types/music.types';
import { areNotesEqual } from '../utils/musicUtils';

/**
 * 输入识别引擎
 * 负责验证用户输入的音符是否正确
 */
export class InputRecognitionEngine {
  private currentNoteIndex: number = 0;
  private expectedNotes: Note[] = [];

  /**
   * 设置期望的音符序列
   */
  setExpectedNotes(notes: Note[]) {
    this.expectedNotes = notes;
    this.currentNoteIndex = 0;
  }

  /**
   * 验证用户输入的音符
   */
  validateInput(inputNote: string, inputOctave: number): ValidationResult {
    // 检查是否还有未完成的音符
    if (this.currentNoteIndex >= this.expectedNotes.length) {
      return {
        success: false,
        message: '练习已完成！',
      };
    }

    const expected = this.expectedNotes[this.currentNoteIndex];
    const input = { pitch: inputNote, octave: inputOctave };
    const expectedPitch = { pitch: expected.pitch, octave: expected.octave };

    // 比较音符
    if (areNotesEqual(input, expectedPitch)) {
      this.currentNoteIndex++;

      const isLastNote = this.currentNoteIndex >= this.expectedNotes.length;

      return {
        success: true,
        message: isLastNote ? '太棒了！全部完成！' : '正确！',
        nextNoteIndex: this.currentNoteIndex,
      };
    } else {
      return {
        success: false,
        message: `不对哦！期望 ${expected.pitch}${expected.octave}，你弹的是 ${inputNote}${inputOctave}`,
        correctNote: expected,
      };
    }
  }

  /**
   * 获取当前进度百分比
   */
  getCurrentProgress(): number {
    if (this.expectedNotes.length === 0) return 0;
    return (this.currentNoteIndex / this.expectedNotes.length) * 100;
  }

  /**
   * 获取当前应该弹奏的音符索引
   */
  getCurrentNoteIndex(): number {
    return this.currentNoteIndex;
  }

  /**
   * 重置进度
   */
  reset() {
    this.currentNoteIndex = 0;
  }

  /**
   * 是否已完成
   */
  isCompleted(): boolean {
    return this.currentNoteIndex >= this.expectedNotes.length;
  }

  /**
   * 获取剩余音符数量
   */
  getRemainingNotes(): number {
    return Math.max(0, this.expectedNotes.length - this.currentNoteIndex);
  }
}

export default new InputRecognitionEngine();
