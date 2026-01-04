/**
 * ETF 配置數據
 * 來源: https://etfdb.com/tool/etf-country-exposure-tool/
 */

const ETF_CONFIG = {
    name: 'Country ETFs',
    sourceUrl: 'https://etfdb.com/tool/etf-country-exposure-tool/',

    // ETF 列表，含國家代碼映射
    etfs: [
        // 全球組合 ETF
        { symbol: 'VT', name: 'World Total', country: 'world', countryName: '全球' },
        { symbol: 'VXUS', name: 'Ex-US', country: 'world', countryName: '全球' },
        { symbol: 'AAXJ', name: 'Asia ex-Japan', country: 'world', countryName: '全球' },
        { symbol: 'VGK', name: 'Europe', country: 'world', countryName: '全球' },
        { symbol: 'VPL', name: 'Pacific', country: 'world', countryName: '全球' },
        { symbol: 'VWO', name: 'Emerging', country: 'world', countryName: '全球' },
        { symbol: 'ITOT', name: 'US Total', country: 'world', countryName: '全球' },
        { symbol: 'IEFA', name: 'Developed Ex-US', country: 'world', countryName: '全球' },
        { symbol: 'IEUR', name: 'Europe', country: 'world', countryName: '全球' },
        { symbol: 'IPAC', name: 'Asia Pacific', country: 'world', countryName: '全球' },
        { symbol: 'IEMG', name: 'Emerging', country: 'world', countryName: '全球' },

        // 美洲
        { symbol: 'VTI', name: 'USA (Total Market)', country: 'us', countryName: '美國' },
        { symbol: 'VUG', name: 'USA (Growth)', country: 'us', countryName: '美國' },
        { symbol: 'VTV', name: 'USA (Value)', country: 'us', countryName: '美國' },
        { symbol: 'EWC', name: 'Canada', country: 'ca', countryName: '加拿大' },
        { symbol: 'EWZ', name: 'Brazil', country: 'br', countryName: '巴西' },
        { symbol: 'EWW', name: 'Mexico', country: 'mx', countryName: '墨西哥' },
        { symbol: 'ARGT', name: 'Argentina', country: 'ar', countryName: '阿根廷' },
        { symbol: 'COLO', name: 'Colombia', country: 'co', countryName: '哥倫比亞' },

        // 歐洲
        { symbol: 'EWG', name: 'Germany', country: 'de', countryName: '德國' },
        { symbol: 'EWU', name: 'United Kingdom', country: 'gb', countryName: '英國' },
        { symbol: 'EWQ', name: 'France', country: 'fr', countryName: '法國' },
        { symbol: 'EWI', name: 'Italy', country: 'it', countryName: '義大利' },
        { symbol: 'EWP', name: 'Spain', country: 'es', countryName: '西班牙' },
        { symbol: 'EWN', name: 'Netherlands', country: 'nl', countryName: '荷蘭' },
        { symbol: 'EWL', name: 'Switzerland', country: 'ch', countryName: '瑞士' },
        { symbol: 'EPOL', name: 'Poland', country: 'pl', countryName: '波蘭' },
        { symbol: 'EWK', name: 'Belgium', country: 'be', countryName: '比利時' },
        { symbol: 'EWD', name: 'Sweden', country: 'se', countryName: '瑞典' },
        { symbol: 'EIRL', name: 'Ireland', country: 'ie', countryName: '愛爾蘭' },
        { symbol: 'EWO', name: 'Austria', country: 'at', countryName: '奧地利' },
        { symbol: 'NORW', name: 'Norway', country: 'no', countryName: '挪威' },
        { symbol: 'EDEN', name: 'Denmark', country: 'dk', countryName: '丹麥' },

        // 亞太
        { symbol: 'CNYA', name: 'China', country: 'cn', countryName: '中國' },
        { symbol: 'EWJ', name: 'Japan', country: 'jp', countryName: '日本' },
        { symbol: 'INDA', name: 'India', country: 'in', countryName: '印度' },
        { symbol: 'EWY', name: 'South Korea', country: 'kr', countryName: '南韓' },
        { symbol: 'EWT', name: 'Taiwan', country: 'tw', countryName: '台灣' },
        { symbol: 'EWH', name: 'Hong Kong', country: 'hk', countryName: '香港' },
        { symbol: 'EIDO', name: 'Indonesia', country: 'id', countryName: '印尼' },
        { symbol: 'EWS', name: 'Singapore', country: 'sg', countryName: '新加坡' },
        { symbol: 'THD', name: 'Thailand', country: 'th', countryName: '泰國' },
        { symbol: 'VNM', name: 'Vietnam', country: 'vn', countryName: '越南' },
        { symbol: 'EPHE', name: 'Philippines', country: 'ph', countryName: '菲律賓' },
        { symbol: 'EWM', name: 'Malaysia', country: 'my', countryName: '馬來西亞' },
        { symbol: 'EWA', name: 'Australia', country: 'au', countryName: '澳洲' },

        // 中東
        { symbol: 'TUR', name: 'Turkey', country: 'tr', countryName: '土耳其' },
        { symbol: 'KSA', name: 'Saudi Arabia', country: 'sa', countryName: '沙烏地' },
        { symbol: 'EIS', name: 'Israel', country: 'il', countryName: '以色列' },
        { symbol: 'UAE', name: 'United Arab Emirates', country: 'ae', countryName: '阿聯酋' },

        // 非洲
        { symbol: 'EZA', name: 'South Africa', country: 'za', countryName: '南非' }
    ]
};

// 匯出為全域變數
window.ETF_CONFIG = ETF_CONFIG;