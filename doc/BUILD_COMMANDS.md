# 构建命令快速参考

## 🚀 常用命令速查表

### 开发阶段

```bash
# 启动开发服务器
npm start

# 在特定平台打开
npm run android    # Android 模拟器
npm run ios        # iOS 模拟器
npm run web        # Web 浏览器
```

### EAS 云构建

#### 第一次使用

```bash
# 1. 安装 EAS CLI
npm install -g eas-cli

# 2. 登录
eas login

# 3. 构建第一个测试版本
npm run build:android:preview
```

#### Android 构建

```bash
# 预览/测试版（生成 APK，可直接安装）
npm run build:android:preview

# 生产版 APK
npm run build:android:production

# 生产版 AAB（用于上传 Google Play）
npm run build:android:aab
```

#### iOS 构建

```bash
# 预览版（模拟器）
npm run build:ios:preview

# 生产版（App Store）
npm run build:ios:production
```

#### 同时构建两个平台

```bash
# 预览版
npm run build:all:preview

# 生产版
npm run build:all:production
```

### 提交到应用商店

```bash
# 提交到 Google Play
npm run submit:android

# 提交到 App Store
npm run submit:ios
```

### 查看构建状态

```bash
# 查看所有构建
npm run build:list

# 查看最近 5 个构建
npm run build:status
```

## 📱 完整工作流示例

### 场景 1: 第一次构建测试版

```bash
# 步骤 1: 登录 Expo
eas login

# 步骤 2: 构建 Android 预览版
npm run build:android:preview

# 步骤 3: 等待构建完成（5-15分钟）
# 控制台会显示进度和下载链接

# 步骤 4: 下载 APK 文件
# 点击控制台中的链接或使用:
eas build:download --platform android --profile preview

# 步骤 5: 安装到 Android 设备测试
```

### 场景 2: 发布到 Google Play

```bash
# 步骤 1: 构建生产版 AAB
npm run build:android:aab

# 步骤 2: 等待构建完成

# 步骤 3: 提交到 Google Play
npm run submit:android

# 或者手动下载 AAB 上传
eas build:download --platform android --profile production-aab
```

### 场景 3: 发布到 App Store

```bash
# 步骤 1: 确保配置了 Apple Developer 账号
eas credentials

# 步骤 2: 构建生产版
npm run build:ios:production

# 步骤 3: 提交到 App Store
npm run submit:ios
```

## 🔧 原始 EAS 命令

如果你想使用完整的 EAS 命令而不是 npm scripts:

```bash
# Android 构建
eas build --platform android --profile preview
eas build --platform android --profile production
eas build --platform android --profile production-aab

# iOS 构建
eas build --platform ios --profile preview
eas build --platform ios --profile production

# 同时构建
eas build --platform all --profile preview
eas build --platform all --profile production

# 提交
eas submit --platform android --latest
eas submit --platform ios --latest

# 查看构建
eas build:list
eas build:view [BUILD_ID]
eas build:download --id [BUILD_ID]
```

## ⏱️ 构建时间参考

| 平台 | 配置 | 预计时间 |
|------|------|----------|
| Android | Preview | 5-10 分钟 |
| Android | Production | 10-15 分钟 |
| iOS | Preview | 10-15 分钟 |
| iOS | Production | 15-25 分钟 |

## 💡 小贴士

1. **第一次构建推荐**: 使用 Android 预览版，最快速
   ```bash
   npm run build:android:preview
   ```

2. **查看构建进度**: 可以在 [Expo 控制台](https://expo.dev/) 查看详细进度

3. **下载构建文件**:
   ```bash
   eas build:download --platform android --profile preview
   ```

4. **取消构建**:
   ```bash
   eas build:cancel [BUILD_ID]
   ```

5. **清理凭据**（遇到证书问题时）:
   ```bash
   eas credentials
   # 选择平台 -> 删除所有凭据 -> 重新生成
   ```

## 📚 更多信息

- 详细指南: [EAS_BUILD_GUIDE.md](./EAS_BUILD_GUIDE.md)
- 项目文档: [README.md](./README.md)
- 快速启动: [QUICK_START.md](./QUICK_START.md)

---

**快速开始构建**: `npm run build:android:preview` 🚀
