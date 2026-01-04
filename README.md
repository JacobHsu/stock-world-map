# 🌐 World Stock - 全球股市指數地圖

一個互動式的全球股市指數地圖應用程式，使用 amCharts 5 在世界地圖上即時顯示主要股市指數與國家 ETF 數據，並根據漲跌幅動態改變國家顏色。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green.svg)

## 📸 功能預覽

### 主要功能

- 🗺️ **互動式世界地圖** - 使用 amCharts 5 渲染的高品質 SVG 地圖
- 📈 **即時股市數據** - 透過 Yahoo Finance API 獲取即時股市指數
- 🌍 **國家 ETF 模式** - 支援 40 個國家/地區的 ETF 即時報價（美國慣例：綠漲紅跌）
- 🎨 **動態顏色顯示** - 國家顏色根據股市漲跌自動變化
- 🚩 **圓形國旗標記** - 在地圖上顯示各國圓形國旗圖示
- 📋 **可拖曳資訊卡** - 可自由拖曳定位的股市資訊卡片
- 🔄 **雙模式切換** - 股市指數（8國）與國家 ETF（40國）快速切換

## 🌍 支援市場

### 股市指數模式（8 國）

| 國家/地區 | 指數名稱 | 代號 | 交易時段 (台北時間) |
|:---------:|:--------:|:----:|:-------------------:|
| 🇺🇸 美國 | 道瓊指數 | ^DJI | 21:30-04:00 |
| 🇬🇧 英國 | FTSE 100 | ^FTSE | 16:00-00:30 |
| 🇩🇪 德國 | DAX | ^GDAXI | 16:00-00:30 |
| 🇫🇷 法國 | CAC 40 | ^FCHI | 16:00-00:30 |
| 🇰🇷 南韓 | KOSPI | ^KS11 | 08:00-14:30 |
| 🇯🇵 日本 | 日經 225 | ^N225 | 08:00-14:00 |
| 🇭🇰 香港 | 恆生指數 | ^HSI | 09:30-16:00 |
| 🇹🇼 台灣 | 加權指數 | ^TWII | 09:00-13:30 |

### 國家 ETF 模式（40 國）

| 區域 | 國家/ETF |
|:----:|:---------|
| **北美** | 🇺🇸 VTI, VUG, VTV / 🇨🇦 EWC |
| **南美** | 🇧🇷 EWZ / 🇲🇽 EWW / 🇦🇷 ARGT / 🇨🇴 ICOL |
| **西歐** | 🇬🇧 EWU / 🇩🇪 EWG / 🇫🇷 EWQ / 🇮🇹 EWI / 🇪🇸 EWP / 🇳🇱 EWN / 🇨🇭 EWL |
| **北歐** | 🇸🇪 EWD / 🇳🇴 NORW / 🇩🇰 EDEN |
| **中東歐** | 🇵🇱 EPOL / 🇧🇪 EWK / 🇮🇪 EIRL / 🇦🇹 EWO |
| **東亞** | 🇯🇵 EWJ / 🇰🇷 EWY / 🇭🇰 EWH / 🇹🇼 EWT / 🇨🇳 CNYA |
| **東南亞** | 🇸🇬 EWS / 🇮🇩 EIDO / 🇹🇭 THD / 🇻🇳 VNM / 🇵🇭 EPHE / 🇲🇾 EWM |
| **南亞** | 🇮🇳 INDA |
| **大洋洲** | 🇦🇺 EWA |
| **中東** | 🇹🇷 TUR / 🇸🇦 KSA / 🇮🇱 EIS / 🇦🇪 UAE |
| **非洲** | 🇿🇦 EZA |

## 🚀 快速開始

### 方法一：直接開啟

由於本專案為純前端應用，您可以直接在瀏覽器中開啟：

```bash
# 直接開啟 index.html 即可使用
open index.html      # macOS
start index.html     # Windows
xdg-open index.html  # Linux
```

### 方法二：使用本地伺服器

為獲得更好的開發體驗，建議使用本地伺服器：

```bash
# 使用 Python 3
python -m http.server 8080

# 使用 Node.js (http-server)
npx http-server -p 8080

# 使用 VS Code Live Server 擴充套件
# 右鍵點擊 index.html → "Open with Live Server"
```

然後在瀏覽器中開啟 `http://localhost:8080`

## 📁 專案結構

```
stock-world-map/
├── index.html           # 主頁面
├── styles.css           # 樣式表
├── script.js            # 地圖與 UI 邏輯
├── stock-data.js        # 股市數據獲取模組
├── etf-config.js        # ETF 配置檔案（40 國 ETF 列表）
├── flag-controls.html   # 國旗調整工具頁面
└── README.md            # 專案說明文件
```

## 🛠️ 技術棧

| 技術 | 用途 |
|:----:|:----:|
| **HTML5** | 頁面結構 |
| **CSS3** | 樣式與動畫 |
| **JavaScript (ES6+)** | 應用邏輯 |
| **[amCharts 5](https://www.amcharts.com/)** | 互動式地圖 |
| **Yahoo Finance API** | 股市數據來源 |

## 🏳️ 國旗圖片資源

本專案使用以下兩個開源國旗圖片資源：

### 1. Circle Flags（圓形國旗）

用於地圖上的圓形國旗標記。

- **GitHub**: [https://github.com/HatScripts/circle-flags](https://github.com/HatScripts/circle-flags)
- **CDN 使用方式**:
  ```html
  <img src="https://hatscripts.github.io/circle-flags/flags/{country_code}.svg" alt="Flag">
  ```
- **範例**:
  ```html
  <!-- 美國圓形國旗 -->
  <img src="https://hatscripts.github.io/circle-flags/flags/us.svg" width="48" alt="US Flag">
  
  <!-- 台灣圓形國旗 -->
  <img src="https://hatscripts.github.io/circle-flags/flags/tw.svg" width="48" alt="TW Flag">
  ```
- **授權**: MIT License
- **特色**: SVG 格式、圓形設計、支援 250+ 國家/地區

---

### 2. Flagcdn（矩形國旗）

用於資訊卡片上的國旗顯示。

- **官網**: [https://flagcdn.com/](https://flagcdn.com/)
- **CDN 使用方式**:
  ```html
  <!-- w40 表示寬度為 40 像素 -->
  <img src="https://flagcdn.com/w40/{country_code}.png" alt="Flag">
  
  <!-- 其他可用尺寸: w20, w40, w80, w160, w320, w640, w1280, w2560 -->
  ```
- **範例**:
  ```html
  <!-- 日本國旗 (40px 寬) -->
  <img src="https://flagcdn.com/w40/jp.png" alt="Japan Flag">
  
  <!-- 香港國旗 (80px 寬) -->
  <img src="https://flagcdn.com/w80/hk.png" alt="Hong Kong Flag">
  ```
- **授權**: 公共領域（Public Domain）/ 免費商用
- **特色**: PNG 格式、多種尺寸、支援 SVG 格式

---

### 國家代碼對照表

| 國家/地區 | ISO 代碼 | Circle Flags | Flagcdn |
|:---------:|:--------:|:------------:|:-------:|
| 美國 | `us` | ✅ | ✅ |
| 英國 | `gb` | ✅ | ✅ |
| 德國 | `de` | ✅ | ✅ |
| 法國 | `fr` | ✅ | ✅ |
| 南韓 | `kr` | ✅ | ✅ |
| 日本 | `jp` | ✅ | ✅ |
| 香港 | `hk` | ✅ | ✅ |
| 台灣 | `tw` | ✅ | ✅ |

## 📊 API 說明

### 數據來源

本專案使用 **Yahoo Finance API** 獲取即時股市數據：

```javascript
// API 端點範例
https://query1.finance.yahoo.com/v8/finance/chart/^DJI?interval=1d&range=2d
```

### CORS 代理

由於瀏覽器跨域限制，專案內建多個 CORS Proxy 服務自動切換：

- cors.lol
- corsproxy.io
- allorigins.win
- cors.sh

## ⚙️ 自訂設定

### 修改國家顏色

編輯 `stock-data.js` 中的顏色配置：

```javascript
// 股市指數模式（台灣慣例）
upColor = 0xd32f2f;    // 紅色 (漲)
downColor = 0x2e7d32;  // 綠色 (跌)

// ETF 模式（美國慣例）
upColor = 0x2e7d32;    // 綠色 (漲)
downColor = 0xd32f2f;  // 紅色 (跌)
```

### 調整國旗位置

使用內建的 **國旗位置調整器**（點擊右下角 🎯 按鈕）：

1. 選擇國家
2. 使用方向鍵或滑桿調整位置
3. 調整大小
4. 複製配置並更新 `script.js`

或直接編輯 `script.js` 中的 `flagsConfig`：

```javascript
var flagsConfig = {
    us: { lon: -100, lat: 40, size: 100, name: '美國', code: 'us' },
    tw: { lon: 121, lat: 24, size: 7, name: '台灣', code: 'tw' },
    // ... 更多國家
};
```

### 新增股市指數

編輯 `stock-data.js` 中的 `STOCK_INDICES`：

```javascript
const STOCK_INDICES = {
    // 新增國家範例
    cn: {
        symbol: '000001.SS',  // Yahoo Finance 代號
        name: '上證指數',
        timezone: 0,
        marketHours: '09:30-15:00',
        timeNote: '同台灣時區',
        holiday: null
    }
};
```

## 🔄 自動更新

- 股市數據每 **60 秒** 自動更新一次
- 數據更新時地圖顏色會同步變化
- 可透過瀏覽器 Console 執行 `refreshStockData()` 手動刷新

## 🌐 瀏覽器支援

| 瀏覽器 | 支援版本 |
|:------:|:--------:|
| Chrome | ≥ 88 |
| Firefox | ≥ 85 |
| Safari | ≥ 14 |
| Edge | ≥ 88 |

## 📝 授權條款

本專案採用 **MIT License** 授權。

### 第三方資源授權

- **amCharts 5**: [amCharts License](https://www.amcharts.com/online-store/licenses-explained/)
- **Circle Flags**: MIT License
- **Flagcdn**: Public Domain

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

## 📮 聯絡方式

如有任何問題或建議，請透過 GitHub Issues 聯繫。

---

<p align="center">
  Made with ❤️ for Stock Market Enthusiasts
</p>