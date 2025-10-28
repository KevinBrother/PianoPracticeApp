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
 * 生成钢琴键盘数据（标准88键钢琴布局）
 * 琴键顺序从左到右：
 * [钢琴最左端]
 * A2, A#2, B2 | (大字二组)
 * C1, C#1, D1, D#1, E1, F#1, G1, G#1, A1, A#1, B1 | (大字一组)
 * C, C#, D, D#, E, F, F#, G, G#, A, A#, B | (大字组)
 * c, c#, d, d#, e, f, f#, g, g#, a, a#, b | (小字组)
 * c1, c#1, d1, d#1, e1, f1, f#1, g1, g#1, a1, a#1, b1 | (小字一组) <-- 中央C在这里 (c1)
 * c2, c#2, d2, d#2, e2, f2, f#2, g2, g#2, a2, a#2, b2 | (小字二组)
 * c3, c#3, d3, d#3, e3, f3, f#3, g3, g#3, a3, a#3, b3 | (小字三组)
 * c4, c#4, d4, d#4, e4, f4, f#4, g4, g#4, a4, a#4, b4 | (小字四组)
 * c5 | (小字五组)
 * [钢琴最右端]
 * 
 * 注意：内部使用科学音高记谱法 (A0-C8)，但显示使用传统记谱法
 * 映射关系：
 * - 科学记谱 A0, B0 = 传统记谱 A2, B2 (大字二组)
 * - 科学记谱 C1-B1 = 传统记谱 C1-B1 (大字一组)
 * - 科学记谱 C2-B2 = 传统记谱 C-B (大字组)
 * - 科学记谱 C3-B3 = 传统记谱 c-b (小字组)
 * - 科学记谱 C4-B4 = 传统记谱 c1-b1 (小字一组，中央C)
 * - 科学记谱 C5-B5 = 传统记谱 c2-b2 (小字二组)
 * - 科学记谱 C6-B6 = 传统记谱 c3-b3 (小字三组)
 * - 科学记谱 C7-B7 = 传统记谱 c4-b4 (小字四组)
 * - 科学记谱 C8 = 传统记谱 c5 (小字五组)
 */
export function generatePianoKeys(): PianoKey[] {
  const keys: PianoKey[] = [];
  
  // 标准钢琴键盘从 A0 开始到 C8 结束（科学音高记谱法）
  const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // 从 A0 开始（科学记谱A0/B0 = 传统记谱A2/B2，大字二组）
  ['A', 'A#', 'B'].forEach(note => {
    const frequency = getNoteFrequency(note, 0);
    keys.push({
      id: `${note}0`,
      note,
      octave: 0,
      isBlack: note.includes('#'),
      frequency,
    });
  });
  
  // 生成 C1 到 B7（完整的八度）
  for (let octave = 1; octave <= 7; octave++) {
    for (const note of allNotes) {
      const frequency = getNoteFrequency(note, octave);
      keys.push({
        id: `${note}${octave}`,
        note,
        octave,
        isBlack: note.includes('#'),
        frequency,
      });
    }
  }
  
  // 最后添加 C8（科学记谱C8 = 传统记谱c5，小字五组）
  const c8Frequency = getNoteFrequency('C', 8);
  keys.push({
    id: 'C8',
    note: 'C',
    octave: 8,
    isBlack: false,
    frequency: c8Frequency,
  });

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
