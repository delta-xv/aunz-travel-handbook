# 澳新旅行手册

所有设备共用手机界面，最大宽度 430px，宽屏居中展示。日期和天气可用触摸或鼠标拖动。主手册与出团通知共用袋鼠、银蕨图片背景，两个图案按手机竖屏分开排列，完整缩放显示，以淡色水印和半透明内容底保持文字清晰；背景尺寸在页面打开时固定，滚动和地址栏收放不改变尺寸；屏幕宽度变化时重新适配。打印时不显示背景图。

澳大利亚、新西兰跟团旅行手册。行程：2026年9月24日—10月8日，12晚15天。

线上访问：[澳新旅行手册](https://delta-xv.github.io/aunz-travel-handbook/)。GitHub Pages 从 `main` 分支根目录自动发布。

## 浏览内容

- **今日**：按设备日期显示当天行程。出发前显示 D1，结束后显示返程信息。横滑日期条可预览其他天，点击“今天”恢复自动选择。
- **行程**：进入时定位当天行程，出发前定位 D1，结束后定位 D15。标题和筛选栏滚动时固定在顶部。点击日期在列表内展开详情，再次点击或按“收起”关闭；一次展开一天，景点介绍可单独展开。
- **地图**：Leaflet + OpenStreetMap 交互地图，可切换澳大利亚／新西兰，拖动、双指缩放，点击地点查看关联行程。“全程”显示上海往返澳新两国的完整路线，再次点击可关闭地点弹窗并恢复全程视野。澳大利亚／新西兰按钮聚焦对应国家，再次点击恢复该国视野。连线表示行程顺序，不代表实际道路或航线。

点击航班号直接打开 FlightAware 对应航班页面。页面可能默认显示最近一班，请核对出行日期。

城市与景点提供中文 Wikipedia 链接。没有对应词条时，提供百科搜索或标明相关词条。

地图组件在首次进入“地图”标签时加载，底图由浏览器直接向 OpenStreetMap 请求，不经过 GitHub Pages。不申请定位权限，不预下载离线地图；按服务端缓存规则复用瓦片。底图请求失败时保留行程标记并提供重试。OpenStreetMap 公共瓦片服务不保证可用性，手机所在网络需要能访问该服务。

## 天气与手机功能

天气由 Open-Meteo 提供，显示所选日期起四天的主要停留地预报。行程外日期使用上海，跨城日还需查看出发地天气。预报外的日期显示暂无数据；穿衣建议参考当地季节。

天气缓存 30 分钟，可手动刷新。联网失败时可显示 24 小时内的缓存，并标明时间；更早的缓存不再显示。地点天气时间采用当地时区，获取时间采用设备时区。

地点面板可选择高德、百度、Apple 或 Google 地图，也可复制名称自行搜索。App 是否打开取决于手机、浏览器和应用安装情况，海外地点需核对搜索结果。网页不申请定位权限，路线起点由地图处理。

浏览器支持时可用系统分享，否则提供复制面板。局域网 HTTP 地址通常不能调用系统分享；自动复制失败时可长按复制文字。公网网站的分享链接可直接打开；局域网链接需在能访问本机服务的网络中打开。

返回键可关闭地图和分享面板。每日行程在列表内展开，不使用全屏详情弹窗。原生弹窗或本地存储不可用时也可继续阅读。各品牌真机的地图 App 唤起尚未全部验证。

## 出团通知

页眉提供唯一的“出团通知”入口。打开后先显示目录，按团队信息、航班、旅行须知、保险、每日行程、费用和自费项目组织；点击标题阅读对应小节，可返回目录或切换上一节、下一节。保留通知正文、航班表、保险和费用表，删除市场价补差段落；合并 PDF 换行和跨页造成的断句，接回跨页的餐食及酒店地址。原稿中的入境物品图已逐项转为文字。原 PDF 仅作为转换源保留，页面不提供下载入口，也不加载任何图片或 PDF。

## 文件与离线使用

```text
index.html                     主手册
assets/handbook-content.js      行程、景点和穿衣说明
assets/handbook.js              日期、天气、导航等交互
assets/handbook.css             布局与触屏样式
assets/logbook.css              主手册和资料区共用的路书风格
assets/aunz-background-portrait.png  袋鼠与银蕨竖屏背景
assets/background.js            背景尺寸与屏幕方向适配
assets/route-map.js             交互地图、地点和行程连线
assets/route-map.css            地图触屏样式
assets/vendor/leaflet-1.9.4/     Leaflet 组件与许可证

documents.html                 出团通知目录与章节
assets/documents.css           阅读器布局
assets/documents.js            目录导航与章节切换
assets/documents/               原 PDF
```

复制或部署时保留整个目录。文件保存在本机后，可用支持 JavaScript 的浏览器离线阅读行程和出团通知。地图底图、天气、百科、外部地图和航班动态需要联网。通过网址访问时要先加载资源，目前没有自动离线安装功能。

## 公网访问与更新

网站：https://delta-xv.github.io/aunz-travel-handbook/

仓库：https://github.com/delta-xv/aunz-travel-handbook

GitHub Pages 从 `main` 分支根目录发布，使用 `.nojekyll` 直接提供静态文件。将页面、脚本、样式和资料的修改提交并推送到 `main` 后，GitHub 自动部署。网站运行不依赖本机开机。

## 局域网访问

在项目目录运行，将地址换成本机局域网 IP：

```sh
python3 -m http.server 48765 --bind <本机局域网IP>
```

手机连接同一局域网，访问 `http://<本机局域网IP>:48765/index.html`。服务期间电脑需保持开机且不休眠。

航班采用出团通知中的航班号，并按出行日期查询公开计划时刻。实时延误、取消和登机口以航司通知为准；集合地点、住宿与游览安排以出团通知和领队通知为准。

## 外部链接格式

[高德 URI](https://lbs.amap.com/api/uri-api/guide/search/search)、[百度 Web URI](https://lbsyun.baidu.com/faq/api?title=webapi%2Furi%2Fweb)、[Apple Map Links](https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html)、[Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started)、[Windy 地点链接](https://community.windy.com/topic/77/windy-com-url-parameters)。

## 原稿转换

`python3 scripts/build-notice.py` 使用本地的 pdfplumber 和 lxml 将原 PDF 转成 HTML。脚本识别标题并生成目录，合并连续正文和跨页续行，保留表格单元格与跨行、跨列关系。先逐页校对全部非空白字符，再校验输出章节仅移除了指定的市场价补差段落和 PDF 页码；列表符号统一为可显示的圆点。入境物品图的清单按原图逐项转录。若 PDF 页数或表格结构变化，需要先核对脚本中的表格选择。运行前优先使用项目虚拟环境。

发布前运行 `node scripts/version-assets.mjs`，按文件内容更新 HTML 中的静态资源版本，避免浏览器沿用旧脚本。

地图使用 [Leaflet 1.9.4](https://leafletjs.com/) 和 [OpenStreetMap](https://www.openstreetmap.org/copyright)，遵守[瓦片使用政策](https://operations.osmfoundation.org/policies/tiles/)。底图地址配置在 `index.html` 的 `data-tile-url`，更换服务商时同步修改署名。
