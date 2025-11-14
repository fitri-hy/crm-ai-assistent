const path = require("path");
const CRMLearner = require("./learner");
const CRMAnalyzer = require("./analyzer");
const CRMNLP = require("./nlp");
const CRMPredictor = require("./predictor");

const OpenAIProvider = require("./ai-providers/openai");
const GeminiProvider = require("./ai-providers/gemini");
const ClaudeProvider = require("./ai-providers/claude");

const dbConfig = require("../config/database.config.js");
const mysqlLoader = require("./data-loaders/mysql.loader");
const pgLoader = require("./data-loaders/postgres.loader");
const mongoLoader = require("./data-loaders/mongo.loader");
const apiLoader = require("./data-loaders/api.loader");
const mergeData = require("./data-loaders/merger");

class SuperCRMAI {
  constructor(config = {}) {
    this.companyName = config.companyName || "CRM AI Assistent";
    this.dataMap = config.dataMap || {};
    this.useDatabase = config.useDatabase ?? false;
    this.aiProvider = config.aiProvider || "openai";
    this.apiKey = config.apiKey || null;
    this.memoryPath = config.memoryPath || path.join(__dirname, "memory.json");
    this.providerOptions = config.providerOptions || {};
    this.learner = new CRMLearner({ memoryPath: this.memoryPath });
    this.analyzer = new CRMAnalyzer({ companyName: this.companyName });
    this.predictor = new CRMPredictor();
    this.nlp = new CRMNLP();

    this.ai = this._initProvider(this.aiProvider, this.apiKey, this.providerOptions);
  }

  _initProvider(provider, apiKey, opts = {}) {
    if (!apiKey) return null;

    const providers = {
      openai: OpenAIProvider,
      gemini: GeminiProvider,
      claude: ClaudeProvider
    };

    try {
      return new (providers[provider] || OpenAIProvider)(apiKey, opts);
    } catch (err) {
      console.warn(`[AI Provider Error] ${provider}:`, err.message);
      return null;
    }
  }

  async loadDatabaseData() {
    if (!this.useDatabase) return {};

    let datasets = [];

    for (const source of dbConfig.sources) {
      try {
        let data = {};

        if (source.type === "mysql") data = await mysqlLoader(source);
        if (source.type === "postgres") data = await pgLoader(source);
        if (source.type === "mongo") data = await mongoLoader(source);
        if (source.type === "api") data = await apiLoader(source);

        datasets.push(data);
      } catch (err) {
        console.error(`[DB Loader Error] ${source.type}:`, err.message);
      }
    }

    return mergeData(...datasets);
  }

  async loadCRMData() {
    const output = {};

    for (const key of Object.keys(this.dataMap)) {
      try {
        const fn = this.dataMap[key];
        output[key] = typeof fn === "function" ? await fn() : fn;
      } catch (err) {
        console.error(`[dataMap Error] ${key}:`, err.message);
        output[key] = null;
      }
    }

    return output;
  }

  async chat(question) {
    if (!this.nlp.isCRMIntent(question)) {
      return "Pertanyaan Anda kurang spesifik untuk konteks CRM. Coba tanyakan seputar penjualan, leads, produk, pelanggan, atau performa tim.";
    }

    const dbData = await this.loadDatabaseData();
    const mapData = await this.loadCRMData();
    const crm = mergeData(dbData, mapData);
    const mem = this.learner.learn(crm);

    const prediction = {
      sales30: this.predictor.forecastSales(mem?.history?.sales || []),
      leads30: this.predictor.forecastLeads(mem?.history?.leads || []),
      churnRisk: this.predictor.detectChurn(
        mem?.history?.leads || [],
        mem?.history?.sales || []
      )
    };

    const insight = this.analyzer.generate(mem, crm, prediction);
    if (!this.ai) return insight;

    // Prompt AI
    const prompt = `
Anda adalah AI CRM Assistant untuk ${this.companyName}.
Berikan jawaban singkat, padat, dan jelas.
Gunakan Insight internal berikut untuk memahami data bisnis:

=== INSIGHT CRM ===
${insight}
====================

Instruksi:
- Jawaban maksimal 5 kalimat.
- Fokus pada inti masalah.
- Jika prediksi diperlukan, pakai data insight.
`;

    try {
      return await this.ai.chat(prompt, question);
    } catch (err) {
      console.error("[AI ERROR]:", err.message);
      return insight;
    }
  }
}

module.exports = SuperCRMAI;
