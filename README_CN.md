# EV Explorer

EV Explorer 是一个使用 Vite、React 和 TypeScript 构建的电动汽车规格数据可视化项目。项目围绕两类用户场景设计：潜在购车用户和数据分析用户。

## 项目目标

本项目旨在通过交互式散点图和对比表，帮助用户理解 2025 年电动汽车市场。购车用户可以根据生活方式选择不同画像，分析符合自身需求的车型；分析用户可以输入自定义或假设的 EV 参数，并与真实市场数据进行对比。

## 目标用户

- 想根据城市通勤、长途驾驶、家庭使用或性能需求筛选车型的潜在 EV 买家。
- 希望将自定义 EV 参数与市场车型进行对比的数据可视化课程学生或分析用户。

## 功能模式

### For Buyers

购车模式包含四个用户画像：

- City Commuter：关注能耗效率、紧凑尺寸和日常续航。
- Long-Distance Driver：关注长续航和直流快充能力。
- Family User：关注座位数、后备箱容积和车内实用性。
- Performance User：关注加速、扭矩和最高速度。

每个画像都使用同一个可复用散点图组件，只是切换不同的图表配置。用户可以按品牌、电池类型、驱动形式、车身类型、续航和电池容量进行筛选。鼠标悬停可查看 tooltip，点击散点可打开车型详情面板和数据源链接。

### For Analysis

分析模式允许用户输入自定义 EV 参数，并提供四个可切换的分析视图：

- Battery Capacity vs Range：分析电池容量与续航是否匹配。
- Range vs Fast Charging Power：分析长途驾驶能力。
- Efficiency vs Range：分析能耗与续航质量。
- Torque vs Acceleration：分析性能表现。

提交自定义 EV 后，系统会：

- 在散点图中以高亮点标注 `Your EV`。
- 显示 range、fast charging、efficiency、acceleration、torque 的百分位卡片。
- 基于可用数值字段计算 Top 5 最相似车型。
- 展示自定义 EV 与相似车型的对比表。
- 在缺少当前图表所需字段时显示缺失字段提示。

所有散点图都支持鼠标滚轮缩放，并且缩放时页面不会上下滚动。

## 数据集

项目从以下路径加载 CSV：

```text
public/data/electric_vehicles_spec_2025.csv
```

数据来源：
[Kaggle - Electric Vehicle Specifications Dataset 2025](https://www.kaggle.com/datasets/urvishahir/electric-vehicle-specifications-dataset-2025/data)

数据字段包括 brand、model、top speed、battery capacity、battery type、torque、efficiency、range、acceleration、fast charging power、cargo volume、seats、drivetrain、segment、尺寸、车身类型和 source URL 等。

数值字段会进行安全解析。如果某个值无法解析，会被视为 `null`，并从需要该字段的计算中排除。

## 安装

请先安装 Node.js LTS，然后运行：

```sh
npm.cmd install
```

在 Windows PowerShell 中推荐使用 `npm.cmd`，避免脚本执行策略拦截 `npm.ps1`。

## 本地运行

```sh
npm.cmd run dev
```

打开 Vite 输出的本地地址，通常是：

```text
http://localhost:5173
```

## 构建

```sh
npm.cmd run build
```

构建后的静态文件会生成在 `dist/` 目录中。

## 预览生产构建

```sh
npm.cmd run preview
```

## 部署

EV Explorer 已配置为发布到 GitHub Pages：

```text
https://2022149034.github.io/ev-explorer/
```

项目中的 Vite `base` 已设置为 `/ev-explorer/`，CSV 数据也通过
`import.meta.env.BASE_URL` 加载，因此可以在 GitHub Pages 的项目子路径下正常运行。

自动部署工作流位于 `.github/workflows/deploy-pages.yml`。

如果需要手动部署到其他静态托管平台：

1. 运行 `npm.cmd run build`。
2. 将 `dist/` 上传到 Netlify、Vercel、GitHub Pages 或 Cloudflare Pages 等静态托管平台。
3. 如果通过 Git 仓库连接部署，构建命令设置为 `npm.cmd run build`，输出目录设置为 `dist`。
