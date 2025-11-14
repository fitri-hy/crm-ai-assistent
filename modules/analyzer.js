class CRMAnalyzer {
  constructor(options = {}) {
    this.companyName = options.companyName || "CRM AI Assistant";
  }

  _detectTrend(arr = []) {
    if (!Array.isArray(arr) || arr.length < 2) return "tidak ada data";
    const first = arr[0];
    const last = arr[arr.length - 1];
    if (last > first) return "naik 📈";
    if (last < first) return "turun 📉";
    return "stabil ➖";
  }

  _average(arr = []) {
    if (!arr.length) return 0;
    return arr.reduce((a,b)=>a+Number(b),0)/arr.length;
  }

  _topProduct(products = []) {
    if (!products.length) return null;
    return products.slice().sort((a,b)=> (b.sales||0)+(b.revenue||0) - ((a.sales||0)+(a.revenue||0)) )[0];
  }

  _summarizeTeam(team = []) {
    if (!team.length) return "- (tidak ada data tim)";
    return team.map(t => `${t.name} (Deals: ${t.dealsClosed}, Revenue: Rp ${t.revenue.toLocaleString()})`).join("\n- ");
  }

  _summarizeTraffic(traffic = {}) {
    const entries = Object.entries(traffic);
    if (!entries.length) return "- (tidak ada data traffic)";
    return entries.sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}: ${v}`).join(", ");
  }

  _summarizeFinance(finance = {}) {
    if (!finance) return "- (tidak ada data finance)";
    return `Revenue: Rp ${finance.monthlyRevenue.toLocaleString()}, Expense: Rp ${finance.monthlyExpense.toLocaleString()}, Net Profit: Rp ${finance.netProfit.toLocaleString()}`;
  }

  _summarizeMarket(market = []) {
    if (!market.length) return "- (tidak ada data market)";
    return market.map(m=>`${m.category} (Trend: ${m.trend}, Competitor Price: Rp ${m.competitorPrice.toLocaleString()})`).join("\n- ");
  }

  _summarizeCampaigns(campaigns = []) {
    if (!campaigns.length) return "- (tidak ada data campaigns)";
    return campaigns.map(c=>`${c.name} (Impressions: ${c.impressions}, Clicks: ${c.clicks}, CTR: ${c.ctr})`).join("\n- ");
  }

  _summarizeTickets(tickets = []) {
    if (!tickets.length) return "- (tidak ada data tickets)";
    return tickets.slice(0,5).map(t=>`${t.customerName}: ${t.issue} [${t.status}]`).join("\n- ");
  }

  generate(mem = {}, crm = {}, prediction = {}) {
    const leadTrend = this._detectTrend(mem.leads || []);
    const salesTrend = this._detectTrend(mem.sales || []);
    const avgPrice = this._average((crm.products||[]).map(p=>Number(p.price||0)));

    const topProduct = this._topProduct(crm.products || []);
    const topProductLine = topProduct ? `${topProduct.name} (Sales: ${topProduct.sales||0}, Revenue: ${topProduct.revenue||0})` : "- (tidak ada data produk)";

    const teamSummary = this._summarizeTeam(crm.team);
    const trafficSummary = this._summarizeTraffic(crm.traffic);
    const financeSummary = this._summarizeFinance(crm.finance);
    const marketSummary = this._summarizeMarket(crm.market);
    const campaignsSummary = this._summarizeCampaigns(crm.campaigns);
    const ticketsSummary = this._summarizeTickets(crm.tickets);

    return `
📊 ANALISIS CRM OTOMATIS — ${this.companyName}

Trend:
- Leads: ${leadTrend}
- Sales: ${salesTrend}

Produk Teratas:
- ${topProductLine}

Team Performance:
- ${teamSummary}

Web Traffic Teratas:
- ${trafficSummary}

Financial Summary:
- ${financeSummary}

Market / Competitor:
- ${marketSummary}

Campaigns / Ads:
- ${campaignsSummary}

Support / Tickets:
- ${ticketsSummary}

Prediksi 30 Hari:
- Sales: ${prediction.sales30 || "~"}
- Leads: ${prediction.leads30 || "~"}

(Insight ini menyesuaikan semua data yang tersedia dari user secara otomatis.)
    `.trim();
  }
}

module.exports = CRMAnalyzer;
