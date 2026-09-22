# 澳新旅行日志

面向手机的澳大利亚、新西兰跟团旅行手册。行程：2026年9月24日—10月8日，12晚15天。

线上访问：[澳新旅行日志](https://delta-xv.github.io/aunz-travel-handbook/)。GitHub Pages 从 `main` 分支根目录自动发布。

## 浏览内容

- **今日**：按设备日期显示当天行程。出发前显示 D1，结束后显示返程信息。横滑日期条可预览其他天，点击“今天”恢复自动选择。
- **行程**：进入时定位当天行程，出发前定位 D1，结束后定位 D15。标题和筛选栏滚动时固定在顶部。点击日期查看详情，正文左右滑动或用底部按钮换日；景点介绍可展开。
- **地图**：澳大利亚、新西兰路线图，城市间的航班、巴士和往返线路。

城市与景点提供中文 Wikipedia 链接。没有对应词条时，提供百科搜索或标明相关词条。

## 天气与手机功能

天气由 Open-Meteo 提供，显示所选日期起四天的主要停留地预报。行程外日期使用上海，跨城日还需查看出发地天气。预报外的日期显示暂无数据；穿衣建议参考当地季节。

天气缓存 30 分钟，可手动刷新。联网失败时可显示 24 小时内的缓存，并标明时间；更早的缓存不再显示。地点天气时间采用当地时区，获取时间采用设备时区。

地点面板可选择高德、百度、Apple 或 Google 地图，也可复制名称自行搜索。App 是否打开取决于手机、浏览器和应用安装情况，海外地点需核对搜索结果。网页不申请定位权限，路线起点由地图处理。

浏览器支持时可用系统分享，否则提供复制面板。局域网 HTTP 地址通常不能调用系统分享；自动复制失败时可长按复制文字。公网网站的分享链接可直接打开；局域网链接需在能访问本机服务的网络中打开。

返回键可逐层关闭详情和面板。不支持手势时仍可用按钮；原生弹窗或本地存储不可用时也可继续阅读。各品牌真机的地图 App 唤起尚未全部验证。

## 出团通知

页眉提供唯一的“出团通知”入口。打开后从第一页阅读，保留上一页、下一页、图片缩放和原 PDF 下载。原 PDF 和页图保持原样，阅读器不使用外部 PDF 服务。

## 文件与离线使用

```text
index.html                     主手册
assets/handbook-content.js      行程、景点和穿衣说明
assets/handbook.js              日期、天气、导航等交互
assets/handbook.css             布局与触屏样式
assets/logbook.css              主手册和资料区共用的日志风格
assets/route-map.png            路线底图

documents.html                 出团通知阅读器
assets/documents.css           阅读器布局
assets/documents.js            翻页和缩放
assets/documents/               原 PDF 与逐页图片
```

复制或部署时保留整个目录。文件保存在本机后，可用支持 JavaScript 的浏览器离线阅读行程、路线图和出团通知。天气、百科、外部地图和航班动态需要联网。通过网址访问时要先加载资源，目前没有自动离线安装功能。

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
