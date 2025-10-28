import { Audio } from 'expo-av';
import { getNoteFrequency } from '../utils/musicUtils';

/**
 * 音频管理器
 * 负责播放钢琴音符声音
 */
export class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;
  private soundCache: Map<string, any> = new Map(); // 缓存已加载的音频

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * 初始化音频系统
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // 设置音频模式
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      this.isInitialized = true;
      console.log('AudioManager initialized');
    } catch (error) {
      console.error('Failed to initialize AudioManager:', error);
    }
  }

  /**
   * 获取音符对应的tone文件索引
   */
  private getToneIndex(pitch: string, octave: number): number {
    const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const pitchIndex = noteOrder.indexOf(pitch);

    if (pitchIndex === -1) return 40; // 默认 C4

    // 计算相对于 A0 的半音数
    // A0 是键1
    // C4 是键40 (A0到C4是39个半音)
    const semitonesFromA0 = pitchIndex + (octave * 12) - 9; // A0是0, A4是48

    // 钢琴从A0开始，键1是A0
    // C4是键40
    const keyNumber = semitonesFromA0 + 1;

    // 确保在1-88范围内
    return Math.max(1, Math.min(88, keyNumber));
  }



  /**
   * 获取音频文件
   */
  private getSoundFile(toneIndex: number): any {
    // 静态导入所有音频文件
    const soundFiles: { [key: number]: any } = {
      1: require('../assets/sounds/tone (1).wav'),
      2: require('../assets/sounds/tone (2).wav'),
      3: require('../assets/sounds/tone (3).wav'),
      4: require('../assets/sounds/tone (4).wav'),
      5: require('../assets/sounds/tone (5).wav'),
      6: require('../assets/sounds/tone (6).wav'),
      7: require('../assets/sounds/tone (7).wav'),
      8: require('../assets/sounds/tone (8).wav'),
      9: require('../assets/sounds/tone (9).wav'),
      10: require('../assets/sounds/tone (10).wav'),
      11: require('../assets/sounds/tone (11).wav'),
      12: require('../assets/sounds/tone (12).wav'),
      13: require('../assets/sounds/tone (13).wav'),
      14: require('../assets/sounds/tone (14).wav'),
      15: require('../assets/sounds/tone (15).wav'),
      16: require('../assets/sounds/tone (16).wav'),
      17: require('../assets/sounds/tone (17).wav'),
      18: require('../assets/sounds/tone (18).wav'),
      19: require('../assets/sounds/tone (19).wav'),
      20: require('../assets/sounds/tone (20).wav'),
      21: require('../assets/sounds/tone (21).wav'),
      22: require('../assets/sounds/tone (22).wav'),
      23: require('../assets/sounds/tone (23).wav'),
      24: require('../assets/sounds/tone (24).wav'),
      25: require('../assets/sounds/tone (25).wav'),
      26: require('../assets/sounds/tone (26).wav'),
      27: require('../assets/sounds/tone (27).wav'),
      28: require('../assets/sounds/tone (28).wav'),
      29: require('../assets/sounds/tone (29).wav'),
      30: require('../assets/sounds/tone (30).wav'),
      31: require('../assets/sounds/tone (31).wav'),
      32: require('../assets/sounds/tone (32).wav'),
      33: require('../assets/sounds/tone (33).wav'),
      34: require('../assets/sounds/tone (34).wav'),
      35: require('../assets/sounds/tone (35).wav'),
      36: require('../assets/sounds/tone (36).wav'),
      37: require('../assets/sounds/tone (37).wav'),
      38: require('../assets/sounds/tone (38).wav'),
      39: require('../assets/sounds/tone (39).wav'),
      40: require('../assets/sounds/tone (40).wav'),
      41: require('../assets/sounds/tone (41).wav'),
      42: require('../assets/sounds/tone (42).wav'),
      43: require('../assets/sounds/tone (43).wav'),
      44: require('../assets/sounds/tone (44).wav'),
      45: require('../assets/sounds/tone (45).wav'),
      46: require('../assets/sounds/tone (46).wav'),
      47: require('../assets/sounds/tone (47).wav'),
      48: require('../assets/sounds/tone (48).wav'),
      49: require('../assets/sounds/tone (49).wav'),
      50: require('../assets/sounds/tone (50).wav'),
      51: require('../assets/sounds/tone (51).wav'),
      52: require('../assets/sounds/tone (52).wav'),
      53: require('../assets/sounds/tone (53).wav'),
      54: require('../assets/sounds/tone (54).wav'),
      55: require('../assets/sounds/tone (55).wav'),
      56: require('../assets/sounds/tone (56).wav'),
      57: require('../assets/sounds/tone (57).wav'),
      58: require('../assets/sounds/tone (58).wav'),
      59: require('../assets/sounds/tone (59).wav'),
      60: require('../assets/sounds/tone (60).wav'),
      61: require('../assets/sounds/tone (61).wav'),
      62: require('../assets/sounds/tone (62).wav'),
      63: require('../assets/sounds/tone (63).wav'),
      64: require('../assets/sounds/tone (64).wav'),
      65: require('../assets/sounds/tone (65).wav'),
      66: require('../assets/sounds/tone (66).wav'),
      67: require('../assets/sounds/tone (67).wav'),
      68: require('../assets/sounds/tone (68).wav'),
      69: require('../assets/sounds/tone (69).wav'),
      70: require('../assets/sounds/tone (70).wav'),
      71: require('../assets/sounds/tone (71).wav'),
      72: require('../assets/sounds/tone (72).wav'),
      73: require('../assets/sounds/tone (73).wav'),
      74: require('../assets/sounds/tone (74).wav'),
      75: require('../assets/sounds/tone (75).wav'),
      76: require('../assets/sounds/tone (76).wav'),
      77: require('../assets/sounds/tone (77).wav'),
      78: require('../assets/sounds/tone (78).wav'),
      79: require('../assets/sounds/tone (79).wav'),
      80: require('../assets/sounds/tone (80).wav'),
      81: require('../assets/sounds/tone (81).wav'),
      82: require('../assets/sounds/tone (82).wav'),
      83: require('../assets/sounds/tone (83).wav'),
      84: require('../assets/sounds/tone (84).wav'),
      85: require('../assets/sounds/tone (85).wav'),
      86: require('../assets/sounds/tone (86).wav'),
      87: require('../assets/sounds/tone (87).wav'),
      88: require('../assets/sounds/tone (88).wav'),
    };    return soundFiles[toneIndex];
  }

  /**
   * 使用 Web Audio API 播放音符
   * 这种方式可以合成任意频率的音符，无需预录制音频文件
   */
  async playNote(pitch: string, octave: number, duration: number = 0.5) {
    try {
      await this.playToneByNote(pitch, octave, duration);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }

  /**
   * 根据音符名称播放音调
   */
  private async playToneByNote(pitch: string, octave: number, duration: number) {
    try {
      const soundObject = new Audio.Sound();

      // 获取对应的tone文件索引
      const toneIndex = this.getToneIndex(pitch, octave);
      const soundFile = this.getSoundFile(toneIndex);

      await soundObject.loadAsync(soundFile);
      await soundObject.playAsync();

      // 播放完成后卸载
      setTimeout(async () => {
        try {
          await soundObject.unloadAsync();
        } catch (e) {
          // Ignore unload errors
        }
      }, duration * 1000 + 100);

    } catch (error) {
      console.error('Error playing tone:', error);
    }
  }





  /**
   * 播放正确反馈音效
   */
  async playCorrectFeedback() {
    // 播放一个愉悦的和弦
    console.log('Playing correct feedback');
  }

  /**
   * 播放错误反馈音效
   */
  async playIncorrectFeedback() {
    // 播放一个不和谐音
    console.log('Playing incorrect feedback');
  }

  /**
   * 停止所有音频
   */
  stopAll() {
    // 停止所有正在播放的音频
    console.log('Stopping all audio');
  }

  /**
   * 清理资源
   */
  cleanup() {
    this.stopAll();
    this.isInitialized = false;
  }
}

export default AudioManager.getInstance();
