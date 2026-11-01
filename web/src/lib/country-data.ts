import {
  CountryCode,
  CountryMetadata,
  CountryIntelligenceReport,
} from "./country-types";

export const SUPPORTED_COUNTRIES_LIST: CountryMetadata[] = [
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    currency: "INR",
    currencySymbol: "₹",
    primaryExchanges: ["NSE", "BSE"],
    benchmarkIndexName: "Nifty 50",
    benchmarkIndexTicker: "^NSEI",
    secondaryIndexTicker: "^BSESN",
    timezoneName: "Asia/Kolkata",
    tradingHours: "09:15 - 15:30 IST (Mon-Fri)",
    keySectors: [
      "Banking & Financial Services",
      "Information Technology",
      "Energy & Oil",
      "Automotive",
      "Pharmaceuticals & Healthcare",
      "Infrastructure & Capital Goods",
      "Consumer Goods (FMCG)",
      "Metals & Mining",
      "Telecommunications",
      "Renewable Energy",
    ],
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    currency: "USD",
    currencySymbol: "$",
    primaryExchanges: ["NYSE", "NASDAQ"],
    benchmarkIndexName: "S&P 500",
    benchmarkIndexTicker: "^GSPC",
    secondaryIndexTicker: "^IXIC",
    timezoneName: "America/New_York",
    tradingHours: "09:30 - 16:00 EST (Mon-Fri)",
    keySectors: [
      "Information Technology",
      "Artificial Intelligence & Semis",
      "Banking & Finance",
      "Healthcare & Biotech",
      "Energy & Oil",
      "Consumer Discretionary",
      "Aerospace & Defence",
      "Telecommunications",
      "Industrials",
      "Real Estate",
    ],
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    currencySymbol: "£",
    primaryExchanges: ["LSE"],
    benchmarkIndexName: "FTSE 100",
    benchmarkIndexTicker: "^FTSE",
    secondaryIndexTicker: "^FTMC",
    timezoneName: "Europe/London",
    tradingHours: "08:00 - 16:30 GMT (Mon-Fri)",
    keySectors: [
      "Banking & Financial Services",
      "Energy & Oil (Supermajors)",
      "Pharmaceuticals & Healthcare",
      "Mining & Materials",
      "Consumer Staples",
      "Aerospace & Defence",
      "Telecommunications",
      "Utilities",
    ],
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    currency: "JPY",
    currencySymbol: "¥",
    primaryExchanges: ["TSE"],
    benchmarkIndexName: "Nikkei 225",
    benchmarkIndexTicker: "^N225",
    secondaryIndexTicker: "1306.T",
    timezoneName: "Asia/Tokyo",
    tradingHours: "09:00 - 15:30 JST (Mon-Fri)",
    keySectors: [
      "Automotive & Mobility",
      "Semiconductor Equipment & Electronics",
      "Robotics & Industrial Automation",
      "Banking & Financial Services",
      "Trading Companies (Sogo Shosha)",
      "Pharmaceuticals & Chemicals",
      "Consumer Electronics",
    ],
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    currency: "EUR",
    currencySymbol: "€",
    primaryExchanges: ["XETRA", "Frankfurt"],
    benchmarkIndexName: "DAX 40",
    benchmarkIndexTicker: "^GDAXI",
    secondaryIndexTicker: "^MDAXI",
    timezoneName: "Europe/Berlin",
    tradingHours: "09:00 - 17:30 CET (Mon-Fri)",
    keySectors: [
      "Automotive Engineering",
      "Chemicals & Materials",
      "Industrial Machinery & Siemens",
      "Software & Cloud (SAP)",
      "Healthcare & MedTech",
      "Renewables & Utilities",
      "Financial Services",
    ],
  },
  {
    code: "CN",
    name: "China",
    flag: "🇨🇳",
    currency: "CNY",
    currencySymbol: "¥",
    primaryExchanges: ["SSE", "SZSE", "HKEX"],
    benchmarkIndexName: "Shanghai Composite",
    benchmarkIndexTicker: "000001.SS",
    secondaryIndexTicker: "399001.SZ",
    timezoneName: "Asia/Shanghai",
    tradingHours: "09:30 - 15:00 CST (Mon-Fri)",
    keySectors: [
      "Electric Vehicles & Battery Tech",
      "E-commerce & Big Tech",
      "Semiconductors & Hardware",
      "Renewable Energy & Solar",
      "State-Owned Banking & Finance",
      "Real Estate & Construction",
      "Consumer Discretionary",
    ],
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    currency: "AUD",
    currencySymbol: "A$",
    primaryExchanges: ["ASX"],
    benchmarkIndexName: "S&P/ASX 200",
    benchmarkIndexTicker: "^AXJO",
    secondaryIndexTicker: "^AORD",
    timezoneName: "Australia/Sydney",
    tradingHours: "10:00 - 16:00 AEST (Mon-Fri)",
    keySectors: [
      "Mining & Iron Ore (BHP/Rio)",
      "Banking (Big Four)",
      "Energy & LNG",
      "Healthcare (Biotech)",
      "Real Estate Investment Trusts",
      "Consumer Discretionary",
    ],
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    currencySymbol: "C$",
    primaryExchanges: ["TSX"],
    benchmarkIndexName: "S&P/TSX Composite",
    benchmarkIndexTicker: "^GSPTSE",
    secondaryIndexTicker: "XIU.TO",
    timezoneName: "America/Toronto",
    tradingHours: "09:30 - 16:00 EST (Mon-Fri)",
    keySectors: [
      "Banking & Financial Services",
      "Energy & Oil Sands",
      "Mining & Critical Minerals",
      "Technology & Software",
      "Transportation & Logistics",
      "Telecommunications",
    ],
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    currency: "SGD",
    currencySymbol: "S$",
    primaryExchanges: ["SGX"],
    benchmarkIndexName: "Straits Times Index (STI)",
    benchmarkIndexTicker: "^STI",
    secondaryIndexTicker: "ES3.SI",
    timezoneName: "Asia/Singapore",
    tradingHours: "09:00 - 17:00 SGT (Mon-Fri)",
    keySectors: [
      "Banking & Wealth Management (DBS/OCBC/UOB)",
      "Real Estate Investment Trusts (S-REITs)",
      "Industrial Conglomerates",
      "Telecommunications & Tech",
      "Aviation & Logistics",
    ],
  },
  {
    code: "PK",
    name: "Pakistan",
    flag: "🇵🇰",
    currency: "PKR",
    currencySymbol: "₨",
    primaryExchanges: ["PSX"],
    benchmarkIndexName: "KSE 100 Index",
    benchmarkIndexTicker: "^KSE",
    secondaryIndexTicker: "KSE30.KA",
    timezoneName: "Asia/Karachi",
    tradingHours: "09:15 - 15:30 PKT (Mon-Fri)",
    keySectors: [
      "Commercial Banking",
      "Oil & Gas Exploration & Production",
      "Fertilizers & Agriculture",
      "Cement & Construction Materials",
      "Textiles & Apparel",
      "Power Generation & Utilities",
      "Technology & IT Services",
      "Automotive Assembly",
      "Pharmaceuticals",
      "Chemicals",
    ],
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    currency: "SAR",
    currencySymbol: "﷼",
    primaryExchanges: ["Tadawul"],
    benchmarkIndexName: "Tadawul All Share (TASI)",
    benchmarkIndexTicker: "^TASI.SR",
    secondaryIndexTicker: "2222.SR",
    timezoneName: "Asia/Riyadh",
    tradingHours: "10:00 - 15:00 AST (Sun-Thu)",
    keySectors: [
      "Energy & Oil (Aramco)",
      "Banking & Financial Services",
      "Petrochemicals & Materials (SABIC)",
      "Telecommunications (STC)",
      "Mining & Metals",
      "Utilities & Power",
    ],
  },
  {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    currency: "BRL",
    currencySymbol: "R$",
    primaryExchanges: ["B3"],
    benchmarkIndexName: "Ibovespa",
    benchmarkIndexTicker: "^BVSP",
    secondaryIndexTicker: "PETR4.SA",
    timezoneName: "America/Sao_Paulo",
    tradingHours: "10:00 - 17:00 BRT (Mon-Fri)",
    keySectors: [
      "Energy & Petrobras",
      "Mining & Iron Ore (Vale)",
      "Banking & Financial Services",
      "Agriculture & Food Processing",
      "Pulp & Paper",
      "Utilities",
    ],
  },
  {
    code: "KR",
    name: "South Korea",
    flag: "🇰🇷",
    currency: "KRW",
    currencySymbol: "₩",
    primaryExchanges: ["KRX"],
    benchmarkIndexName: "KOSPI",
    benchmarkIndexTicker: "^KS11",
    secondaryIndexTicker: "005930.KS",
    timezoneName: "Asia/Seoul",
    tradingHours: "09:00 - 15:30 KST (Mon-Fri)",
    keySectors: [
      "Semiconductors & Memory (Samsung, SK Hynix)",
      "Automotive & Batteries (Hyundai)",
      "Consumer Electronics & Appliances",
      "Biopharmaceuticals & Healthcare",
      "Shipbuilding & Heavy Equipment",
      "Internet & Gaming",
    ],
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    currency: "AED",
    currencySymbol: "د.إ",
    primaryExchanges: ["ADX", "DFM"],
    benchmarkIndexName: "FTSE ADX General Index",
    benchmarkIndexTicker: "^FADGI",
    secondaryIndexTicker: "DFMGI.AE",
    timezoneName: "Asia/Dubai",
    tradingHours: "10:00 - 15:00 GST (Mon-Fri)",
    keySectors: [
      "Banking & Wealth Management",
      "Real Estate & Development (Emaar)",
      "Energy & Infrastructure",
      "Aviation & Logistics",
      "Telecommunications",
    ],
  },
];

export function getCountryMetadata(code: string): CountryMetadata {
  const normalized = (code || "").trim().toUpperCase();
  const match = SUPPORTED_COUNTRIES_LIST.find((c) => c.code === normalized);
  return match || resolveCountry(code);
}

export function resolveCountry(query: string): CountryMetadata {
  if (!query || !query.trim()) {
    return SUPPORTED_COUNTRIES_LIST[0]; // Default India
  }

  const raw = query.trim();
  const upper = raw.toUpperCase();

  // 1. Exact country code match
  const codeMatch = SUPPORTED_COUNTRIES_LIST.find((c) => c.code === upper);
  if (codeMatch) return codeMatch;

  // 2. Normalize and strip generic financial filler words
  let cleaned = raw.toLowerCase();
  const fillers = [
    "future in stock",
    "future stock",
    "future in",
    "future",
    "in stock",
    "stock market",
    "stocks",
    "stock",
    "shares",
    "market",
    "economy",
    "outlook",
    "intelligence",
    "forecast",
    "investing",
    "investment",
    "analysis",
    "what is happening in",
    "how is",
    "growth in",
    "trend in",
  ];
  for (const f of fillers) {
    cleaned = cleaned.replace(new RegExp(f, "g"), " ");
  }
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // Common aliases & typo map (e.g. 'pakisant' -> Pakistan)
  const aliasMap: Record<string, CountryCode> = {
    pakisant: "PK",
    pakistan: "PK",
    pakistn: "PK",
    pak: "PK",
    pk: "PK",
    pkr: "PK",
    kse: "PK",
    kse100: "PK",
    "kse-100": "PK",
    psx: "PK",
    karachi: "PK",
    lahore: "PK",
    islamabad: "PK",

    india: "IN",
    bharat: "IN",
    ind: "IN",
    in: "IN",
    nifty: "IN",
    sensex: "IN",
    nse: "IN",
    bse: "IN",

    us: "US",
    usa: "US",
    "united states": "US",
    america: "US",
    sp500: "US",
    "s&p": "US",
    nasdaq: "US",
    nyse: "US",

    uk: "GB",
    "united kingdom": "GB",
    britain: "GB",
    england: "GB",
    ftse: "GB",
    lse: "GB",

    japan: "JP",
    jp: "JP",
    tokyo: "JP",
    nikkei: "JP",
    tse: "JP",

    germany: "DE",
    deutschland: "DE",
    de: "DE",
    dax: "DE",
    frankfurt: "DE",

    china: "CN",
    prc: "CN",
    cn: "CN",
    shanghai: "CN",
    sse: "CN",
    shenzhen: "CN",

    australia: "AU",
    aussie: "AU",
    au: "AU",
    asx: "AU",
    sydney: "AU",

    canada: "CA",
    ca: "CA",
    tsx: "CA",
    toronto: "CA",

    singapore: "SG",
    sg: "SG",
    sgx: "SG",
    sti: "SG",

    saudi: "SA",
    "saudi arabia": "SA",
    ksa: "SA",
    tasi: "SA",
    tadawul: "SA",

    brazil: "BR",
    brasil: "BR",
    b3: "BR",
    ibovespa: "BR",

    korea: "KR",
    "south korea": "KR",
    kospi: "KR",
    krx: "KR",

    uae: "AE",
    dubai: "AE",
    "abu dhabi": "AE",
    adx: "AE",
    dfm: "AE",
  };

  if (aliasMap[cleaned]) {
    const found = SUPPORTED_COUNTRIES_LIST.find((c) => c.code === aliasMap[cleaned]);
    if (found) return found;
  }

  // 3. Substring tokens in alias map
  const words = [...cleaned.split(" "), ...raw.toLowerCase().split(" ")];
  for (const w of words) {
    if (aliasMap[w]) {
      const found = SUPPORTED_COUNTRIES_LIST.find((c) => c.code === aliasMap[w]);
      if (found) return found;
    }
  }

  // 4. Exact or partial match in metadata fields
  for (const c of SUPPORTED_COUNTRIES_LIST) {
    const cname = c.name.toLowerCase();
    const idxName = c.benchmarkIndexName.toLowerCase();
    const idxTicker = c.benchmarkIndexTicker.toLowerCase();
    if (
      cname.includes(cleaned) ||
      cleaned.includes(cname) ||
      idxName.includes(cleaned) ||
      cleaned.includes(idxName) ||
      idxTicker.includes(cleaned) ||
      c.primaryExchanges.some((ex) => cleaned.includes(ex.toLowerCase()))
    ) {
      return c;
    }
  }

  // 5. Character overlap fallback (typo tolerance e.g. "pakisant" vs "pakistan")
  for (const c of SUPPORTED_COUNTRIES_LIST) {
    const cname = c.name.toLowerCase();
    if (cleaned.length >= 4 && cname.length >= 4) {
      const setA = new Set(cleaned.split(""));
      const setB = new Set(cname.split(""));
      let overlap = 0;
      setA.forEach((char) => {
        if (setB.has(char)) overlap++;
      });
      if (overlap / Math.max(setA.size, setB.size) > 0.75) {
        return c;
      }
    }
  }

  return SUPPORTED_COUNTRIES_LIST[0]; // fallback to India
}
