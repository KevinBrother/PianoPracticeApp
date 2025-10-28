import { Note, PianoKey } from '../types/music.types';

// 音符频率对照表 (基于 A4 = 440Hz)
const NOTE_FREQUENCIES: { [key: string]: number } = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88,
};

/**
 * 计算音符的频率
 */
export function getNoteFrequency(pitch: string, octave: number): number {
  const baseFreq = NOTE_FREQUENCIES[pitch];
  if (!baseFreq) return 440; // 默认 A4

  // 根据八度调整频率 (以 octave 4 为基准)
  const octaveMultiplier = Math.pow(2, octave - 4);
  return baseFreq * octaveMultiplier;
}

/**
 * 计算音符在五线谱上的位置索引
 * 返回值表示音符相对于五线谱中间线的位置
 */
export function getNoteIndexOnStaff(pitch: string, octave: number, clef: 'treble' | 'bass'): number {
  const noteOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const pitchIndex = noteOrder.indexOf(pitch);

  if (pitchIndex === -1) return 0;

  // 计算相对于 C4 的半音数
  let index = pitchIndex + (octave * 7);

  // 根据谱号调整基准线
  if (clef === 'treble') {
    // 高音谱号: 中间线是 B4
    index = index - 30; // C4 = 28, B4 = 34
  } else {
    // 低音谱号: 中间线是 D3
    index = index - 16; // D3 = 16
  }

  return index;
}

/**
 * 生成钢琴键盘数据
 * @param octaves 生成多少个八度
 * @param startOctave 起始八度 (默认从 C4 开始)
 */
export function generatePianoKeys(octaves: number = 2, startOctave: number = 4): PianoKey[] {
  const keys: PianoKey[] = [];
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotes = ['C#', 'D#', '', 'F#', 'G#', 'A#', '']; // E# 和 B# 不存在

  for (let octave = startOctave; octave < startOctave + octaves; octave++) {
    for (let i = 0; i < whiteNotes.length; i++) {
      const note = whiteNotes[i];
      const frequency = getNoteFrequency(note, octave);

      // 添加白键
      keys.push({
        id: `${note}${octave}`,
        note,
        octave,
        isBlack: false,
        frequency,
      });

      // 添加黑键 (如果存在)
      const blackNote = blackNotes[i];
      if (blackNote) {
        const blackFreq = getNoteFrequency(blackNote, octave);
        keys.push({
          id: `${blackNote}${octave}`,
          note: blackNote,
          octave,
          isBlack: true,
          frequency: blackFreq,
        });
      }
    }
  }

  return keys;
}

/**
 * 计算音符在屏幕上的 X 坐标
 */
export function calculateNoteXPosition(noteIndex: number, measureWidth: number, notesPerMeasure: number): number {
  const spacing = measureWidth / (notesPerMeasure + 1);
  return spacing * (noteIndex + 1);
}

/**
 * 计算音符在五线谱上的 Y 坐标
 */
export function calculateNoteYPosition(note: Note, config: { clef: 'treble' | 'bass' }, staffCenterY: number, lineSpacing: number): number {
  const index = getNoteIndexOnStaff(note.pitch, note.octave, config.clef);
  // 五线谱从上往下，索引越大 Y 越小
  return staffCenterY - (index * lineSpacing / 2);
}

/**
 * 比较两个音符是否相同
 */
export function areNotesEqual(note1: { pitch: string; octave: number }, note2: { pitch: string; octave: number }): boolean {
  return note1.pitch === note2.pitch && note1.octave === note2.octave;
}

/**
 * 生成简单的练习乐谱
 */
export function generateSimpleSheet(): any {
  const notes: Note[] = [
    { id: '1', pitch: 'C', octave: 4, duration: 1 },
    { id: '2', pitch: 'D', octave: 4, duration: 1 },
    { id: '3', pitch: 'E', octave: 4, duration: 1 },
    { id: '4', pitch: 'F', octave: 4, duration: 1 },
    { id: '5', pitch: 'G', octave: 4, duration: 1 },
    { id: '6', pitch: 'A', octave: 4, duration: 1 },
    { id: '7', pitch: 'B', octave: 4, duration: 1 },
    { id: '8', pitch: 'C', octave: 5, duration: 1 },
  ];

  return {
    id: 'simple-1',
    title: '简单练习 - C大调音阶',
    difficulty: 'beginner',
    config: {
      clef: 'treble',
      keySignature: 'C',
      timeSignature: [4, 4],
    },
    measures: [
      { notes: notes.slice(0, 4) },
      { notes: notes.slice(4, 8) },
    ],
  };
}
