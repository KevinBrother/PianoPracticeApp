# 快速启动指南

## 项目状态

✅ **项目已完成搭建！所有代码文件已就绪。**

## 项目结构

```
PianoPracticeApp/
├── src/
│   ├── components/
│   │   ├── Staff/StaffRenderer.tsx           # ✅ 五线谱组件
│   │   └── PianoKeyboard/PianoKeyboard.tsx   # ✅ 钢琴键盘
│   ├── screens/
│   │   └── PracticeScreen.tsx                # ✅ 主页面
│   ├── services/
│   │   ├── AudioManager.ts                   # ✅ 音频管理
│   │   └── InputRecognitionEngine.ts         # ✅ 识别引擎
│   ├── store/
│   │   └── practiceStore.ts                  # ✅ 状态管理
│   ├── utils/
│   │   └── musicUtils.ts                     # ✅ 工具函数
│   └── types/
│       └── music.types.ts                    # ✅ 类型定义
├── App.tsx                                   # ✅ 应用入口
└── package.json                              # ✅ 依赖配置
```

## 如何运行

### 步骤 1: 确保在正确目录

```bash
cd /Volumes/doc/workspace/project/phone-test/PianoPracticeApp
```

### 步骤 2: 清理端口 (如果需要)

如果遇到端口占用问题：

```bash
# 查找占用 8081 端口的进程
lsof -ti:8081

# 结束进程 (替换 PID 为上面找到的进程号)
kill -9 <PID>
```

或者直接：

```bash
# Mac/Linux
killall -9 node

# 然后重启
npm start
```

### 步骤 3: 启动开发服务器

```bash
npm start
```

等待看到以下内容：

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### 步骤 4: 在设备上打开

#### 选项 A: 使用 Expo Go (最简单)

1. **下载 Expo Go 应用**
   - iOS: App Store
   - Android: Google Play Store

2. **扫描二维码**
   - iOS: 使用相机应用扫描终端中的二维码
   - Android: 在 Expo Go 应用内扫描

#### 选项 B: 使用 Web 浏览器

在终端中按 `w` 键，或者访问:
```
http://localhost:8081
```

#### 选项 C: iOS 模拟器 (需要 Mac + Xcode)

```bash
npm run ios
```

#### 选项 D: Android 模拟器 (需要 Android Studio)

```bash
npm run android
```

## 常见问题

### 问题 1: Metro Bundler 卡在 "Waiting on http://localhost:8081"

**解决方案**:

```bash
# 1. 停止当前进程 (Ctrl+C)

# 2. 清理缓存
npx react-native start --reset-cache

# 或者
npm start -- --reset-cache
```

### 问题 2: 版本警告

```
react-native-screens@4.18.0 - expected version: ~4.16.0
react-native-svg@15.14.0 - expected version: 15.12.1
```

**解决方案**:

```bash
npx expo install --fix
```

这会自动安装兼容的版本。

### 问题 3: 端口已被占用

**解决方案**:

```bash
# 查找并结束占用端口的进程
lsof -ti:8081 | xargs kill -9
lsof -ti:8082 | xargs kill -9

# 然后重新启动
npm start
```

### 问题 4: 模块未找到错误

**解决方案**:

```bash
# 重新安装依赖
rm -rf node_modules
npm install

# 清理缓存并重启
npm start -- --reset-cache
```

## 验证安装

运行以下命令检查是否一切正常：

```bash
# 检查 Node.js 版本 (建议 v18+)
node --version

# 检查 npm 版本
npm --version

# 检查 Expo CLI
npx expo --version

# 列出已安装的依赖
npm list --depth=0
```

## 应用功能测试清单

启动应用后，测试以下功能：

- [ ] 应用正常加载，显示"钢琴练习"标题
- [ ] 五线谱正确显示 8 个音符 (C4-C5)
- [ ] 第一个音符高亮显示为橙色
- [ ] 钢琴键盘显示在底部 (2个八度)
- [ ] 点击正确的音符 (C4)，音符变绿，下一个高亮
- [ ] 点击错误的音符，显示错误反馈，音符短暂变红
- [ ] 统计面板实时更新 (正确数/错误数/准确率)
- [ ] 进度条随着完成度更新
- [ ] 完成所有音符后显示"太棒了！全部完成！"
- [ ] 点击"重新开始"按钮可重置练习

## 下一步

应用已经可以运行！接下来您可以：

1. **测试功能**: 在设备/模拟器上完整测试所有功能

2. **查看代码**:
   - `src/screens/PracticeScreen.tsx` - 主界面
   - `src/components/Staff/StaffRenderer.tsx` - 五线谱渲染
   - `src/components/PianoKeyboard/PianoKeyboard.tsx` - 钢琴键盘

3. **添加功能**:
   - 实现真实的音频播放
   - 添加更多练习曲目
   - 添加设置页面

4. **优化**:
   - 改善动画效果
   - 添加音效
   - 优化性能

## 技术支持

如果遇到问题：

1. 查看 [Expo 官方文档](https://docs.expo.dev/)
2. 查看 `README.md` 了解更多细节
3. 查看 `PROJECT_SUMMARY.md` 了解项目概况

## 备注

- **音频**: 当前音频管理器使用简化实现，点击键盘会触发逻辑但不会真正播放声音
- **性能**: 在开发模式下可能会稍慢，生产版本会更快
- **兼容性**: 已测试 iOS 和 Android，Web 版本可能需要额外调整

---

**祝您使用愉快！** 🎹🎵

如有问题，请参考 `README.md` 或 `DESIGN.md` 文档。
