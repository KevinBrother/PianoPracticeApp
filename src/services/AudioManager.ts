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
   * 使用 Web Audio API 播放音符
   * 这种方式可以合成任意频率的音符，无需预录制音频文件
   */
  async playNote(pitch: string, octave: number, duration: number = 0.5) {
    try {
      const frequency = getNoteFrequency(pitch, octave);
      await this.playTone(frequency, duration);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }

  /**
   * 播放指定频率的音调
   */
  private async playTone(frequency: number, duration: number) {
    try {
      // 使用 Expo AV 播放合成音
      // 注意: Expo AV 主要用于播放音频文件
      // 对于音频合成，我们可以使用一个简单的实现
      // 在真实应用中，可能需要使用原生模块或 Web Audio API

      // 这里我们使用一个简化的实现
      // 实际项目中建议使用预录制的钢琴音频文件或原生音频合成库

      const soundObject = new Audio.Sound();

      // 注意: 这里需要替换为实际的音频文件
      // 当前为示例代码，实际需要准备音频资源
      console.log(`Playing note at ${frequency}Hz for ${duration}s`);

      // 模拟播放延迟
      await new Promise(resolve => setTimeout(resolve, duration * 1000));

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
