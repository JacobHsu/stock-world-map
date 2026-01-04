// Global variables
var root; // amCharts root 引用
var chart; // amCharts chart 引用
var flagSprites = {};  // 所有國旗圖片物件
var flagSeries = {};   // 所有國旗系列
var countrySeries = {};  // 所有國家的多邊形系列
var currentFlagCountry = 'us';  // 當前選中的國家
var currentMode = 'stock';  // 當前模式: 'stock' = 股市指數, 'etf' = 國家 ETF

// 股市指數模式的國家（現有）
var stockModeCountries = ['us', 'gb', 'de', 'fr', 'kr', 'jp', 'hk', 'tw'];

// ETF 模式的國家（包含共用國家 + ETF 專用國家）
var etfModeCountries = [
    // 共用
    'us', 'gb', 'de', 'fr', 'kr', 'jp', 'hk', 'tw',
    // 美洲
    'ca', 'br', 'mx', 'ar', 'co',
    // 歐洲
    'it', 'es', 'nl', 'ch', 'pl', 'be', 'se', 'ie', 'at', 'no', 'dk',
    // 亞太
    'cn', 'in', 'id', 'sg', 'th', 'vn', 'ph', 'my', 'au',
    // 中東
    'tr', 'sa', 'il', 'ae',
    // 非洲
    'za'
];

// 模式切換函數
function switchMode(mode) {
    if (currentMode === mode) return;

    currentMode = mode;
    console.log(`🔄 切換模式: ${mode === 'stock' ? '股市指數' : '國家 ETF'}`);

    // 更新 Tab UI
    document.querySelectorAll('.filter-tab').forEach(tab => {
        if (tab.dataset.mode === mode) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // 切換顯示內容
    if (mode === 'stock') {
        showStockMode();
    } else {
        showETFMode();
    }
}

// 顯示股市指數模式
function showStockMode() {
    // 顯示所有股市指數卡片
    document.querySelectorAll('.index-card').forEach(card => {
        card.style.display = 'block';
    });

    // 隱藏所有 ETF 卡片
    document.querySelectorAll('.etf-card').forEach(card => {
        card.style.display = 'none';
    });

    // 顯示股市國家的國旗和顏色
    stockModeCountries.forEach(code => {
        if (flagSeries[code]) {
            flagSeries[code].show();
        }
        if (countrySeries[code]) {
            countrySeries[code].show();
        }
    });

    // 隱藏 ETF 國家的國旗和顏色
    etfModeCountries.forEach(code => {
        if (flagSeries[code]) {
            flagSeries[code].hide();
        }
        if (countrySeries[code]) {
            countrySeries[code].hide();
        }
    });

    console.log('📊 股市指數模式已啟用');
}

// 顯示 ETF 模式（清空地圖，準備顯示 ETF 國家）
function showETFMode() {
    // 隱藏所有股市指數卡片
    document.querySelectorAll('.index-card').forEach(card => {
        card.style.display = 'none';
    });

    // 顯示所有 ETF 卡片
    document.querySelectorAll('.etf-card').forEach(card => {
        card.style.display = 'block';
    });

    // 隱藏股市國家的國旗和顏色
    stockModeCountries.forEach(code => {
        if (flagSeries[code]) {
            flagSeries[code].hide();
        }
        if (countrySeries[code]) {
            countrySeries[code].hide();
        }
    });

    // 顯示 ETF 國家的國旗和顏色
    etfModeCountries.forEach(code => {
        if (flagSeries[code]) {
            flagSeries[code].show();
        }
        if (countrySeries[code]) {
            countrySeries[code].show();
        }
    });

    console.log('📈 ETF 模式已啟用');
}

// 暴露到全域
window.switchMode = switchMode;

// 國旗配置數據（經緯度座標）- 圓形國旗
// mode: 'stock' = 股市指數模式顯示, 'etf' = ETF 模式顯示, 'both' = 兩種模式都顯示
var flagsConfig = {
    // ===== 股市指數 + ETF 共用 =====
    us: { lon: -100.0, lat: 40.0, size: 100, name: '美國', code: 'us', mode: 'both' },
    gb: { lon: -1.4, lat: 52.4, size: 20, name: '英國', code: 'gb', mode: 'both' },
    de: { lon: 10, lat: 51, size: 20, name: '德國', code: 'de', mode: 'both' },
    fr: { lon: 2.8, lat: 46.6, size: 20, name: '法國', code: 'fr', mode: 'both' },
    kr: { lon: 128, lat: 36.5, size: 14, name: '南韓', code: 'kr', mode: 'both' },
    jp: { lon: 139, lat: 36.3, size: 14, name: '日本', code: 'jp', mode: 'both' },
    hk: { lon: 114, lat: 22, size: 10, name: '香港', code: 'hk', mode: 'both' },
    tw: { lon: 121, lat: 24, size: 10, name: '台灣', code: 'tw', mode: 'both' },

    // ===== ETF 專用 - 美洲 =====
    ca: { lon: -106.0, lat: 56.0, size: 100, name: '加拿大', code: 'ca', mode: 'etf' },
    br: { lon: -51.0, lat: -14.0, size: 55, name: '巴西', code: 'br', mode: 'etf' },
    mx: { lon: -102.0, lat: 23.0, size: 30, name: '墨西哥', code: 'mx', mode: 'etf' },
    ar: { lon: -64.0, lat: -34.0, size: 40, name: '阿根廷', code: 'ar', mode: 'etf' },
    co: { lon: -74.0, lat: 4.0, size: 22, name: '哥倫比亞', code: 'co', mode: 'etf' },

    // ===== ETF 專用 - 歐洲 =====
    it: { lon: 12.5, lat: 42.8, size: 10, name: '義大利', code: 'it', mode: 'etf' },
    es: { lon: -3.7, lat: 40.4, size: 20, name: '西班牙', code: 'es', mode: 'etf' },
    nl: { lon: 5.3, lat: 52.1, size: 10, name: '荷蘭', code: 'nl', mode: 'etf' },
    ch: { lon: 8.2, lat: 46.8, size: 10, name: '瑞士', code: 'ch', mode: 'etf' },
    pl: { lon: 19.1, lat: 51.9, size: 20, name: '波蘭', code: 'pl', mode: 'etf' },
    be: { lon: 4.4, lat: 50.8, size: 8, name: '比利時', code: 'be', mode: 'etf' },
    se: { lon: 15.1, lat: 60.1, size: 20, name: '瑞典', code: 'se', mode: 'etf' },
    ie: { lon: -8, lat: 53.4, size: 10, name: '愛爾蘭', code: 'ie', mode: 'etf' },
    at: { lon: 14.6, lat: 47.5, size: 10, name: '奧地利', code: 'at', mode: 'etf' },
    no: { lon: 8.5, lat: 60.5, size: 20, name: '挪威', code: 'no', mode: 'etf' },
    dk: { lon: 9.5, lat: 56, size: 10, name: '丹麥', code: 'dk', mode: 'etf' },

    // ===== ETF 專用 - 亞太 =====
    cn: { lon: 105.5, lat: 34.0, size: 60, name: '中國', code: 'cn', mode: 'etf' },
    in: { lon: 79.5, lat: 22.0, size: 35, name: '印度', code: 'in', mode: 'etf' },
    id: { lon: 114.0, lat: -1.0, size: 14, name: '印尼', code: 'id', mode: 'etf' },
    sg: { lon: 103.8, lat: 1.3, size: 8, name: '新加坡', code: 'sg', mode: 'etf' },
    th: { lon: 101.0, lat: 15.0, size: 14, name: '泰國', code: 'th', mode: 'etf' },
    vn: { lon: 108.0, lat: 14.0, size: 12, name: '越南', code: 'vn', mode: 'etf' },
    ph: { lon: 121.2, lat: 17.0, size: 8, name: '菲律賓', code: 'ph', mode: 'etf' },
    my: { lon: 102.0, lat: 4.0, size: 10, name: '馬來西亞', code: 'my', mode: 'etf' },
    au: { lon: 133, lat: -25, size: 40, name: '澳洲', code: 'au', mode: 'etf' },

    // ===== ETF 專用 - 中東 =====
    tr: { lon: 35, lat: 39, size: 18, name: '土耳其', code: 'tr', mode: 'etf' },
    sa: { lon: 45, lat: 24, size: 20, name: '沙烏地', code: 'sa', mode: 'etf' },
    il: { lon: 35, lat: 31, size: 10, name: '以色列', code: 'il', mode: 'etf' },
    ae: { lon: 54, lat: 24, size: 10, name: '阿聯酋', code: 'ae', mode: 'etf' },

    // ===== ETF 專用 - 非洲 =====
    za: { lon: 25, lat: -29, size: 18, name: '南非', code: 'za', mode: 'etf' }
};

// Initialize amCharts Map
am5.ready(function () {

    // Create root element - 強制使用 SVG 渲染器
    root = am5.Root.new("chartdiv");

    // 設置使用 SVG 渲染而不是 Canvas
    root._renderer.useSafeResolution = false;

    // Set themes (none for clean look)
    root.setThemes([]);

    // Create the map chart
    chart = root.container.children.push(
        am5map.MapChart.new(root, {
            panX: "translateX",
            panY: "translateY",
            wheelY: "zoom",
            pinchZoom: true,
            projection: am5map.geoMercator(),
            homeGeoPoint: { longitude: 10, latitude: 20 }
        })
    );

    // Add zoom control
    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

    // Create polygon series for countries (exclude countries with color fills)
    var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            exclude: ["AQ", "US", "JP", "TW", "HK", "KR", "GB", "DE", "FR"]
            // 排除：南極洲、美國、日本、台灣、香港、南韓、英國、德國、法國
        })
    );

    // Default styling for all countries
    polygonSeries.mapPolygons.template.setAll({
        fill: am5.color(0xe8e8e8),
        stroke: am5.color(0x999999),
        strokeWidth: 1,
        interactive: false
    });

    // 定義顏色 (全域變數供 stock-data.js 使用)
    upColor = 0xd32f2f;    // 紅色 (漲)
    downColor = 0x2e7d32;  // 綠色 (跌)

    // 國家代碼 -> ISO 代碼映射
    var countryToISO = {
        us: 'US', gb: 'GB', de: 'DE', fr: 'FR', kr: 'KR', jp: 'JP', hk: 'HK', tw: 'TW',
        ca: 'CA', br: 'BR', mx: 'MX', ar: 'AR', co: 'CO',
        it: 'IT', es: 'ES', nl: 'NL', ch: 'CH', pl: 'PL', be: 'BE', se: 'SE', ie: 'IE', at: 'AT', no: 'NO', dk: 'DK',
        cn: 'CN', in: 'IN', id: 'ID', sg: 'SG', th: 'TH', vn: 'VN', ph: 'PH', my: 'MY', au: 'AU',
        tr: 'TR', sa: 'SA', il: 'IL', ae: 'AE',
        za: 'ZA'
    };

    // 國家顏色配置（漲/跌）- 全域變數，預設灰色
    countryColors = {};
    Object.keys(flagsConfig).forEach(function (code) {
        countryColors[code] = 0x999999;  // 預設灰色
    });

    // 通用函數：為指定國家創建顏色填充和國旗覆蓋層
    function createCountryWithFlag(code, isoCode) {
        var config = flagsConfig[code];
        var color = countryColors[code];

        // 1. 創建多邊形系列（顏色填充）
        var series = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldLow,
                include: [isoCode]
            })
        );

        series.mapPolygons.template.setAll({
            fill: am5.color(color),
            fillOpacity: 0,  // 無顏色填充，等有數據再顯示
            stroke: am5.color(0x999999),
            strokeWidth: 1,
            interactive: false
        });

        countrySeries[code] = series;

        // 2. 創建國旗覆蓋層（MapPointSeries）
        var imageSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
        flagSeries[code] = imageSeries;

        // 添加圓形國旗圖片
        imageSeries.bullets.push(function (root, series, dataItem) {
            var bullet = am5.Bullet.new(root, {
                sprite: am5.Picture.new(root, {
                    width: config.size,
                    height: config.size,
                    centerX: am5.percent(50),
                    centerY: am5.percent(50),
                    src: `https://hatscripts.github.io/circle-flags/flags/${code}.svg`,
                    draggable: true,
                    cursorOverStyle: "grab"
                })
            });

            var sprite = bullet.get("sprite");
            flagSprites[code] = sprite;

            // 監聽拖曳
            sprite.events.on("dragged", function (ev) {
                var geometry = dataItem.get("geometry");
                if (geometry && geometry.coordinates) {
                    config.lon = geometry.coordinates[0];
                    config.lat = geometry.coordinates[1];

                    // 更新顯示（如果是當前選中的國家）
                    if (code === currentFlagCountry) {
                        updateFlagAdjusterDisplay();
                    }
                }
            });

            // 點擊選中
            sprite.events.on("click", function (ev) {
                selectFlagCountry(code);
            });

            return bullet;
        });

        // 設置初始位置
        imageSeries.data.setAll([{
            geometry: { type: "Point", coordinates: [config.lon, config.lat] },
            id: code
        }]);

        console.log(`✅ ${config.name} - ${color === upColor ? '紅色 (漲)' : '綠色 (跌)'}`);
    }

    // 動態創建所有國家的顏色填充和國旗覆蓋層
    Object.keys(flagsConfig).forEach(function (code) {
        var isoCode = countryToISO[code];
        if (isoCode) {
            createCountryWithFlag(code, isoCode);

            // ETF 專用國家預設隱藏
            var config = flagsConfig[code];
            if (config.mode === 'etf') {
                if (flagSeries[code]) flagSeries[code].hide();
                if (countrySeries[code]) countrySeries[code].hide();
            }
        }
    });

    console.log(`🗺️ 共創建 ${Object.keys(flagsConfig).length} 個國家國旗`);

    // OLD CODE - TO BE REMOVED
    /*
    // ==================== 美國 (跌 - 綠色 -> 使用圖片覆蓋層) ====================
    usSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            include: ["US"]
        })
    );

    // 設置美國為純色填充（作為背景）
    usSeries.mapPolygons.template.setAll({
        fill: am5.color(downColor),
        fillOpacity: 0.3,
        stroke: am5.color(0x999999),
        strokeWidth: 1
    });

    // 創建圖片系列用於國旗覆蓋層（使用全局變數）
    usImageSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    // 添加國旗圖片
    usImageSeries.bullets.push(function(root, series, dataItem) {
        var bullet = am5.Bullet.new(root, {
            sprite: am5.Picture.new(root, {
                width: usFlagParams.width,
                height: usFlagParams.height,
                centerX: am5.percent(50),
                centerY: am5.percent(50),
                src: "https://flagcdn.com/w640/us.png",
                draggable: true
            })
        });

        // 保存圖片引用
        var sprite = bullet.get("sprite");
        usFlagSprite = sprite;

        // 監聽拖曳結束事件
        sprite.events.on("dragged", function(ev) {
            // 獲取新位置
            var geometry = dataItem.get("geometry");
            if (geometry && geometry.coordinates) {
                usFlagParams.lon = geometry.coordinates[0];
                usFlagParams.lat = geometry.coordinates[1];

                // 更新顯示
                var coordsEl = document.getElementById('us-coords');
                if (coordsEl) {
                    coordsEl.textContent = `經度: ${usFlagParams.lon.toFixed(1)}, 緯度: ${usFlagParams.lat.toFixed(1)}`;
                }

                console.log(`🇺🇸 拖曳後位置: lon=${usFlagParams.lon.toFixed(1)}, lat=${usFlagParams.lat.toFixed(1)}`);
            }
        });

        return bullet;
    });

    // 添加一個數據點定位國旗（美國中心大約位置）
    usImageSeries.data.setAll([{
        geometry: { type: "Point", coordinates: [usFlagParams.lon, usFlagParams.lat] },
        id: "us-flag"
    }]);

    console.log('🇺🇸 美國國旗覆蓋層已創建');

    // 檢查是否所有圖片都已加載
    flagImagesLoaded++;
    if (flagImagesLoaded === totalFlagImages) {
        setTimeout(setupFlagControls, 500);
    }

    // 全域拖拉變數
    var currentDraggingPattern = null;
    var isDragging = false;
    var lastPos = { x: 0, y: 0 };

    // 美國拖拉事件
    usSeries.mapPolygons.template.events.on("pointerdown", function(ev) {
        currentDraggingPattern = usPattern;
        isDragging = true;
        lastPos = { x: ev.domEvent.clientX, y: ev.domEvent.clientY };
        ev.domEvent.stopPropagation();
    });

    console.log('✅ 美國 - 國旗填充 (可拖拉)');

    // ==================== 日本 (跌 - 綠色) ====================
    var japanSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            include: ["JP"]
        })
    );

    japanSeries.mapPolygons.template.setAll({
        fill: am5.color(downColor),
        fillOpacity: 0.6,
        stroke: am5.color(0x999999),
        strokeWidth: 1,
        interactive: false
    });

    console.log('✅ 日本 - 綠色 (跌)');

    // ==================== 台灣 (跌 - 綠色) ====================
    var taiwanSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            include: ["TW"]
        })
    );

    taiwanSeries.mapPolygons.template.setAll({
        fill: am5.color(downColor),
        fillOpacity: 0.6,
        stroke: am5.color(0x999999),
        strokeWidth: 1,
        interactive: false
    });

    console.log('✅ 台灣 - 綠色 (跌)');

    // ==================== 香港 (跌 - 綠色) ====================
    var hkSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            include: ["HK"]
        })
    );

    hkSeries.mapPolygons.template.setAll({
        fill: am5.color(downColor),
        fillOpacity: 0.6,
        stroke: am5.color(0x999999),
        strokeWidth: 1,
        interactive: false
    });

    console.log('✅ 香港 - 綠色 (跌)');

    // ==================== 南韓 (跌 - 綠色 -> 國旗填充) ====================
    koreaSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            include: ["KR"]
        })
    );

    // 預加載南韓國旗圖片
    var krFlag = new Image();
    krFlag.onload = function() {
        // 圖片加載完成後才創建 pattern
        krPattern = am5.PicturePattern.new(root, {
            src: "https://flagcdn.com/w320/kr.png",
            width: 25,
            height: 17,
            x: 0,
            y: 0,
            repetition: "repeat"
        });

        // 設置到所有南韓 polygons
        koreaSeries.mapPolygons.each(function(polygon) {
            polygon.set("fillPattern", krPattern);
        });

        console.log('🇰🇷 南韓國旗已加載並設置');

        // 檢查是否所有圖片都已加載
        flagImagesLoaded++;
        if (flagImagesLoaded === totalFlagImages) {
            setupFlagControls();
        }
    };
    krFlag.src = "https://flagcdn.com/w320/kr.png";

    // 先設置基本樣式
    koreaSeries.mapPolygons.template.setAll({
        stroke: am5.color(0x999999),
        strokeWidth: 1,
        interactive: true,
        cursorOverStyle: "move"
    });

    // 南韓拖拉事件
    koreaSeries.mapPolygons.template.events.on("pointerdown", function(ev) {
        currentDraggingPattern = krPattern;
        isDragging = true;
        lastPos = { x: ev.domEvent.clientX, y: ev.domEvent.clientY };
        ev.domEvent.stopPropagation();
    });

    // 統一的拖拉處理
    root.container.events.on("globalpointermove", function(ev) {
        if (isDragging && currentDraggingPattern) {
            var dx = ev.domEvent.clientX - lastPos.x;
            var dy = ev.domEvent.clientY - lastPos.y;

            var country = currentDraggingPattern === usPattern ? 'us' : 'kr';
            var params = country === 'us' ? usPatternParams : krPatternParams;

            params.x += dx;
            params.y += dy;

            recreatePattern(country);

            lastPos = { x: ev.domEvent.clientX, y: ev.domEvent.clientY };
        }
    });

    root.container.events.on("globalpointerup", function() {
        if (isDragging) {
            isDragging = false;
            currentDraggingPattern = null;
        }
    });

    // 監聽來自 flag-controls.html 的訊息
    window.addEventListener("message", function(event) {
        if (event.data.type === "updatePattern") {
            var data = event.data;
            if (data.country === "korea") {
                if (data.width) krPattern.set("width", data.width);
                if (data.height) krPattern.set("height", data.height);
                if (data.x !== undefined) krPattern.set("x", data.x);
                if (data.y !== undefined) krPattern.set("y", data.y);
            }
        }
    });

    console.log('✅ 南韓 - 國旗填充 (可拖拉)');

    // ==================== 英國 (跌 - 綠色) ====================
    var ukSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            include: ["GB"]
        })
    );

    ukSeries.mapPolygons.template.setAll({
        fill: am5.color(downColor),
        fillOpacity: 0.6,
        stroke: am5.color(0x999999),
        strokeWidth: 1,
        interactive: false
    });

    console.log('✅ 英國 - 綠色 (跌)');

    // ==================== 德國 (漲 - 紅色) ====================
    var germanySeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            include: ["DE"]
        })
    );

    germanySeries.mapPolygons.template.setAll({
        fill: am5.color(upColor),
        fillOpacity: 0.6,
        stroke: am5.color(0x999999),
        strokeWidth: 1,
        interactive: false
    });

    console.log('✅ 德國 - 紅色 (漲)');

    // ==================== 法國 (跌 - 綠色) ====================
    var franceSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            include: ["FR"]
        })
    );

    franceSeries.mapPolygons.template.setAll({
        fill: am5.color(downColor),
        fillOpacity: 0.6,
        stroke: am5.color(0x999999),
        strokeWidth: 1,
        interactive: false
    });

    console.log('✅ 法國 - 綠色 (跌)');
    */
    // END OF OLD CODE

    // Set background color
    chart.set("background", am5.Rectangle.new(root, {
        fill: am5.color(0xf5f5f5),
        fillOpacity: 1
    }));

    chart.appear(0, 0);
    console.log('🗺️ amCharts 地圖已載入');

    // setupFlagControls 會在所有國旗圖片加載完成後自動調用

}); // end am5.ready()

// 更新國旗圖片位置和大小
var usUpdateCounter = 0;

function updateFlag(country) {
    if (country !== 'us') return; // 目前只支持美國

    const params = usFlagParams;
    const sprite = usFlagSprite;
    const series = usImageSeries;

    // 更新計數器
    usUpdateCounter++;
    const counterEl = document.getElementById('us-counter');
    if (counterEl) counterEl.textContent = `更新次數: ${usUpdateCounter}`;

    // 更新圖片大小
    if (sprite) {
        sprite.set("width", params.width);
        sprite.set("height", params.height);
    }

    // 更新位置（通過更新數據點）
    series.data.setAll([{
        geometry: { type: "Point", coordinates: [params.lon, params.lat] },
        id: "us-flag"
    }]);

    console.log(`🇺🇸 國旗已更新 #${usUpdateCounter}: lon=${params.lon}, lat=${params.lat}, w=${params.width}, h=${params.height}`);
}

// 調試 SVG Pattern 結構
function debugSVGPattern(country) {
    let debugInfo = '';

    // 1. 查找所有 pattern 元素
    const svgPatterns = document.querySelectorAll('#chartdiv pattern');
    debugInfo += `=== Pattern 元素 ===\n找到 ${svgPatterns.length} 個\n\n`;

    // 2. 查找所有 defs 元素
    const svgDefs = document.querySelectorAll('#chartdiv defs');
    debugInfo += `=== Defs 元素 ===\n找到 ${svgDefs.length} 個\n`;
    svgDefs.forEach((def, i) => {
        debugInfo += `Defs ${i + 1} 內容: ${def.children.length} 個子元素\n`;
        for (let child of def.children) {
            debugInfo += `  - ${child.tagName}\n`;
        }
    });
    debugInfo += '\n';

    // 3. 查找所有包含 us.png 的圖片
    const allImages = document.querySelectorAll('#chartdiv image');
    debugInfo += `=== Image 元素 ===\n找到 ${allImages.length} 個\n`;
    allImages.forEach((img, i) => {
        const href = img.href?.baseVal || img.getAttribute('href') || '';
        if (href.includes('us.png') || href.includes('kr.png')) {
            debugInfo += `Image ${i + 1}:\n`;
            debugInfo += `  href: ${href.substring(href.lastIndexOf('/') + 1)}\n`;
            debugInfo += `  x: ${img.getAttribute('x')}\n`;
            debugInfo += `  y: ${img.getAttribute('y')}\n`;
            debugInfo += `  width: ${img.getAttribute('width')}\n`;
            debugInfo += `  height: ${img.getAttribute('height')}\n`;
            debugInfo += `  transform: ${img.getAttribute('transform') || '無'}\n\n`;
        }
    });

    // 4. 查找所有路徑元素（可能是美國地圖）
    const usPaths = document.querySelectorAll('#chartdiv path');
    debugInfo += `=== Path 元素 ===\n找到 ${usPaths.length} 個路徑\n`;
    let patternFillCount = 0;
    usPaths.forEach((path) => {
        const fill = path.getAttribute('fill');
        if (fill && fill.includes('url(#')) {
            patternFillCount++;
            debugInfo += `Path 使用 fill: ${fill}\n`;
        }
    });
    debugInfo += `其中 ${patternFillCount} 個使用 pattern 填充\n\n`;

    // 5. 檢查 Canvas 元素
    const canvasElements = document.querySelectorAll('#chartdiv canvas');
    debugInfo += `=== Canvas 元素 ===\n找到 ${canvasElements.length} 個\n`;
    canvasElements.forEach((canvas, i) => {
        debugInfo += `Canvas ${i + 1}: ${canvas.width}x${canvas.height}\n`;
    });
    debugInfo += '\n';

    // 6. 檢查整體結構
    const chartdiv = document.getElementById('chartdiv');
    debugInfo += `=== Chartdiv 結構 ===\n`;
    debugInfo += `子元素數量: ${chartdiv.children.length}\n`;
    for (let child of chartdiv.children) {
        debugInfo += `  - ${child.tagName} (class: ${child.className})\n`;
    }
    debugInfo += '\n';

    // 7. 查找當前參數
    debugInfo += `=== 當前參數 ===\n`;
    debugInfo += `美國: x=${usPatternParams.x}, y=${usPatternParams.y}, w=${usPatternParams.width}, h=${usPatternParams.height}\n`;
    debugInfo += `更新次數: ${usPatternCounter}\n`;
    debugInfo += `\n⚠️ 如果找到 Canvas 元素，說明 amCharts 使用 Canvas 渲染，\n   無法使用 SVG pattern 方法控制國旗位置！\n`;

    // 顯示在頁面上
    const existingDebug = document.getElementById('debug-panel');
    if (existingDebug) existingDebug.remove();

    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 2px solid #333; z-index: 10000; max-width: 600px; max-height: 500px; overflow: auto; white-space: pre-wrap; font-family: monospace; font-size: 11px;';
    debugPanel.innerHTML = `<div style="margin-bottom: 10px; font-weight: bold; font-size: 14px;">🔍 SVG 完整調試信息</div>${debugInfo}<button onclick="document.getElementById('debug-panel').remove()" style="margin-top: 10px; padding: 8px 16px; cursor: pointer;">關閉</button>`;
    document.body.appendChild(debugPanel);
}

// 設置國旗位置控制按鈕
function setupFlagControls() {
    const step = 5; // 經緯度步進（增加到 5 度，讓移動更明顯）
    const sizeStep = 20; // 像素步進

    // 更新座標顯示
    function updateCoordsDisplay(country) {
        const coordsEl = document.getElementById(country + '-coords');
        if (coordsEl && country === 'us') {
            const params = usFlagParams;
            coordsEl.textContent = `經度: ${params.lon.toFixed(1)}, 緯度: ${params.lat.toFixed(1)}`;

            // 視覺反饋
            coordsEl.style.color = '#4CAF50';
            coordsEl.style.fontWeight = 'bold';
            setTimeout(() => {
                coordsEl.style.color = '';
                coordsEl.style.fontWeight = '';
            }, 500);
        }
    }

    // 更新尺寸顯示
    function updateSizeDisplay(country) {
        const sizeEl = document.getElementById(country + '-size');
        if (sizeEl && country === 'us') {
            const params = usFlagParams;
            sizeEl.textContent = `w: ${params.width}, h: ${params.height}`;

            // 視覺反饋
            sizeEl.style.color = '#2196F3';
            sizeEl.style.fontWeight = 'bold';
            setTimeout(() => {
                sizeEl.style.color = '';
                sizeEl.style.fontWeight = '';
            }, 500);
        }
    }

    // 初始化顯示
    updateCoordsDisplay('us');
    updateSizeDisplay('us');

    // 綁定所有控制按鈕
    document.querySelectorAll('.flag-control-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault(); // 防止預設行為

            // 視覺反饋：按鈕閃爍
            this.style.background = '#4CAF50';
            setTimeout(() => {
                this.style.background = '';
            }, 200);

            const country = this.dataset.country;
            const dir = this.dataset.dir;

            if (country !== 'us') return; // 目前只支持美國

            const params = usFlagParams;

            switch (dir) {
                case 'up':
                    params.lat += step;
                    updateCoordsDisplay(country);
                    updateFlag(country);
                    break;
                case 'down':
                    params.lat -= step;
                    updateCoordsDisplay(country);
                    updateFlag(country);
                    break;
                case 'left':
                    params.lon -= step;
                    updateCoordsDisplay(country);
                    updateFlag(country);
                    break;
                case 'right':
                    params.lon += step;
                    updateCoordsDisplay(country);
                    updateFlag(country);
                    break;
                case 'reset':
                    params.lon = -100;
                    params.lat = 40;
                    updateCoordsDisplay(country);
                    updateFlag(country);
                    break;
                case 'bigger':
                    params.width += sizeStep;
                    params.height = Math.round(params.width / 1.5);
                    updateSizeDisplay(country);
                    updateFlag(country);
                    break;
                case 'smaller':
                    params.width = Math.max(50, params.width - sizeStep);
                    params.height = Math.round(params.width / 1.5);
                    updateSizeDisplay(country);
                    updateFlag(country);
                    break;
            }
        });
    });

    console.log('✅ 國旗控制按鈕已設置');
}

// Stock Market Data Management
class StockMarketMap {
    constructor() {
        this.draggedCard = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addPositionDisplays();
        this.startDataUpdate();
    }

    setupEventListeners() {
        // Card hover effects (股市指數卡片)
        const cards = document.querySelectorAll('.index-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', this.onCardHover.bind(this));
            card.addEventListener('mouseleave', this.onCardLeave.bind(this));

            // Draggable functionality
            card.addEventListener('mousedown', this.onDragStart.bind(this));
        });

        // ETF 卡片拖拽功能
        const etfCards = document.querySelectorAll('.etf-card');
        etfCards.forEach(card => {
            card.addEventListener('mouseenter', this.onCardHover.bind(this));
            card.addEventListener('mouseleave', this.onCardLeave.bind(this));
            card.addEventListener('mousedown', this.onDragStart.bind(this));
        });

        // Global mouse events for dragging
        document.addEventListener('mousemove', this.onDrag.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));
    }

    addPositionDisplays() {
        // Add position display to each card (股市指數卡片)
        const cards = document.querySelectorAll('.index-card');
        cards.forEach(card => {
            const posDisplay = document.createElement('div');
            posDisplay.className = 'position-display';
            posDisplay.title = '點擊複製位置';

            // Click to copy position
            posDisplay.addEventListener('click', (e) => {
                e.stopPropagation();
                const left = card.style.left || '0%';
                const top = card.style.top || '0%';
                const cardName = card.querySelector('.index-name')?.textContent || 'Card';
                const copyText = `${cardName}: left: ${left}; top: ${top}`;

                navigator.clipboard.writeText(copyText).then(() => {
                    // Visual feedback
                    posDisplay.style.background = 'rgba(67, 160, 71, 0.9)';
                    posDisplay.textContent = '✓ 已複製';
                    setTimeout(() => {
                        posDisplay.style.background = 'rgba(0, 0, 0, 0.7)';
                        this.updatePositionDisplay(card);
                    }, 1000);
                    console.log(`📋 已複製: ${copyText}`);
                });
            });

            card.appendChild(posDisplay);
            this.updatePositionDisplay(card);
        });

        // Add position display to ETF cards
        this.addETFPositionDisplays();
    }

    addETFPositionDisplays() {
        const etfCards = document.querySelectorAll('.etf-card');
        etfCards.forEach(card => {
            const posDisplay = card.querySelector('.etf-position-display');
            if (!posDisplay) return;

            // Update position display
            this.updateETFPositionDisplay(card);

            // Click to copy position
            posDisplay.addEventListener('click', (e) => {
                e.stopPropagation();
                const left = card.style.left || '0%';
                const top = card.style.top || '0%';
                const cardName = card.querySelector('.etf-card-title')?.textContent || 'ETF Card';
                const copyText = `${cardName}: left: ${left}; top: ${top}`;

                navigator.clipboard.writeText(copyText).then(() => {
                    // Visual feedback
                    const originalText = posDisplay.textContent;
                    posDisplay.textContent = '✓ 已複製';
                    posDisplay.style.background = '#4CAF50';
                    posDisplay.style.color = 'white';
                    setTimeout(() => {
                        posDisplay.style.background = '';
                        posDisplay.style.color = '';
                        this.updateETFPositionDisplay(card);
                    }, 1000);
                    console.log(`📋 已複製: ${copyText}`);
                });
            });
        });
    }

    updateETFPositionDisplay(card) {
        const posDisplay = card.querySelector('.etf-position-display');
        if (posDisplay) {
            const left = card.style.left || '0%';
            const top = card.style.top || '0%';
            posDisplay.textContent = `${left}, ${top}`;
        }
    }

    updatePositionDisplay(card) {
        const posDisplay = card.querySelector('.position-display');
        if (posDisplay) {
            const left = card.style.left || '0%';
            const top = card.style.top || '0%';
            posDisplay.textContent = `${left}, ${top}`;
        }
    }

    onDragStart(event) {
        this.draggedCard = event.currentTarget;
        this.draggedCard.classList.add('dragging');

        const rect = this.draggedCard.getBoundingClientRect();
        const container = this.draggedCard.parentElement.getBoundingClientRect();

        this.offsetX = event.clientX - rect.left;
        this.offsetY = event.clientY - rect.top;

        event.preventDefault();
    }

    onDrag(event) {
        if (!this.draggedCard) return;

        const container = this.draggedCard.parentElement.getBoundingClientRect();

        // Calculate new position in pixels
        let newX = event.clientX - container.left - this.offsetX;
        let newY = event.clientY - container.top - this.offsetY;

        // Convert to percentage
        const leftPercent = (newX / container.width) * 100;
        const topPercent = (newY / container.height) * 100;

        // Clamp values between 0 and 100
        const clampedLeft = Math.max(0, Math.min(100, leftPercent));
        const clampedTop = Math.max(0, Math.min(100, topPercent));

        // Update position
        this.draggedCard.style.left = clampedLeft.toFixed(1) + '%';
        this.draggedCard.style.top = clampedTop.toFixed(1) + '%';

        // Update position display
        this.updatePositionDisplay(this.draggedCard);
    }

    onDragEnd(event) {
        if (this.draggedCard) {
            this.draggedCard.classList.remove('dragging');

            // Log final position for easy copying
            const left = this.draggedCard.style.left;
            const top = this.draggedCard.style.top;

            // Update position display
            if (this.draggedCard.classList.contains('etf-card')) {
                const cardName = this.draggedCard.querySelector('.etf-card-title')?.textContent || 'ETF Card';
                console.log(`📍 ${cardName}: left: ${left}; top: ${top}`);
                this.updateETFPositionDisplay(this.draggedCard);
            } else {
                const cardName = this.draggedCard.querySelector('.index-name')?.textContent || 'Card';
                console.log(`📍 ${cardName}: left: ${left}; top: ${top}`);
                this.updatePositionDisplay(this.draggedCard);
            }

            this.draggedCard = null;
        }
    }

    onCardHover(event) {
        const card = event.currentTarget;
        if (!card.classList.contains('dragging')) {
            card.style.zIndex = '100';
        }
    }

    onCardLeave(event) {
        const card = event.currentTarget;
        if (!card.classList.contains('dragging')) {
            card.style.zIndex = '10';
        }
    }

    // Update stock data (simulated for demo)
    updateStockData() {
        const cards = document.querySelectorAll('.index-card');

        cards.forEach(card => {
            const valueElement = card.querySelector('.index-value');
            if (valueElement) {
                // Add subtle animation to show data is "live"
                valueElement.style.transition = 'color 0.3s ease';
            }
        });
    }

    startDataUpdate() {
        // Simulate data updates every 5 seconds
        setInterval(() => {
            this.updateStockData();
        }, 5000);
    }

    // Get current market status
    getMarketStatus(timezone) {
        const now = new Date();
        const hour = now.getHours();

        // Simplified market hours check
        if (hour >= 9 && hour < 17) {
            return 'open';
        }
        return 'closed';
    }

    // Format number with commas
    static formatNumber(num) {
        return num.toLocaleString('zh-TW', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        });
    }

    // Calculate change percentage
    static calculateChange(current, previous) {
        const change = current - previous;
        const percentage = (change / previous) * 100;
        return {
            value: change,
            percentage: percentage,
            direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
        };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new StockMarketMap();

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Log initialization
    console.log('🌍 全球股市指數地圖已載入');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StockMarketMap;
}

// ==================== 浮動國旗調整面板邏輯 ====================

// 切換面板顯示/隱藏
function toggleFlagAdjuster() {
    var panel = document.getElementById('flagAdjusterPanel');
    var toggle = document.getElementById('flagAdjusterToggle');

    panel.classList.toggle('show');
    toggle.classList.toggle('hidden');
}

// 選擇要調整的國家
function selectFlagCountry(code) {
    currentFlagCountry = code;
    document.getElementById('flagCountrySelect').value = code;
    updateFlagAdjusterDisplay();

    // 視覺反饋：高亮選中的國旗
    Object.keys(flagSprites).forEach(function (c) {
        var sprite = flagSprites[c];
        if (sprite) {
            sprite.set("opacity", c === code ? 1 : 0.5);
        }
    });
}

// 更新調整面板的顯示值
function updateFlagAdjusterDisplay() {
    var config = flagsConfig[currentFlagCountry];
    if (!config) return;

    document.getElementById('adjusterLon').textContent = config.lon.toFixed(1);
    document.getElementById('adjusterLat').textContent = config.lat.toFixed(1);
    document.getElementById('adjusterSize').textContent = config.size;

    // 更新滑桿位置
    document.getElementById('lonSlider').value = config.lon;
    document.getElementById('latSlider').value = config.lat;
}

// 更新國旗位置和大小
function updateFlagOnMap() {
    var config = flagsConfig[currentFlagCountry];
    var sprite = flagSprites[currentFlagCountry];
    var series = flagSeries[currentFlagCountry];

    if (!sprite || !series) return;

    // 更新大小（圓形）
    sprite.set("width", config.size);
    sprite.set("height", config.size);

    // 更新位置
    series.data.setAll([{
        geometry: { type: "Point", coordinates: [config.lon, config.lat] },
        id: currentFlagCountry
    }]);

    updateFlagAdjusterDisplay();
}

// 方向鍵移動
function moveFlagDirection(direction) {
    var config = flagsConfig[currentFlagCountry];
    var step = 0.5;  // 每次移動 0.5 度

    switch (direction) {
        case 'up':
            config.lat += step;
            break;
        case 'down':
            config.lat -= step;
            break;
        case 'left':
            config.lon -= step;
            break;
        case 'right':
            config.lon += step;
            break;
    }

    updateFlagOnMap();
}

// 使用滑桿調整座標
function adjustFlagBySlider(param, value) {
    var config = flagsConfig[currentFlagCountry];

    if (param === 'lon') {
        config.lon = parseFloat(value);
    } else if (param === 'lat') {
        config.lat = parseFloat(value);
    }

    updateFlagOnMap();
}

// 調整圓形國旗大小
function adjustFlagSize(delta) {
    var config = flagsConfig[currentFlagCountry];
    config.size = Math.max(20, config.size + delta);
    updateFlagOnMap();
}

// 重置到預設位置和大小
function resetFlagPosition() {
    var defaultSettings = {
        us: { lon: -100, lat: 40, size: 100 },
        gb: { lon: -1.4, lat: 53, size: 20 },
        de: { lon: 10, lat: 51, size: 20 },
        fr: { lon: 3, lat: 46.6, size: 20 },
        kr: { lon: 128, lat: 36.5, size: 20 },
        jp: { lon: 139, lat: 36, size: 18 },
        hk: { lon: 114, lat: 22, size: 14 },
        tw: { lon: 121, lat: 24, size: 10 }
    };

    var config = flagsConfig[currentFlagCountry];
    var defaults = defaultSettings[currentFlagCountry];

    if (defaults) {
        config.lon = defaults.lon;
        config.lat = defaults.lat;
        config.size = defaults.size;
        updateFlagOnMap();
    }
}

// 複製當前國旗參數
function copyFlagConfig() {
    var config = flagsConfig[currentFlagCountry];
    var text = `${currentFlagCountry}: { lon: ${config.lon.toFixed(1)}, lat: ${config.lat.toFixed(1)}, size: ${config.size} }`;

    navigator.clipboard.writeText(text).then(function () {
        showFlagToast(`已複製 ${config.name} 的參數！`);
    }).catch(function (err) {
        console.error('複製失敗:', err);
    });
}

// 匯出所有國旗配置
function exportAllFlags() {
    var output = 'var flagsConfig = {\n';

    Object.keys(flagsConfig).forEach(function (code, index, array) {
        var config = flagsConfig[code];
        output += `    ${code}: { lon: ${config.lon.toFixed(1)}, lat: ${config.lat.toFixed(1)}, size: ${config.size} }`;
        if (index < array.length - 1) {
            output += ',';
        }
        output += '\n';
    });

    output += '};';

    navigator.clipboard.writeText(output).then(function () {
        showFlagToast('已複製所有配置！可以貼到程式碼中');
    }).catch(function (err) {
        console.error('複製失敗:', err);
    });
}

// 顯示提示訊息
function showFlagToast(message) {
    var toast = document.getElementById('flagToast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(function () {
        toast.classList.remove('show');
    }, 2000);
}

// 面板拖曳功能
(function setupPanelDrag() {
    document.addEventListener('DOMContentLoaded', function () {
        var panel = document.getElementById('flagAdjusterPanel');
        var header = document.getElementById('flagAdjusterHeader');
        if (!panel || !header) return;

        var isDragging = false;
        var currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    });
})();

