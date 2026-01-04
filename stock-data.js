/**
 * Stock Market Real-Time Data Module
 * 使用多種 API 來源獲取全球主要股市指數數據
 */

// 股市指數配置（含時區與開盤時間差異）
// 台灣開盤時間: 09:00-13:30 (UTC+8)
const STOCK_INDICES = {
    us: {
        symbol: '^DJI',
        name: '道瓊指數',
        subIndices: [],
        timezone: -13,
        marketHours: '21:30-04:00',
        timeNote: '晚台股8小時',
        holiday: null  // 無休市
    },
    gb: {
        symbol: '^FTSE',
        name: '英國指數',
        subIndices: [],
        timezone: -8,
        marketHours: '16:00-00:30',
        timeNote: '晚台股7小時',
        holiday: null
    },
    de: {
        symbol: '^GDAXI',
        name: '德國指數',
        subIndices: [],
        timezone: -7,
        marketHours: '16:00-00:30',
        timeNote: '晚台股7小時',
        holiday: null
    },
    fr: {
        symbol: '^FCHI',
        name: '法國指數',
        subIndices: [],
        timezone: -7,
        marketHours: '16:00-00:30',
        timeNote: '晚台股7小時',
        holiday: null
    },
    kr: {
        symbol: '^KS11',
        name: '南韓綜合',
        subIndices: [],
        timezone: +1,
        marketHours: '08:00-14:30',
        timeNote: '早台股1小時',
        holiday: null  // 1/1 休市已過
    },
    jp: {
        symbol: '^N225',
        name: '日本日經',
        subIndices: [],
        timezone: +1,
        marketHours: '08:00-14:00',
        timeNote: '早台股1小時',
        holiday: '12/31-1/3 新年休市'  // 日本新年假期至1/3
    },
    hk: {
        symbol: '^HSI',
        name: '香港恆生',
        subIndices: [],
        timezone: 0,
        marketHours: '09:30-16:00',
        timeNote: '同台灣時區',
        holiday: null
    },
    tw: {
        symbol: '^TWII',
        name: '加權指數',
        subIndices: [],
        timezone: 0,
        marketHours: '09:00-13:30',
        timeNote: '',
        holiday: null  // 1/1 休市已過
    }
};

// CORS Proxy 服務列表（2025年可用）
const CORS_PROXIES = [
    { url: 'https://api.cors.lol/?url=', name: 'cors.lol' },
    { url: 'https://corsproxy.io/?', name: 'corsproxy.io' },
    { url: 'https://api.allorigins.win/raw?url=', name: 'allorigins' },
    { url: 'https://proxy.cors.sh/', name: 'cors.sh' }
];

/**
 * 股市數據管理類
 */
class StockDataManager {
    constructor() {
        this.cache = {};
        this.lastUpdate = null;
        this.updateInterval = 60000;
        this.isUpdating = false;
        this.workingProxyIndex = 0;
    }

    /**
     * 使用多個 CORS Proxy 嘗試獲取數據
     */
    async fetchWithProxy(url) {
        // 先嘗試上次成功的 proxy
        const proxyOrder = [
            this.workingProxyIndex,
            ...Array.from({ length: CORS_PROXIES.length }, (_, i) => i).filter(i => i !== this.workingProxyIndex)
        ];

        for (const proxyIndex of proxyOrder) {
            const proxy = CORS_PROXIES[proxyIndex];
            const fullUrl = proxy.url + encodeURIComponent(url);

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超時

                const response = await fetch(fullUrl, {
                    method: 'GET',
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const text = await response.text();
                    try {
                        const data = JSON.parse(text);
                        // 成功後記住這個 proxy
                        if (this.workingProxyIndex !== proxyIndex) {
                            console.log(`✅ 使用 ${proxy.name} 成功`);
                            this.workingProxyIndex = proxyIndex;
                        }
                        return data;
                    } catch (parseError) {
                        console.warn(`${proxy.name} 返回非 JSON 數據`);
                        continue;
                    }
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.warn(`${proxy.name} 請求超時`);
                } else {
                    console.warn(`${proxy.name} 失敗: ${error.message}`);
                }
                continue;
            }
        }

        throw new Error('所有 CORS proxy 都失敗了');
    }

    /**
     * 使用 Yahoo Finance API 獲取股票數據
     */
    async fetchQuote(symbol) {
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;

        try {
            const data = await this.fetchWithProxy(yahooUrl);

            if (data.chart && data.chart.result && data.chart.result[0]) {
                const result = data.chart.result[0];
                const meta = result.meta;

                const currentPrice = meta.regularMarketPrice || meta.previousClose;
                const previousClose = meta.chartPreviousClose || meta.previousClose;
                const change = currentPrice - previousClose;
                const changePercent = previousClose ? (change / previousClose) * 100 : 0;

                return {
                    symbol: symbol,
                    price: currentPrice,
                    previousClose: previousClose,
                    change: change,
                    changePercent: changePercent,
                    currency: meta.currency || 'USD',
                    marketState: meta.marketState || 'CLOSED',
                    exchangeTimezoneName: meta.exchangeTimezoneName,
                    regularMarketTime: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000) : new Date()
                };
            }

            return null;
        } catch (error) {
            console.warn(`⚠️ 獲取 ${symbol} 數據失敗:`, error.message);
            return null;
        }
    }

    /**
     * 批量獲取所有指數數據 - 並行優化版本
     */
    async fetchAllIndices() {
        if (this.isUpdating) {
            console.log('⏳ 數據更新中，跳過本次請求');
            return this.cache;
        }

        this.isUpdating = true;
        const startTime = Date.now();
        console.log('🔄 開始並行獲取股市數據...');

        const results = {};

        // 初始化結果物件
        for (const countryCode of Object.keys(STOCK_INDICES)) {
            results[countryCode] = { main: null, sub: [] };
        }

        // 並行獲取所有主要指數
        const fetchPromises = Object.entries(STOCK_INDICES).map(async ([countryCode, config]) => {
            try {
                const mainData = await this.fetchQuote(config.symbol);
                results[countryCode].main = mainData;

                if (mainData) {
                    console.log(`📈 ${config.name}: ${mainData.price?.toFixed(2)} (${mainData.changePercent?.toFixed(2)}%)`);
                }
            } catch (error) {
                console.warn(`⚠️ ${config.name} 獲取失敗`);
            }
        });

        // 等待所有請求完成
        await Promise.all(fetchPromises);

        this.cache = results;
        this.lastUpdate = new Date();
        this.isUpdating = false;

        const successCount = Object.values(results).filter(r => r.main !== null).length;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`✅ 股市數據獲取完成 (${successCount}/${Object.keys(STOCK_INDICES).length}) - ${elapsed}秒`);

        return results;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getMarketStatus(countryCode, marketState) {
        if (marketState === 'REGULAR') {
            return { text: '交易中', class: 'open' };
        } else if (marketState === 'PRE') {
            return { text: '盤前', class: 'pre' };
        } else if (marketState === 'POST') {
            return { text: '盤後', class: 'post' };
        } else {
            return { text: '已收盤', class: 'closed' };
        }
    }

    formatNumber(num, decimals = 1) {
        if (num === null || num === undefined || isNaN(num)) return '-';
        return num.toLocaleString('zh-TW', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    formatDate(date) {
        if (!date) return '-';
        if (typeof date === 'number') {
            date = new Date(date * 1000);
        }
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }).replace(/\//g, '/');
    }
}

/**
 * UI 更新類
 */
class StockUIUpdater {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.cardMapping = this.createCardMapping();
    }

    createCardMapping() {
        const cards = document.querySelectorAll('.index-card');
        const mapping = {};

        const countryPatterns = {
            '/us.': 'us', 'us.png': 'us',
            '/gb.': 'gb', 'gb.png': 'gb',
            '/de.': 'de', 'de.png': 'de',
            '/fr.': 'fr', 'fr.png': 'fr',
            '/kr.': 'kr', 'kr.png': 'kr',
            '/jp.': 'jp', 'jp.png': 'jp',
            '/hk.': 'hk', 'hk.png': 'hk',
            '/tw.': 'tw', 'tw.png': 'tw'
        };

        cards.forEach(card => {
            const flagImg = card.querySelector('.flag');
            if (flagImg) {
                const src = flagImg.getAttribute('src') || '';
                for (const [pattern, code] of Object.entries(countryPatterns)) {
                    if (src.includes(pattern)) {
                        mapping[code] = card;
                        card.dataset.countryCode = code;
                        break;
                    }
                }
            }
        });

        console.log('📋 卡片映射:', Object.keys(mapping));
        return mapping;
    }

    updateCard(countryCode, data) {
        const card = this.cardMapping[countryCode];
        if (!card || !data || !data.main) {
            return;
        }

        const mainData = data.main;

        // 更新日期
        const dateEl = card.querySelector('.date');
        if (dateEl && mainData.regularMarketTime) {
            dateEl.textContent = this.dataManager.formatDate(mainData.regularMarketTime);
        }

        // 更新市場狀態（含時差說明與休市資訊）
        const statusEl = card.querySelector('.status');
        if (statusEl) {
            const status = this.dataManager.getMarketStatus(countryCode, mainData.marketState);
            const config = STOCK_INDICES[countryCode];
            const timeNote = config?.timeNote || '';
            const holiday = config?.holiday || null;

            // 組合狀態文字
            let statusHTML = status.text;

            // 如果有休市資訊且市場已收盤，優先顯示
            if (holiday && status.class === 'closed') {
                statusHTML = `<span class="holiday-note">📅 ${holiday}</span>`;
            } else if (timeNote && status.class === 'closed') {
                statusHTML = `${status.text} <span class="time-note">${timeNote}</span>`;
            }

            statusEl.innerHTML = statusHTML;
            statusEl.className = 'status ' + status.class;
        }

        // 更新主要指數值
        const valueEl = card.querySelector('.index-value');
        if (valueEl && mainData.price) {
            const change = mainData.change || 0;
            const changePercent = mainData.changePercent || 0;
            const direction = change >= 0 ? 'up' : 'down';
            const arrow = change >= 0 ? '▲' : '▼';
            const sign = change >= 0 ? '+' : '';

            valueEl.className = 'index-value ' + direction;
            valueEl.innerHTML = `
                ${this.dataManager.formatNumber(mainData.price, 1)} 
                <span class="change">${arrow}${sign}${this.dataManager.formatNumber(change, 1)} (${sign}${changePercent.toFixed(1)}%)</span>
            `;
        }

        // 更新子指數
        const subIndicesContainer = card.querySelector('.sub-indices');
        if (subIndicesContainer && data.sub && data.sub.length > 0) {
            const subHTML = data.sub.map(sub => {
                if (!sub.data || !sub.data.price) {
                    return `
                        <div class="sub-index">
                            <span class="sub-name">${sub.name}</span>
                            <span class="sub-value neutral">-- (--)</span>
                        </div>
                    `;
                }

                const change = sub.data.change || 0;
                const changePercent = sub.data.changePercent || 0;
                const direction = change >= 0 ? 'up' : 'down';
                const arrow = change >= 0 ? '▲' : '▼';
                const sign = change >= 0 ? '+' : '';

                return `
                    <div class="sub-index">
                        <span class="sub-name">${sub.name}</span>
                        <span class="sub-value ${direction}">${this.dataManager.formatNumber(sub.data.price, 1)} ${arrow}${sign}${this.dataManager.formatNumber(change, 0)} (${sign}${changePercent.toFixed(1)}%)</span>
                    </div>
                `;
            }).join('');

            subIndicesContainer.innerHTML = subHTML;
        }

        // 更新地圖顏色
        this.updateCountryColor(countryCode, mainData.change >= 0 ? 'up' : 'down');
    }

    updateCountryColor(countryCode, direction) {
        // 確保全域變數存在
        if (typeof countryColors === 'undefined' || typeof countrySeries === 'undefined' || typeof am5 === 'undefined') {
            return;
        }

        const upColor = 0xd32f2f;    // 紅色 (漲)
        const downColor = 0x2e7d32;  // 綠色 (跌)
        const newColor = direction === 'up' ? upColor : downColor;

        countryColors[countryCode] = newColor;

        if (countrySeries[countryCode]) {
            countrySeries[countryCode].mapPolygons.each(function (polygon) {
                polygon.set("fill", am5.color(newColor));
                polygon.set("fillOpacity", 0.6);
            });
            console.log(`🗺️ ${countryCode} 地圖顏色更新: ${direction === 'up' ? '紅色(漲)' : '綠色(跌)'}`);
        }
    }

    async updateAllCards() {
        try {
            const data = await this.dataManager.fetchAllIndices();

            for (const [countryCode, indexData] of Object.entries(data)) {
                this.updateCard(countryCode, indexData);
            }

            const now = new Date();
            console.log(`🕐 數據更新時間: ${now.toLocaleTimeString('zh-TW')}`);

        } catch (error) {
            console.error('❌ 更新卡片失敗:', error);
        }
    }
}

/**
 * ETF 數據管理類
 */
class ETFDataManager extends StockDataManager {
    constructor() {
        super();
        this.etfCache = {};
    }

    /**
     * 批量獲取所有 ETF 數據 - 使用 Yahoo Finance 批量端點優化
     */
    async fetchAllETFs() {
        if (this.isUpdating) {
            console.log('⏳ ETF 數據更新中，跳過本次請求');
            return this.etfCache;
        }

        this.isUpdating = true;
        const startTime = Date.now();
        console.log('🔄 開始並行獲取 ETF 數據...');

        const results = {};
        const countryAggregation = {};

        // 初始化國家聚合物件
        ETF_CONFIG.etfs.forEach(etf => {
            if (!countryAggregation[etf.country]) {
                countryAggregation[etf.country] = {
                    etfs: [],
                    changes: [],
                    avgChange: 0
                };
            }
        });


        // 並行獲取所有 ETF
        const fetchPromises = ETF_CONFIG.etfs.map(async (etfConfig) => {
            try {
                const data = await this.fetchQuote(etfConfig.symbol);
                results[etfConfig.symbol] = {
                    config: etfConfig,
                    data: data
                };

                if (data && data.changePercent !== undefined) {
                    countryAggregation[etfConfig.country].etfs.push(etfConfig.symbol);
                    countryAggregation[etfConfig.country].changes.push(data.changePercent);
                    console.log(`📊 ${etfConfig.symbol} (${etfConfig.countryName}): ${data.price?.toFixed(2)} (${data.changePercent?.toFixed(2)}%)`);
                }
            } catch (error) {
                console.warn(`⚠️ ${etfConfig.symbol} 獲取失敗`);
                results[etfConfig.symbol] = {
                    config: etfConfig,
                    data: null
                };
            }
        });

        // 等待所有請求完成
        await Promise.all(fetchPromises);


        // 計算每個國家的平均漲跌幅
        Object.keys(countryAggregation).forEach(countryCode => {
            const agg = countryAggregation[countryCode];
            if (agg.changes.length > 0) {
                agg.avgChange = agg.changes.reduce((sum, val) => sum + val, 0) / agg.changes.length;
            }
        });

        this.etfCache = {
            etfs: results,
            countries: countryAggregation
        };
        this.lastUpdate = new Date();
        this.isUpdating = false;

        const successCount = Object.values(results).filter(r => r.data !== null).length;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`✅ ETF 數據獲取完成 (${successCount}/${ETF_CONFIG.etfs.length}) - ${elapsed}秒`);

        return this.etfCache;
    }
}

/**
 * ETF UI 更新類
 */
class ETFUIUpdater {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.etfMapping = this.createETFMapping();
    }

    createETFMapping() {
        const etfItems = document.querySelectorAll('.etf-item');
        const mapping = {};

        etfItems.forEach(item => {
            const symbolEl = item.querySelector('.etf-symbol');
            if (symbolEl) {
                const symbol = symbolEl.textContent.trim();
                // 支持同一個 symbol 對應多個 HTML 元素（例如 VTI 在世界組合和北美 ETF 都有）
                if (!mapping[symbol]) {
                    mapping[symbol] = [];
                }
                mapping[symbol].push(item);
            }
        });

        const totalItems = Object.values(mapping).reduce((sum, items) => sum + items.length, 0);
        console.log(`📋 ETF 卡片映射: ${Object.keys(mapping).length} 個 symbol, ${totalItems} 個項目`);
        return mapping;
    }

    updateETFItem(symbol, data) {
        const items = this.etfMapping[symbol];
        if (!items || !data) {
            return;
        }

        // 更新所有相同 symbol 的項目（支持重複的 ETF）
        items.forEach(item => {
            // 更新價格
            const priceEl = item.querySelector('.etf-price');
            if (priceEl && data.price) {
                priceEl.textContent = `$${this.dataManager.formatNumber(data.price, 2)}`;
            }

            // 更新漲跌
            const changeEl = item.querySelector('.etf-change');
            if (changeEl && data.changePercent !== undefined) {
                const change = data.change || 0;
                const changePercent = data.changePercent || 0;
                const direction = change >= 0 ? 'up' : 'down';
                const arrow = change >= 0 ? '▲' : '▼';
                const sign = change >= 0 ? '+' : '';

                changeEl.className = 'etf-change ' + direction;
                changeEl.textContent = `${arrow}${sign}${changePercent.toFixed(2)}%`;
            }
        });
    }

    updateCountryETFColor(countryCode, avgChange) {
        // 確保全域變數存在
        if (typeof countrySeries === 'undefined' || typeof am5 === 'undefined') {
            return;
        }

        // 美國市場慣例：綠色上漲、紅色下跌
        const upColor = 0x2e7d32;    // 綠色 (漲)
        const downColor = 0xd32f2f;  // 紅色 (跌)
        const newColor = avgChange >= 0 ? upColor : downColor;

        if (countrySeries[countryCode]) {
            countrySeries[countryCode].mapPolygons.each(function (polygon) {
                polygon.set("fill", am5.color(newColor));
                polygon.set("fillOpacity", 0.6);
            });
            console.log(`🗺️ ${countryCode} ETF 地圖顏色更新: ${avgChange >= 0 ? '綠色(漲)' : '紅色(跌)'} (平均 ${avgChange.toFixed(2)}%)`);
        }
    }

    async updateAllETFs() {
        try {
            const data = await this.dataManager.fetchAllETFs();

            // 更新所有 ETF 卡片
            Object.entries(data.etfs).forEach(([symbol, etfData]) => {
                this.updateETFItem(symbol, etfData.data);
            });

            // 更新地圖顏色（按國家平均）
            Object.entries(data.countries).forEach(([countryCode, countryData]) => {
                if (countryData.changes.length > 0) {
                    this.updateCountryETFColor(countryCode, countryData.avgChange);
                }
            });

            const now = new Date();
            console.log(`🕐 ETF 數據更新時間: ${now.toLocaleTimeString('zh-TW')}`);

        } catch (error) {
            console.error('❌ 更新 ETF 卡片失敗:', error);
        }
    }
}

// ==================== 初始化 ====================

let stockDataManager;
let stockUIUpdater;
let etfDataManager;
let etfUIUpdater;

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initStockData, 500);  // 快速啟動
});

async function initStockData() {
    console.log('📊 初始化股市數據系統...');

    stockDataManager = new StockDataManager();
    stockUIUpdater = new StockUIUpdater(stockDataManager);

    await stockUIUpdater.updateAllCards();

    setInterval(async () => {
        console.log('⏰ 定時更新股市數據...');
        await stockUIUpdater.updateAllCards();
    }, 60000);

    console.log('✅ 股市數據系統初始化完成');
}

async function initETFData() {
    console.log('📈 初始化 ETF 數據系統...');

    if (!etfDataManager) {
        etfDataManager = new ETFDataManager();
        etfUIUpdater = new ETFUIUpdater(etfDataManager);
    }

    await etfUIUpdater.updateAllETFs();

    console.log('✅ ETF 數據系統初始化完成');
}

async function refreshStockData() {
    if (stockUIUpdater) {
        console.log('🔄 手動刷新股市數據...');
        await stockUIUpdater.updateAllCards();
    }
}

async function refreshETFData() {
    if (etfUIUpdater) {
        console.log('🔄 手動刷新 ETF 數據...');
        await etfUIUpdater.updateAllETFs();
    }
}

window.refreshStockData = refreshStockData;
window.refreshETFData = refreshETFData;
window.initETFData = initETFData;
window.StockDataManager = StockDataManager;
window.StockUIUpdater = StockUIUpdater;
window.ETFDataManager = ETFDataManager;
window.ETFUIUpdater = ETFUIUpdater;
