# EAS 云构建配置总结

## ✅ 已完成的配置

### 1. EAS 配置文件 (eas.json)

已创建并配置了完整的构建配置文件，包含以下构建 profile：

- **development**: 开发版本
- **preview**: 预览/测试版本（Android APK + iOS 模拟器）
- **preview-device**: 真机测试版本
- **production**: 生产版本（APK）
- **production-aab**: 生产版本（AAB，用于 Google Play）

### 2. 应用配置 (app.json)

已更新应用信息：

```json
{
  "name": "Piano Practice",
  "slug": "piano-practice-app",
  "version": "1.0.0",
  "ios": {
    "bundleIdentifier": "com.pianopractice.app",
    "buildNumber": "1.0.0"
  },
  "android": {
    "package": "com.pianopractice.app",
    "versionCode": 1
  }
}
```

### 3. NPM Scripts (package.json)

已添加便捷的构建脚本：

```json
{
  "scripts": {
    "build:android:preview": "eas build --platform android --profile preview",
    "build:android:production": "eas build --platform android --profile production",
    "build:android:aab": "eas build --platform android --profile production-aab",
    "build:ios:preview": "eas build --platform ios --profile preview",
    "build:ios:production": "eas build --platform ios --profile production",
    "build:all:preview": "eas build --platform all --profile preview",
    "build:all:production": "eas build --platform all --profile production",
    "submit:android": "eas submit --platform android --latest",
    "submit:ios": "eas submit --platform ios --latest",
    "build:list": "eas build:list",
    "build:status": "eas build:list --limit 5"
  }
}
```

### 4. 文档

创建了完整的构建文档：

- **EAS_BUILD_GUIDE.md**: 详细的云构建指南（完整版）
- **BUILD_COMMANDS.md**: 快速命令参考卡片
- **README.md**: 已更新，包含 EAS 构建说明

## 🚀 快速开始使用

### 第一次构建（3 步骤）

```bash
# 步骤 1: 安装 EAS CLI
npm install -g eas-cli

# 步骤 2: 登录 Expo 账号
eas login

# 步骤 3: 构建 Android 测试版
npm run build:android:preview
```

### 构建过程

1. **触发构建**: 运行命令后，代码会上传到 EAS 云服务器
2. **云端构建**: EAS 在云端编译应用（无需本地 Android Studio/Xcode）
3. **等待完成**: 约 5-15 分钟（取决于平台和配置）
4. **下载文件**: 构建完成后会得到下载链接

## 📱 支持的构建类型

### Android

| Profile | 输出 | 用途 | 命令 |
|---------|------|------|------|
| `preview` | APK | 内部测试 | `npm run build:android:preview` |
| `production` | APK | 直接分发 | `npm run build:android:production` |
| `production-aab` | AAB | Google Play | `npm run build:android:aab` |

### iOS

| Profile | 输出 | 用途 | 命令 |
|---------|------|------|------|
| `preview` | App (Simulator) | 模拟器测试 | `npm run build:ios:preview` |
| `preview-device` | IPA | 真机测试 | 使用完整命令 |
| `production` | IPA | App Store | `npm run build:ios:production` |

## 🎯 推荐工作流

### 开发阶段
```bash
npm start  # 使用 Expo Go 快速迭代
```

### 测试阶段
```bash
npm run build:android:preview  # 构建测试版
# 下载 APK 在真机测试
```

### 发布阶段
```bash
# Android
npm run build:android:aab      # 构建 AAB
npm run submit:android         # 提交到 Google Play

# iOS
npm run build:ios:production   # 构建 IPA
npm run submit:ios             # 提交到 App Store
```

## 📋 构建前检查清单

### 首次构建前

- [ ] 安装 EAS CLI: `npm install -g eas-cli`
- [ ] 登录 Expo: `eas login`
- [ ] 检查 `app.json` 中的应用信息
- [ ] 检查 `eas.json` 配置是否正确

### Android 发布前

- [ ] 更新版本号（`app.json` 中的 `version` 和 `versionCode`）
- [ ] 准备应用图标和截图
- [ ] 编写应用描述
- [ ] （可选）配置 Google Play 服务账号

### iOS 发布前

- [ ] 更新版本号（`app.json` 中的 `version` 和 `buildNumber`）
- [ ] 配置 Apple Developer 账号
- [ ] 准备应用图标和截图
- [ ] 编写应用描述
- [ ] 配置 App Store Connect

## 💡 实用技巧

### 1. 查看构建进度

```bash
# 命令行查看
npm run build:status

# 或访问 Expo 控制台
# https://expo.dev/accounts/[your-account]/projects/piano-practice-app/builds
```

### 2. 下载构建产物

```bash
# 下载最新的 Android 预览版
eas build:download --platform android --profile preview

# 下载特定构建
eas build:download --id [BUILD_ID]
```

### 3. 本地构建（需要本地环境）

```bash
# 如果已安装 Android Studio
eas build --platform android --profile preview --local

# 如果已安装 Xcode (仅 Mac)
eas build --platform ios --profile preview --local
```

### 4. 查看构建日志

```bash
# 查看特定构建的详细日志
eas build:view [BUILD_ID]
```

## ⚠️ 常见问题

### 1. 构建失败

**解决方案**:
```bash
# 检查依赖
npx expo install --fix

# 清理并重新安装
rm -rf node_modules
npm install

# 重新构建
npm run build:android:preview
```

### 2. iOS 证书问题

**解决方案**:
```bash
# 使用 EAS 管理证书（推荐）
eas credentials

# 选择: iOS -> Production -> Generate new credentials
```

### 3. 版本号冲突

**解决方案**:
在 `app.json` 中更新版本号：
```json
{
  "version": "1.0.1",
  "ios": { "buildNumber": "1.0.1" },
  "android": { "versionCode": 2 }
}
```

## 📊 构建配置对比

| 特性 | Development | Preview | Production |
|------|-------------|---------|------------|
| 包大小 | 大 | 中 | 小 |
| 调试信息 | 完整 | 部分 | 无 |
| 性能 | 较慢 | 中等 | 最快 |
| 用途 | 开发调试 | 内部测试 | 正式发布 |

## 🔗 相关链接

- [EAS 官方文档](https://docs.expo.dev/build/introduction/)
- [Expo 控制台](https://expo.dev/)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com/)

## 📞 获取帮助

如果遇到问题：

1. 查看 [EAS_BUILD_GUIDE.md](./EAS_BUILD_GUIDE.md) 详细指南
2. 查看 [Expo 官方文档](https://docs.expo.dev/)
3. 访问 [Expo 论坛](https://forums.expo.dev/)
4. 查看 [GitHub Issues](https://github.com/expo/expo/issues)

## ✅ 下一步

现在您可以：

1. **立即尝试**: 运行 `npm run build:android:preview` 构建第一个测试版
2. **测试应用**: 下载 APK 在真机测试所有功能
3. **准备发布**: 完善应用信息和资源后构建生产版
4. **提交商店**: 使用 `npm run submit:android/ios` 提交到应用商店

---

**开始构建**: `npm run build:android:preview` 🚀

**预计时间**: 5-15 分钟

**输出**: 可安装的 APK 文件
