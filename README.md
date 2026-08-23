# 乐融建材 · 门户网站

一个纯静态的装饰隔墙公司门户网站，无数据库、无后端依赖，可直接搭配 Nginx 运行。

## 网站结构

```
lelong_site/
├── index.html      首页（轮播 / 关于 / 产品 / 优势 / 数据 / 案例 / 流程 / 新闻 / CTA）
├── about.html      关于我们（简介 / 理念 / 历程 / 资质）
├── products.html   产品中心（加气砖 / ALC板材 / 复合板 / 辅材，含规格参数）
├── cases.html      工程案例（4 大分类筛选，支持 ?f= 参数直达）
├── news.html       新闻资讯（8 篇知识/动态文章 + 分页）
├── contact.html    联系我们（联系信息 / 留言表单 / FAQ）
├── images/         实拍照片（8 张原图的大/小两个 Web 规格，共 16 个 JPG）
├── css/style.css   全局样式（含响应式，适配手机/平板/桌面）
├── js/main.js      交互脚本（轮播/菜单/动画/计数/筛选/表单校验）
└── nginx.conf      Nginx 配置示例
```

## 特点

- **零依赖**：不引用任何外部 CSS/JS/字体，图片为本地实拍照片 + 内置 SVG 图标，离线可用
- **响应式**：桌面 / 平板 / 手机自适应，移动端汉堡菜单
- **交互动效**：轮播、滚动显现、数字滚动、案例分类筛选、返回顶部
- **SEO 友好**：每个页面独立 title / description / keywords，语义化标签

## 本地预览

任意静态服务器均可，例如：

```bash
# Python
cd lelong_site && python -m http.server 8080

# 或 Node
npx serve lelong_site
```

浏览器访问 http://localhost:8080

## Nginx 部署

1. 将 `site/` 目录内容上传到服务器（示例路径 `/var/www/portal`）：

   ```bash
   scp -r lelong_site/* root@your-server:/var/www/portal/
   ```

2. 将 `nginx.conf` 中的 `server_name` 改为您的域名，内容并入 nginx 主配置：

   ```bash
   cp nginx.conf /etc/nginx/conf.d/portal.conf
   nginx -t && nginx -s reload
   ```

3. （建议）申请 HTTPS 证书并启用配置文件中注释的 443 段落。

## 上线前需要替换的占位内容

| 位置 | 占位内容 | 说明 |
|------|----------|------|
| 页脚 | service@leirongjc.cn | 替换为实际邮箱 |
| 页脚 | 某某市某某区某某路88号… | 替换为实际地址 |
| contact.html | 留言表单 | 纯前端演示，接入第三方表单或后端接口后才能真正收集 |

> 公司名（重庆乐融建材有限公司）、电话（18723377259）、成立时间（2018年6月）已全站替换完成。
> 当前使用境外服务器，无需 ICP 备案，页脚备案号已移除；若日后迁回国内服务器，需完成备案后再在页脚补上备案号。

## 后续可扩展

- 补充更多项目照片，逐步替换 cases.html 中剩余的 12 张 SVG 案例封面（首页轮播/产品/关于均已使用实拍图）
- 在 contact.html 地图占位处嵌入高德/百度地图组件
- 新闻详情页（目前为列表展示，可按需增加 `news/` 子页面）
