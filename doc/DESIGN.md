# Piano Practice App - 详细设计文档

## 1. 项目概述

### 1.1 项目名称

Piano Practice App (钢琴五线谱练习应用)

### 1.2 项目目标

开发一个基于 React Native 的移动应用，帮助用户通过交互式的方式练习钢琴和识别五线谱，提升音乐学习效率。

### 1.3 核心功能

- 五线谱可视化展示
- 实时音符弹奏与音频反馈
- 智能识别用户输入并提供反馈
- 渐进式练习模式

---

## 2. 技术栈

### 2.1 前端框架

- **React Native** (最新稳定版本)
- **TypeScript** - 类型安全
- **React Navigation** - 页面导航
- **Pnpm** - 包管理

### 2.2 UI 组件库

- **React Native Paper** 或 **NativeBase** - UI 组件
- **React Native SVG** - 五线谱绘制
- **React Native Gesture Handler** - 手势交互

### 2.3 音频处理

- **react-native-sound** 或 **expo-av** - 音频播放
- **Tone.js** (通过 WebView) 或 **react-native-audio-toolkit** - 音频合成
- **@react-native-community/audio-toolkit** - 音频录制（可选）

### 2.4 状态管理

- **Redux Toolkit** 或 **Zustand** - 全局状态管理
- **React Query** - 数据缓存与同步（如需要）

### 2.5 数据存储

- **AsyncStorage** - 本地数据持久化
- **SQLite** (react-native-sqlite-storage) - 练习记录存储（可选）

---

## 3. 系统架构

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────────┐
│                   Presentation Layer                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Home Screen │  │ Practice     │  │ Settings  │ │
│  │              │  │ Screen       │  │ Screen    │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│                   Business Logic Layer               │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ Music        │  │ Input        │  │ Progress  │ │
│  │ Engine       │  │ Recognition  │  │ Tracker   │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│                   Data Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ Local        │  │ Audio        │  │ Music     │ │
│  │ Storage      │  │ Library      │  │ Data      │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
```

### 3.2 模块划分

#### 3.2.1 UI 层 (Presentation Layer)

- **HomeScreen**: 主页，选择练习模式
- **PracticeScreen**: 核心练习界面
- **SettingsScreen**: 设置页面
- **ProgressScreen**: 进度统计页面

#### 3.2.2 业务逻辑层 (Business Logic Layer)

- **MusicEngine**: 音乐理论与音符处理
- **InputRecognition**: 用户输入识别
- **ProgressTracker**: 练习进度跟踪
- **AudioManager**: 音频播放管理

#### 3.2.3 数据层 (Data Layer)

- **LocalStorage**: 本地数据存储
- **MusicDataProvider**: 乐谱数据管理
- **AudioLibrary**: 音频资源管理

---

## 4. 核心功能详细设计

### 4.1 五线谱展示模块

#### 4.1.1 数据结构

```typescript
// 音符定义
interface Note {
  id: string;
  pitch: string;        // 音高 (C4, D4, E4, etc.)
  duration: number;     // 时值 (1=全音符, 0.5=二分音符, etc.)
  octave: number;       // 八度
  accidental?: 'sharp' | 'flat' | 'natural'; // 升降记号
}

// 五线谱配置
interface StaffConfig {
  clef: 'treble' | 'bass'; // 高音谱号或低音谱号
  keySignature: string;     // 调号
  timeSignature: [number, number]; // 拍号 [4, 4]
}

// 乐谱数据
interface Sheet {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  config: StaffConfig;
  measures: Measure[];  // 小节
}

interface Measure {
  notes: Note[];
}
```

#### 4.1.2 渲染逻辑

使用 **React Native SVG** 绘制五线谱：

```typescript
// StaffRenderer 组件
const StaffRenderer: React.FC<{
  notes: Note[];
  config: StaffConfig;
  highlightIndex?: number;
}> = ({ notes, config, highlightIndex }) => {
  return (
    <Svg width="100%" height="200">
      {/* 绘制五线谱线条 */}
      <StaffLines />

      {/* 绘制谱号 */}
      <Clef type={config.clef} />

      {/* 绘制音符 */}
      {notes.map((note, index) => (
        <NoteSymbol
          key={note.id}
          note={note}
          position={calculateNotePosition(note, config)}
          highlighted={index === highlightIndex}
        />
      ))}
    </Svg>
  );
};
```

#### 4.1.3 音符位置计算

```typescript
function calculateNotePosition(note: Note, config: StaffConfig): Point {
  const baseLineY = 100; // 基准线位置
  const lineSpacing = 10; // 线间距

  // 根据音高计算 Y 坐标
  const noteIndex = getNoteIndexOnStaff(note.pitch, note.octave, config.clef);
  const y = baseLineY - (noteIndex * lineSpacing / 2);

  // X 坐标根据时序排列
  const x = calculateXPosition(note);

  return { x, y };
}
```

---

### 4.2 音频播放模块

#### 4.2.1 音频资源准备

**方案 1: 预录制音频**

- 预录制 88 个钢琴键的音频文件 (A0-C8)
- 文件命名: `piano_C4.mp3`, `piano_D4.mp3`, etc.
- 存储在 `assets/sounds/piano/` 目录

**方案 2: 音频合成 (推荐)**

- 使用 Tone.js 或 react-native-audio-toolkit
- 实时合成钢琴音色
- 更灵活，文件体积小

#### 4.2.2 音频管理器

```typescript
class AudioManager {
  private soundPool: Map<string, Sound> = new Map();

  async preloadSounds(notes: string[]) {
    for (const note of notes) {
      const sound = new Sound(`piano_${note}.mp3`, Sound.MAIN_BUNDLE);
      this.soundPool.set(note, sound);
    }
  }

  playNote(pitch: string, octave: number) {
    const noteKey = `${pitch}${octave}`;
    const sound = this.soundPool.get(noteKey);

    if (sound) {
      sound.stop(); // 停止之前的播放
      sound.play();
    }
  }

  stopAll() {
    this.soundPool.forEach(sound => sound.stop());
  }
}
```

---

### 4.3 用户输入识别模块

#### 4.3.1 输入方式

**选项 1: 虚拟钢琴键盘**

- 在屏幕下方显示钢琴键盘
- 用户点击或滑动键盘进行弹奏
- 使用 `TouchableOpacity` 或自定义手势

```typescript
const PianoKeyboard: React.FC<{
  onNotePress: (note: string, octave: number) => void;
}> = ({ onNotePress }) => {
  const keys = generatePianoKeys(2); // 2个八度

  return (
    <View style={styles.keyboard}>
      {keys.map(key => (
        <PianoKey
          key={key.id}
          note={key.note}
          octave={key.octave}
          isBlack={key.isBlack}
          onPress={() => onNotePress(key.note, key.octave)}
        />
      ))}
    </View>
  );
};
```

**选项 2: 音频输入识别 (高级功能)**

- 使用麦克风录制用户演奏
- 通过音频分析识别音高
- 需要音频处理库 (如 `aubio`, `essentia.js`)

#### 4.3.2 输入验证逻辑

```typescript
class InputRecognitionEngine {
  private currentNoteIndex: number = 0;
  private expectedNotes: Note[] = [];

  setExpectedNotes(notes: Note[]) {
    this.expectedNotes = notes;
    this.currentNoteIndex = 0;
  }

  validateInput(inputNote: string, inputOctave: number): ValidationResult {
    const expected = this.expectedNotes[this.currentNoteIndex];

    if (!expected) {
      return { success: false, message: '练习已完成' };
    }

    const expectedPitch = `${expected.pitch}${expected.octave}`;
    const inputPitch = `${inputNote}${inputOctave}`;

    if (expectedPitch === inputPitch) {
      this.currentNoteIndex++;
      return {
        success: true,
        message: '正确！',
        nextNoteIndex: this.currentNoteIndex
      };
    } else {
      return {
        success: false,
        message: `错误！期望 ${expectedPitch}，输入了 ${inputPitch}`,
        correctNote: expected
      };
    }
  }

  getCurrentProgress(): number {
    return (this.currentNoteIndex / this.expectedNotes.length) * 100;
  }
}

interface ValidationResult {
  success: boolean;
  message: string;
  nextNoteIndex?: number;
  correctNote?: Note;
}
```

---

### 4.4 反馈机制

#### 4.4.1 视觉反馈

```typescript
// 音符高亮状态
enum NoteState {
  WAITING = 'waiting',    // 等待弹奏
  CORRECT = 'correct',    // 正确
  INCORRECT = 'incorrect', // 错误
  COMPLETED = 'completed'  // 已完成
}

// 根据状态显示不同颜色
const getNoteColor = (state: NoteState) => {
  switch (state) {
    case NoteState.WAITING:
      return '#FFA500'; // 橙色 - 当前等待
    case NoteState.CORRECT:
      return '#4CAF50'; // 绿色 - 正确
    case NoteState.INCORRECT:
      return '#F44336'; // 红色 - 错误
    case NoteState.COMPLETED:
      return '#9E9E9E'; // 灰色 - 已完成
  }
};
```

#### 4.4.2 音频反馈

```typescript
class FeedbackManager {
  playCorrectFeedback() {
    // 播放正确音效
    const sound = new Sound('correct.mp3', Sound.MAIN_BUNDLE);
    sound.play();
  }

  playIncorrectFeedback() {
    // 播放错误音效
    const sound = new Sound('incorrect.mp3', Sound.MAIN_BUNDLE);
    sound.play();

    // 可选：震动反馈
    Vibration.vibrate(200);
  }

  showVisualFeedback(isCorrect: boolean) {
    // 显示动画效果
    Animated.sequence([
      Animated.timing(this.feedbackOpacity, {
        toValue: 1,
        duration: 200,
      }),
      Animated.timing(this.feedbackOpacity, {
        toValue: 0,
        duration: 500,
      })
    ]).start();
  }
}
```

---

## 5. 页面设计

### 5.1 主页 (HomeScreen)

**功能**:

- 显示应用 Logo
- 选择练习模式
- 查看历史进度

**布局**:

```
┌─────────────────────────────┐
│       Piano Practice        │
│           App               │
│                             │
│   ┌───────────────────┐    │
│   │  开始练习         │    │
│   └───────────────────┘    │
│                             │
│   ┌───────────────────┐    │
│   │  练习记录         │    │
│   └───────────────────┘    │
│                             │
│   ┌───────────────────┐    │
│   │  设置             │    │
│   └───────────────────┘    │
└─────────────────────────────┘
```

### 5.2 练习页面 (PracticeScreen)

**功能**:

- 五线谱显示区域
- 虚拟钢琴键盘
- 进度条
- 控制按钮 (暂停、重新开始)

**布局**:

```
┌─────────────────────────────┐
│  [返回]  练习模式  [设置]   │
├─────────────────────────────┤
│                             │
│    五线谱显示区域           │
│    ♪ ♩ ♫                   │
│                             │
├─────────────────────────────┤
│  进度: ▓▓▓▓▓░░░░░  50%    │
├─────────────────────────────┤
│                             │
│      虚拟钢琴键盘           │
│   [C][D][E][F][G][A][B]    │
│                             │
└─────────────────────────────┘
```

### 5.3 设置页面 (SettingsScreen)

**功能**:

- 难度选择
- 音量调节
- 速度调节
- 主题切换

---

## 6. 数据流设计

### 6.1 状态管理架构 (使用 Zustand)

```typescript
interface PracticeState {
  // 当前乐谱
  currentSheet: Sheet | null;

  // 当前音符索引
  currentNoteIndex: number;

  // 音符状态列表
  noteStates: NoteState[];

  // 统计数据
  stats: {
    correctCount: number;
    incorrectCount: number;
    totalTime: number;
  };

  // Actions
  setCurrentSheet: (sheet: Sheet) => void;
  handleNoteInput: (note: string, octave: number) => void;
  resetPractice: () => void;
  updateStats: (isCorrect: boolean) => void;
}

const usePracticeStore = create<PracticeState>((set, get) => ({
  currentSheet: null,
  currentNoteIndex: 0,
  noteStates: [],
  stats: { correctCount: 0, incorrectCount: 0, totalTime: 0 },

  setCurrentSheet: (sheet) => set({
    currentSheet: sheet,
    currentNoteIndex: 0,
    noteStates: new Array(sheet.measures.flatMap(m => m.notes).length).fill(NoteState.WAITING)
  }),

  handleNoteInput: (note, octave) => {
    const state = get();
    const recognition = new InputRecognitionEngine();
    recognition.setExpectedNotes(state.currentSheet?.measures.flatMap(m => m.notes) || []);

    const result = recognition.validateInput(note, octave);

    if (result.success) {
      set(state => ({
        currentNoteIndex: state.currentNoteIndex + 1,
        noteStates: state.noteStates.map((s, i) =>
          i === state.currentNoteIndex ? NoteState.CORRECT : s
        ),
      }));
    }

    state.updateStats(result.success);
  },

  resetPractice: () => set({
    currentNoteIndex: 0,
    noteStates: [],
    stats: { correctCount: 0, incorrectCount: 0, totalTime: 0 }
  }),

  updateStats: (isCorrect) => set(state => ({
    stats: {
      ...state.stats,
      correctCount: state.stats.correctCount + (isCorrect ? 1 : 0),
      incorrectCount: state.stats.incorrectCount + (isCorrect ? 0 : 1)
    }
  }))
}));
```

### 6.2 数据持久化

```typescript
// 使用 AsyncStorage 保存用户进度
class StorageManager {
  async saveProgress(progress: PracticeProgress) {
    await AsyncStorage.setItem(
      `progress_${progress.sheetId}`,
      JSON.stringify(progress)
    );
  }

  async loadProgress(sheetId: string): Promise<PracticeProgress | null> {
    const data = await AsyncStorage.getItem(`progress_${sheetId}`);
    return data ? JSON.parse(data) : null;
  }

  async saveSettings(settings: AppSettings) {
    await AsyncStorage.setItem('settings', JSON.stringify(settings));
  }
}

interface PracticeProgress {
  sheetId: string;
  completedNotes: number;
  totalNotes: number;
  accuracy: number;
  lastPracticeDate: Date;
}
```

---

## 7. 性能优化

### 7.1 音频资源优化

- **懒加载**: 只加载当前练习需要的音频文件
- **音频压缩**: 使用 MP3 或 AAC 格式，控制文件大小
- **缓存策略**: 常用音符预加载，不常用音符按需加载

### 7.2 渲染优化

- **虚拟化列表**: 如果乐谱很长，使用 FlatList 虚拟化
- **Memo 优化**: 使用 React.memo 避免不必要的重渲染
- **避免复杂计算**: 音符位置计算结果缓存

```typescript
const MemoizedStaffRenderer = React.memo(StaffRenderer, (prev, next) => {
  return prev.highlightIndex === next.highlightIndex &&
         prev.notes === next.notes;
});
```

---

## 8. 测试策略

### 8.1 单元测试

- 音符识别逻辑测试
- 音高计算测试
- 状态管理测试

```typescript
describe('InputRecognitionEngine', () => {
  it('should validate correct note input', () => {
    const engine = new InputRecognitionEngine();
    engine.setExpectedNotes([{ pitch: 'C', octave: 4, duration: 1, id: '1' }]);

    const result = engine.validateInput('C', 4);
    expect(result.success).toBe(true);
  });

  it('should reject incorrect note input', () => {
    const engine = new InputRecognitionEngine();
    engine.setExpectedNotes([{ pitch: 'C', octave: 4, duration: 1, id: '1' }]);

    const result = engine.validateInput('D', 4);
    expect(result.success).toBe(false);
  });
});
```

### 8.2 集成测试

- 完整练习流程测试
- 音频播放测试
- 数据持久化测试

### 8.3 UI 测试

- 使用 React Native Testing Library
- 测试用户交互流程

---

## 9. 部署与发布

### 9.1 构建配置

**Android**:

```bash
# 生成签名密钥
keytool -genkey -v -keystore piano-app.keystore -alias piano-app -keyalg RSA -keysize 2048 -validity 10000

# 构建 APK
cd android && ./gradlew assembleRelease
```

**iOS**:

```bash
# 使用 Xcode 配置签名
# 构建 IPA
cd ios && xcodebuild -workspace PianoApp.xcworkspace -scheme PianoApp -configuration Release archive
```

### 9.2 应用商店提交

**Google Play Store**:

- 准备应用图标、截图、描述
- 设置隐私政策
- 配置应用分级

**Apple App Store**:

- 准备 App Store Connect 资料
- 提交审核
- 配置应用内购买 (如需要)

---

## 10. 未来扩展功能

### 10.1 进阶功能

- **双手练习**: 同时显示高音谱号和低音谱号
- **和弦练习**: 支持和弦识别
- **节奏训练**: 加入节拍器，训练节奏感
- **乐曲库**: 内置多首练习曲目

### 10.2 社交功能

- **排行榜**: 与其他用户比较成绩
- **挑战模式**: 每日挑战任务
- **分享功能**: 分享练习成果

### 10.3 AI 功能

- **智能推荐**: 根据用户水平推荐练习曲目
- **错误分析**: 分析常见错误，提供改进建议
- **自适应难度**: 根据用户表现自动调整难度

---

## 11. 项目时间线

### 阶段 1: 基础框架 (2 周)

- 项目搭建
- UI 框架搭建
- 导航配置

### 阶段 2: 核心功能开发 (4 周)

- 五线谱渲染
- 音频播放
- 用户输入识别
- 反馈机制

### 阶段 3: 数据管理 (1 周)

- 状态管理
- 数据持久化
- 乐谱数据加载

### 阶段 4: 优化与测试 (2 周)

- 性能优化
- 单元测试
- 用户体验优化

### 阶段 5: 发布准备 (1 周)

- 应用图标、启动页
- 应用商店资料准备
- 最终测试

**总计**: 约 10 周

---

## 12. 技术风险与应对

### 12.1 音频延迟问题

**风险**: React Native 音频播放可能有延迟
**应对**:

- 使用低延迟音频库 (如 `react-native-sound`)
- 预加载音频资源
- 考虑使用原生模块

### 12.2 跨平台兼容性

**风险**: iOS 和 Android 音频 API 差异
**应对**:

- 使用成熟的跨平台音频库
- 针对不同平台做适配
- 充分测试

### 12.3 性能问题

**风险**: 复杂动画和音频同步可能影响性能
**应对**:

- 使用 `useNativeDriver` 优化动画
- 减少不必要的渲染
- 使用性能分析工具 (Flipper)

---

## 13. 参考资料

### 13.1 技术文档

- [React Native 官方文档](https://reactnative.dev/)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)
- [React Native Sound](https://github.com/zmxv/react-native-sound)
- [Tone.js](https://tonejs.github.io/)

### 13.2 音乐理论

- [五线谱基础知识](https://www.musictheory.net/)
- [MIDI 音符对照表](https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies)

### 13.3 设计参考

- [Simply Piano](https://www.joytunes.com/simply-piano)
- [Yousician](https://yousician.com/)

---

## 附录 A: 目录结构

```
piano-practice-app/
├── src/
│   ├── components/          # UI 组件
│   │   ├── Staff/          # 五线谱组件
│   │   ├── PianoKeyboard/  # 钢琴键盘组件
│   │   └── FeedbackOverlay/ # 反馈组件
│   ├── screens/            # 页面
│   │   ├── HomeScreen.tsx
│   │   ├── PracticeScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/           # 业务逻辑
│   │   ├── AudioManager.ts
│   │   ├── InputRecognitionEngine.ts
│   │   └── MusicEngine.ts
│   ├── store/              # 状态管理
│   │   └── practiceStore.ts
│   ├── utils/              # 工具函数
│   │   ├── musicUtils.ts
│   │   └── storageUtils.ts
│   ├── types/              # TypeScript 类型定义
│   │   └── music.types.ts
│   └── assets/             # 资源文件
│       ├── sounds/         # 音频文件
│       ├── images/         # 图片
│       └── sheets/         # 乐谱数据
├── __tests__/              # 测试文件
├── android/                # Android 原生代码
├── ios/                    # iOS 原生代码
├── package.json
└── tsconfig.json
```

---

## 附录 B: 音符频率对照表

| 音符 | 频率 (Hz) | MIDI 编号 |
|------|-----------|-----------|
| C4   | 261.63    | 60        |
| D4   | 293.66    | 62        |
| E4   | 329.63    | 64        |
| F4   | 349.23    | 65        |
| G4   | 392.00    | 67        |
| A4   | 440.00    | 69        |
| B4   | 493.88    | 71        |
| C5   | 523.25    | 72        |

---

**文档版本**: 1.0
**最后更新**: 2025-10-28
**作者**: Piano Practice App Team
