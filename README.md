# Piano Practice App

一个基于 React Native (Expo) 的钢琴五线谱练习应用。

## 功能特性

- ✨ 五线谱可视化展示
- 🎹 虚拟钢琴键盘 (2个八度)
- 🎵 实时音符识别和反馈
- 📊 练习统计 (正确率、进度)
- 🎯 智能高亮当前待弹奏音符
- 🔄 可重置练习进度

## 技术栈

- **React Native** (Expo)
- **TypeScript** - 类型安全
- **Zustand** - 状态管理
- **React Native SVG** - 五线谱渲染
- **Expo AV** - 音频处理

## 项目结构

```
src/
├── components/          # UI 组件
│   ├── Staff/          # 五线谱组件
│   ├── PianoKeyboard/  # 钢琴键盘组件
│   └── FeedbackOverlay/
├── screens/            # 页面
│   └── PracticeScreen.tsx
├── services/           # 业务逻辑
│   ├── AudioManager.ts
│   └── InputRecognitionEngine.ts
├── store/              # 状态管理
│   └── practiceStore.ts
├── utils/              # 工具函数
│   └── musicUtils.ts
└── types/              # TypeScript 类型
    └── music.types.ts
```

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. EAS 云构建（推荐用于生产环境）

使用 Expo Application Services 进行云构建，无需本地配置 Xcode 或 Android Studio。

#### 快速开始

```bash
# 1. 安装 EAS CLI（全局安装一次即可）
npm install -g eas-cli

# 2. 登录 Expo 账号
eas login

# 3. 构建 Android 预览版（推荐第一次尝试）
npm run build:android:preview
# 或使用完整命令
eas build --platform android --profile preview

# 4. 等待构建完成（约 5-15 分钟）
# 5. 下载生成的 APK 文件并安装到设备测试
```

#### 所有可用的构建命令

```bash
# Android 构建
npm run build:android:preview      # 预览版 APK（测试用）
npm run build:android:production   # 生产版 APK（发布用）
npm run build:android:aab          # AAB 格式（Google Play 上传用）

# iOS 构建
npm run build:ios:preview          # 预览版（模拟器）
npm run build:ios:production       # 生产版（App Store）

# 同时构建两个平台
npm run build:all:preview          # 预览版
npm run build:all:production       # 生产版

# 提交到应用商店
npm run submit:android             # 提交到 Google Play
npm run submit:ios                 # 提交到 App Store

# 查看构建状态
npm run build:list                 # 查看所有构建
npm run build:status               # 查看最近 5 个构建
```

**详细的 EAS 构建指南**: 请查看 [EAS_BUILD_GUIDE.md](./EAS_BUILD_GUIDE.md)

---

### 2. 启动开发服务器

```bash
npm start
```

### 3. 在设备上运行

启动后，你会看到一个二维码。可以使用以下方式运行应用：

#### iOS
- 在 iPhone 上下载 **Expo Go** 应用
- 打开相机扫描二维码

#### Android
- 在 Android 设备上下载 **Expo Go** 应用
- 在 Expo Go 中扫描二维码

#### Web (可选)
- 按 `w` 键在浏览器中打开

#### iOS 模拟器 (需要 Xcode)
```bash
npm run ios
```

#### Android 模拟器 (需要 Android Studio)
```bash
npm run android
```

## 使用说明

1. **开始练习**: 应用启动后会自动加载一个简单的 C 大调音阶练习
2. **弹奏音符**: 点击屏幕下方的虚拟钢琴键盘
3. **查看反馈**:
   - 橙色圆圈 = 当前待弹奏的音符
   - 绿色圆圈 = 弹奏正确
   - 红色圆圈 = 弹奏错误
   - 灰色圆圈 = 已完成
4. **重新开始**: 点击"重新开始"按钮重置练习

## 核心组件说明

### StaffRenderer (五线谱渲染器)
使用 React Native SVG 绘制五线谱和音符，支持：
- 高音谱号和低音谱号
- 音符高亮和状态显示
- 水平滚动查看长乐谱

### PianoKeyboard (虚拟钢琴键盘)
- 动态生成指定八度的钢琴键
- 白键和黑键的正确布局
- 触摸反馈

### InputRecognitionEngine (输入识别引擎)
- 验证用户输入的音符是否正确
- 跟踪练习进度
- 计算准确率

### usePracticeStore (状态管理)
使用 Zustand 管理全局状态：
- 当前乐谱
- 音符状态
- 统计数据
- 反馈消息

## 已知问题

1. **音频播放**: 当前音频管理器使用的是简化实现，实际音频播放功能需要：
   - 准备钢琴音频文件 (88个音符)
   - 或使用音频合成库 (如 Tone.js)

2. **版本警告**:
   - `react-native-screens` 和 `react-native-svg` 的版本可能与 Expo SDK 不完全匹配
   - 这不会影响基本功能，但如果遇到问题可以运行：
   ```bash
   npx expo install --fix
   ```

## 未来计划

- [ ] 实现真实的钢琴音频播放
- [ ] 添加更多练习曲目
- [ ] 支持双手练习 (高音谱号 + 低音谱号)
- [ ] 添加节拍器功能
- [ ] 实现练习历史记录
- [ ] 支持自定义乐谱导入
- [ ] 添加成就系统

## 开发指南

### 添加新的练习曲目

在 `src/utils/musicUtils.ts` 中创建新的生成函数：

```typescript
export function generateNewSheet() {
  return {
    id: 'practice-2',
    title: '新的练习',
    difficulty: 'beginner',
    config: {
      clef: 'treble',
      keySignature: 'C',
      timeSignature: [4, 4],
    },
    measures: [
      { notes: [/* 音符数组 */] },
    ],
  };
}
```

### 自定义音符状态颜色

在 `src/components/Staff/StaffRenderer.tsx` 的 `getNoteColor` 函数中修改：

```typescript
const getNoteColor = (state: NoteState): string => {
  switch (state) {
    case NoteState.WAITING:
      return '#你的颜色';
    // ...
  }
};
```

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**开发时间**: 2025-10-28
**作者**: Piano Practice App Team
