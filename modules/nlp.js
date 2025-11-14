class CRMNLP {
  constructor() {
    // Keyword CRM
    this.crmKeywords = [
      "crm",
      "penjualan",
      "sales",
      "leads",
      "lead",
      "closing",
      "deal",
      "customer",
      "omset",
      "financial",
      "finansial",
      "omset",
      "web",
      "platform",
      "traffic",
      "trafik",
      "finance",
      "produk",
      "pelanggan",
      "customer",
      "klien",
      "retensi",
      "churn",
      "aktivitas sales",
      "pipeline",
      "funnel",
      "marketing",
      "prospek",
      "market",
      "analytics",
      "support",
      "bantuan",
      "tiket",
      "tikcet",
      "iklan",
      "kpi",
      "proyeksi",
      "forecast",
      "campaign",
      "ads",
      "tim",
      "team",
      "performa tim",
      "kinerja tim",
      "sales team",
      "agent",
      "staff",
      "performa",
      "evaluasi tim",
      "ranking tim",
      "ketua tim",
      "sales terbaik",
      "agent terbaik",
      "performance",
      "category",
      "kategori",
      "produk terlaris",
      "produk populer",
      "lead terbanyak",
      "lead baru",
      "sales tertinggi",
      "campaign",
      "iklan",
      "budget",
      "ctr",
      "konversi",
      "market trend",
      "trend pasar",
      "kompetitor",
      "analisis",
      "forecast penjualan",
      "prediksi penjualan",
      "prediksi leads",
      "strategi marketing",
      "strategi penjualan"
    ];
  }

  isCRMIntent(text = "") {
    if (!text) return false;
    const q = text.toLowerCase().trim();

    // If the question is very general → it is still considered CRM
    const generalKeywords = ["tim", "team", "performa", "sales", "produk", "lead", "campaign"];
    if (generalKeywords.some((g) => q.includes(g))) return true;

    return this.crmKeywords.some((kw) => q.includes(kw));
  }
}

module.exports = CRMNLP;
