class CRMPredictor {
  movingAverage(data = [], period = 3) {
    if (!Array.isArray(data) || data.length === 0) return 0;
    const p = Math.max(1, Math.min(period, data.length));
    const slice = data.slice(-p);
    const sum = slice.reduce((s, v) => s + Number(v || 0), 0);
    return sum / slice.length;
  }

  forecastSales(history = []) {
    const ma3 = this.movingAverage(history, 3);
    const ma7 = this.movingAverage(history, 7);
    const trend = ma7 === 0 ? 1 : Math.max(0.85, Math.min(1.25, ma3 / ma7));
    const base = ma3 || ma7 || (history[history.length - 1] || 0);
    const forecast = Math.round(base * trend * 1.12);
    return Math.max(0, forecast);
  }

  forecastLeads(history = []) {
    const ma5 = this.movingAverage(history, 5);
    const ma15 = this.movingAverage(history, 15);
    const trend = ma15 === 0 ? 1 : Math.max(0.85, Math.min(1.22, ma5 / ma15));
    const base = ma5 || ma15 || (history[history.length - 1] || 0);
    const forecast = Math.round(base * trend * 1.08);
    return Math.max(0, forecast);
  }

  detectChurn(leadsHistory = [], salesHistory = []) {
    const latestSales = Number(salesHistory[salesHistory.length - 1] || 0);
    const prevSales = Number(salesHistory[salesHistory.length - 2] || latestSales);
    const salesDrop = prevSales === 0 ? 0 : (prevSales - latestSales) / prevSales;

    const latestLeads = Number(leadsHistory[leadsHistory.length - 1] || 0);
    const conversion = latestLeads === 0 ? 0 : (latestSales / latestLeads);

    if (conversion < 0.02 || salesDrop > 0.25) return "tinggi";
    if (conversion < 0.05 || salesDrop > 0.10) return "sedang";
    return "rendah";
  }
}

module.exports = CRMPredictor;
