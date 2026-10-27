# 楹你而心动 · 小安写给小楹的情书

这是一个由 HTML、CSS 和 JavaScript 组成的私人浪漫告白网页。

## 打开方式

1. 解压整个工程包，保留 `assets` 文件夹与 `index.html` 的相对位置。
2. 进入 `dist` 文件夹，双击其中的 `index.html`，用 Chrome、Edge、Safari 或 Firefox 打开。
3. 点击页面上的音乐按钮，可开启原创的轻柔合成钢琴旋律（默认静音）。
4. 点击信封打开完整情书；点击照片可放大浏览，点击五颗星星解锁隐藏告白。

所有核心效果使用本地代码实现，不需要联网，也不收集或上传访客数据。照片仅随压缩包交付，请在分享工程包或发布到互联网前确认双方都愿意公开这些照片。

## 工程结构

- `dist/index.html`：九个章节、照片与完整长情书。
- `dist/styles.css`：视觉设计、响应式排版和交互动效。
- `dist/script.js`：粒子动画、音乐、照片灯箱、信封、星空和烟花。
- `dist/assets/photos/`：九张由用户上传的真实照片，未进行人脸合成或外貌改造。

## GitHub Pages 在线发布

工程已包含 `.github/workflows/deploy-pages.yml`，会将 `dist` 中的网页发布到 GitHub Pages。

1. 将工程上传到 GitHub 仓库的 `main` 分支，保留 `dist` 和 `.github/workflows` 的目录结构。
2. 在仓库中打开 **Settings → Pages**，将 **Source** 设为 **GitHub Actions**。
3. 在 **Actions** 中打开 **Deploy website to GitHub Pages**，点击 **Run workflow**；后续向 `main` 推送网页修改会自动发布。
4. 部署成功后，在 **Settings → Pages** 或部署任务的 `github-pages` 环境中打开网站地址。

通常地址为 `https://你的GitHub用户名.github.io/仓库名/`。网页、照片和文字在发布后可被访问；`noindex` 只用于请求搜索引擎不收录，不提供访问权限保护。

## 定制

- 文字与情书可直接在 `dist/index.html` 中修改。
- 图片文件可在 `dist/assets/photos/` 中替换，保持原文件名即可。
- 网页标题、颜色和动画时长在 HTML 与 CSS 中修改。
- 音乐通过浏览器 Web Audio 生成，没有外部音频依赖。

## 兼容性

支持桌面与手机现代浏览器。如果系统开启了“减少动态效果”，网页会自动减少动画。建议优先使用较新的 Chrome、Edge、Safari 或 Firefox。

希望小楹读完之后，会记得这一份来自小安的认真与温柔。
