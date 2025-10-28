# EAS 云构建指南

本指南将帮助您使用 Expo Application Services (EAS) 进行云构建，无需本地配置 Xcode 或 Android Studio。

## 📋 前置准备

### 1. 安装 EAS CLI

```bash
npm install -g eas-cli
```

### 2. 登录 Expo 账号

```bash
# 登录（如果还没有账号会提示注册）
eas login

# 查看当前登录状态
eas whoami
```

### 3. 配置项目

```bash
# 在项目目录下初始化 EAS（如果还没有 eas.json）
cd /Volumes/doc/workspace/project/phone-test/PianoPracticeApp
eas build:configure
```

## 🚀 构建命令

### Android 构建

#### 1. 开发版本 (Internal Testing)

```bash
# 构建开发版 APK
eas build --platform android --profile development

# 构建开发版并自动安装到设备
eas build --platform android --profile development --local
```

#### 2. 预览版本 (Preview/Testing)

```bash
# 构建预览版 APK（用于内部测试）
eas build --platform android --profile preview

# 构建预览版并下载到本地设备
eas build --platform android --profile preview-device
```

#### 3. 生产版本 (Production)

```bash
# 构建生产版 APK（可直接安装）
eas build --platform android --profile production

# 构建生产版 AAB（用于上传 Google Play）
eas build --platform android --profile production-aab
```

### iOS 构建

#### 1. 开发版本

```bash
# 构建开发版
eas build --platform ios --profile development
```

#### 2. 预览版本 (Simulator)

```bash
# 构建 iOS 模拟器版本
eas build --platform ios --profile preview
```

#### 3. 生产版本

```bash
# 构建生产版（需要配置证书）
eas build --platform ios --profile production
```

### 同时构建 iOS 和 Android

```bash
# 构建两个平台的预览版
eas build --platform all --profile preview

# 构建两个平台的生产版
eas build --platform all --profile production
```

## 📱 快速开始 - 推荐工作流

### 第一次构建（测试用）

```bash
# 1. 登录 Expo
eas login

# 2. 构建 Android 预览版（最快，推荐第一次尝试）
eas build --platform android --profile preview

# 3. 等待构建完成（5-15分钟）
# 4. 下载生成的 APK 文件
# 5. 安装到 Android 设备测试
```

### 生产构建（发布用）

```bash
# Android: 构建 AAB 用于 Google Play
eas build --platform android --profile production-aab

# iOS: 构建 IPA 用于 App Store
eas build --platform ios --profile production
```

## 🔧 配置说明

### eas.json 配置文件结构

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"  // 生成 APK
      },
      "ios": {
        "simulator": true   // iOS 模拟器版本
      }
    },
    "preview-device": {
      "extends": "preview",
      "distribution": "internal",
      "ios": {
        "simulator": false  // iOS 真机版本
      }
    },
    "production": {
      "autoIncrement": true,  // 自动递增版本号
      "android": {
        "buildType": "apk"    // 生产版 APK
      }
    },
    "production-aab": {
      "extends": "production",
      "android": {
        "buildType": "app-bundle"  // Google Play AAB 格式
      }
    }
  }
}
```

## 📦 构建类型说明

### Android 构建类型

| 类型 | 用途 | 命令 |
|------|------|------|
| **APK** | 可直接安装到设备 | `--profile preview` 或 `--profile production` |
| **AAB** | 上传到 Google Play | `--profile production-aab` |

### iOS 构建类型

| 类型 | 用途 | 命令 |
|------|------|------|
| **Simulator** | 仅在模拟器运行 | `--profile preview` |
| **Device** | 真机测试 | `--profile preview-device` |
| **Production** | App Store 发布 | `--profile production` |

## 🎯 常用命令

### 查看构建状态

```bash
# 查看所有构建
eas build:list

# 查看特定平台的构建
eas build:list --platform android
eas build:list --platform ios

# 查看构建详情
eas build:view [BUILD_ID]
```

### 下载构建文件

```bash
# 下载最新构建
eas build:download --platform android --profile preview

# 下载指定构建
eas build:download --id [BUILD_ID]
```

### 取消构建

```bash
# 取消正在进行的构建
eas build:cancel [BUILD_ID]
```

## 📝 应用信息配置

### 更新 app.json

在构建前，建议更新 `app.json` 中的应用信息：

```json
{
  "expo": {
    "name": "Piano Practice App",
    "slug": "piano-practice-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.pianopractice",
      "buildNumber": "1.0.0",
      "supportsTablet": true
    },
    "android": {
      "package": "com.yourcompany.pianopractice",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

## 🔐 iOS 证书配置

对于 iOS 生产构建，您需要：

### 方式 1: 自动管理（推荐）

```bash
# EAS 会自动处理证书
eas build --platform ios --profile production
```

首次构建时会提示：
- 是否生成新的证书
- 是否使用 Apple Developer 账号

### 方式 2: 手动管理

```bash
# 配置凭据
eas credentials

# 选择 iOS -> 生产环境 -> 配置证书
```

需要：
- Apple Developer 账号
- Distribution Certificate
- Provisioning Profile

## 📤 提交到应用商店

### 提交到 Google Play

```bash
# 1. 先构建 AAB
eas build --platform android --profile production-aab

# 2. 配置服务账号密钥（首次需要）
# 从 Google Play Console 下载 JSON 密钥文件
# 放置到项目根目录并命名为 google-service-account.json

# 3. 提交
eas submit --platform android --latest
```

### 提交到 App Store

```bash
# 1. 先构建 iOS 生产版
eas build --platform ios --profile production

# 2. 提交
eas submit --platform ios --latest
```

## 🐛 常见问题

### 1. 构建失败 - 依赖问题

```bash
# 清理并重新安装依赖
rm -rf node_modules
npm install

# 修复 Expo 包版本
npx expo install --fix

# 重新构建
eas build --platform android --profile preview
```

### 2. Android 构建超时

```bash
# 使用本地构建（需要 Android SDK）
eas build --platform android --profile preview --local
```

### 3. iOS 证书错误

```bash
# 清理凭据重新配置
eas credentials

# 选择 iOS -> 删除所有凭据 -> 重新生成
```

### 4. 版本号冲突

在 `app.json` 中更新版本：

```json
{
  "expo": {
    "version": "1.0.1",
    "ios": {
      "buildNumber": "1.0.1"
    },
    "android": {
      "versionCode": 2
    }
  }
}
```

## 💡 最佳实践

### 1. 开发流程

```bash
# 开发阶段: 使用 Expo Go
npm start

# 测试阶段: 构建预览版
eas build --platform android --profile preview

# 发布阶段: 构建生产版
eas build --platform android --profile production-aab
```

### 2. 版本管理

- 每次发布前递增版本号
- 使用 Git 标签标记发布版本
- 在 `CHANGELOG.md` 中记录变更

### 3. 测试建议

- 先构建 Android 预览版（快速、免费）
- 在真机上测试完整功能
- 确认无误后再构建生产版

## 📊 构建时间参考

| 平台 | 配置 | 预计时间 |
|------|------|----------|
| Android | Preview | 5-10 分钟 |
| Android | Production | 10-15 分钟 |
| iOS | Preview | 10-15 分钟 |
| iOS | Production | 15-25 分钟 |

## 🔗 相关资源

- [EAS Build 官方文档](https://docs.expo.dev/build/introduction/)
- [EAS Submit 官方文档](https://docs.expo.dev/submit/introduction/)
- [应用商店发布指南](https://docs.expo.dev/distribution/introduction/)

## 📱 快速测试命令（推荐）

```bash
# 第一次尝试 - 构建 Android APK
eas build --platform android --profile preview

# 构建成功后会显示下载链接
# 下载 APK 文件到手机安装即可测试
```

---

## 🎉 完整工作流示例

### 从开发到发布的完整流程

```bash
# 1. 开发阶段（本地）
npm start
# 使用 Expo Go 测试

# 2. 构建测试版
eas login
eas build --platform android --profile preview
# 下载 APK 在真机测试

# 3. 修复 Bug 并更新版本
# 更新 app.json 中的版本号

# 4. 构建生产版
eas build --platform android --profile production-aab
eas build --platform ios --profile production

# 5. 提交到应用商店
eas submit --platform android --latest
eas submit --platform ios --latest

# 6. 标记 Git 版本
git tag v1.0.0
git push origin v1.0.0
```

---

**祝您构建顺利！** 🚀

如有问题，请参考 [Expo 官方文档](https://docs.expo.dev/) 或提交 Issue。
