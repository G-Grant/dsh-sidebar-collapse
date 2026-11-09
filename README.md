# dsh-sidebar-collapse

独立折叠 DeepSeek Harness 侧边栏的功能入口栏，为工作区腾出空间。折叠状态保存在浏览器本地存储中，重启后保持。

## 开发

项目使用 TypeScript 编写，构建产物位于 `dist/`：

```bash
pnpm install
pnpm typecheck
pnpm build
```

`pnpm check` 会依次执行类型检查、构建和 Node.js 入口语法检查。

## DSH bundle 入口

`package.json` 保留 DSH bundle 所需的 `dsh.bundle.patch` 和 `dsh.client` 配置。发布包的 `main`、`exports` 与 `dsh.client` 使用 `dist/index.js`、`dist/client.js`，因此安装发布包时仍会加载编译后的 JavaScript 入口；TypeScript 源码保存在 `src/` 中。

## 发布

在 `main` 分支更新 `package.json` 的 `version` 并提交后，GitHub Actions 会运行检查、创建对应的 GitHub Release，并上传插件 tarball。预发布版本（例如 `0.2.0-beta.1`）会自动标记为 prerelease。
