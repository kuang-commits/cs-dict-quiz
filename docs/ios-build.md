# 打 iOS 安装包（EAS）

这是内部试用包，不是上架 App Store。包名是 `com.kuang.csdictquiz`（Android 包名相同）。

## 你需要先有

- 一个 [Expo](https://expo.dev) 账号，并在本机执行 `npx eas-cli login`。
- 已付费的 Apple Developer Program。Ad Hoc / 内部安装必须用它签发描述文件，免费 Apple ID 打不出可安装的 IPA。
- 要安装的 iPhone 已登记到该开发者账号。第一次可以执行 `npx eas-cli device:create`，按提示用手机打开注册链接。

## 打 preview 包

在项目根目录：

```bash
npm install
npx eas-cli build -p ios --profile preview
```

`preview` 在 `eas.json` 里是 `distribution: "internal"`，并且 `ios.simulator` 为 false，所以产物是装到真机的 IPA（Ad Hoc），不是模拟器包。构建在 Expo 的云端进行，本机不需要装 Xcode。

`development` 配置会打带开发客户端的内部包，用来连本地 `npx expo start`。日常试用用 `preview` 即可。

## 密钥不要进仓库

- 不要把 `.p12`、`.p8`、`.mobileprovision`、Apple 密码或 Expo token 提交到 git。证书交给 EAS 保管即可。
- Judge0 / Piston 的地址和密钥只放在本机 `.env`（已忽略）。变量名是 `EXPO_PUBLIC_JUDGE0_URL`、`EXPO_PUBLIC_JUDGE0_KEY`、`EXPO_PUBLIC_PISTON_URL`。`.env.example` 里只有空值。
- `EXPO_PUBLIC_` 开头的值会打进安装包，不要在里面放真正的私密密钥。自建判题如果必须带 token，优先用你自己的 Judge0，并接受它会出现在客户端里。
- CI 里的 `EXPO_TOKEN` 只放在 CI 的密钥库，不写进仓库。

EAS 第一次构建时会问是否创建项目并生成 `extra.eas.projectId`。那是项目编号，不是密码；按提示写回配置即可，不要手写别人的编号。
