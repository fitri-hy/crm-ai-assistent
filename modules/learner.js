const fs = require("fs");
const path = require("path");

class CRMLearner {
  constructor(opts = {}) {
    this.memoryPath = opts.memoryPath || path.join(__dirname, "memory.json");
    this.maxHistory = opts.maxHistory || 90;

    if (!fs.existsSync(this.memoryPath)) {
      const initial = {
        meta: { createdAt: new Date().toISOString(), updatedAt: null },
        history: { sales: [], leads: [], price: [] },
        trend: { sales: "stagnan", leads: "stagnan" },
        stats: { avgPrice: 0, avgLeads: 0, avgSales: 0, conversionRate: 0 },
        anomaly: { salesDrop: false, leadsDrop: false }
      };
      fs.writeFileSync(this.memoryPath, JSON.stringify(initial, null, 2));
    }
  }

  load() {
    return JSON.parse(fs.readFileSync(this.memoryPath, "utf8"));
  }

  save(mem) {
    mem.meta.updatedAt = new Date().toISOString();
    fs.writeFileSync(this.memoryPath, JSON.stringify(mem, null, 2));
  }

  // AUTO DETECTOR 
  _detectArray(obj) {
    return Object.values(obj).find((v) => Array.isArray(v)) || [];
  }

  _detectProducts(crm) {
    const arrays = Object.values(crm).filter(Array.isArray);

    for (const arr of arrays) {
      const sample = arr[0];
      if (!sample) continue;

      // price / unit_price / cost / more..
      if ("price" in sample || "unit_price" in sample || "cost" in sample) {
        return arr;
      }
    }
    return [];
  }

  // Detect sales objects
  _detectSales(crm) {
    const arrays = Object.values(crm).filter(Array.isArray);

    for (const arr of arrays) {
      const s = arr[0];
      if (!s) continue;

      // General patterns of sales data
      if (
        "total" in s ||
        "amount" in s ||
        "quantity" in s ||
        "qty" in s ||
        "totalItems" in s ||
        "totalQuantity" in s
      ) {
        return arr;
      }
    }
    return [];
  }

  // Detect leads
  _detectLeads(crm) {
    const arrays = Object.values(crm).filter(Array.isArray);

    for (const arr of arrays) {
      const l = arr[0];
      if (!l) continue;

      // name, email, status, source, company, more..
      if ("email" in l || "status" in l || "source" in l || "company" in l) {
        return arr;
      }
    }
    return [];
  }

  // ANOMALI
  _detectAnomaly(arr = []) {
    if (arr.length < 5) return false;
    const last = arr[arr.length - 1];
    const avg = arr.slice(0, -1).reduce((a, b) => a + b, 0) / (arr.length - 1);
    return last < avg * 0.6;
  }

  // LEARNING AUTO MODE
  learn(crm = {}) {
    const mem = this.load();
    const products = this._detectProducts(crm);
    const salesArr = this._detectSales(crm);
    const leadsArr = this._detectLeads(crm);

    // TOTAL SALES
    let totalSales = 0;
    for (const s of salesArr) {
      const val =
        s.total ??
        s.amount ??
        s.qty ??
        s.quantity ??
        s.totalItems ??
        s.totalQuantity ??
        0;

      totalSales += Number(val);
    }

    // TOTAL LEADS
    const totalLeads = leadsArr.length || 0;

    // AVG PRICE
    let avgPrice = 0;
    if (products.length > 0) {
      const sum = products.reduce(
        (t, p) =>
          t +
          Number(
            p.price ??
            p.unit_price ??
            p.cost ??
            0
          ),
        0
      );
      avgPrice = sum / products.length;
    }

    // Save to history
    mem.history.sales.push(totalSales);
    mem.history.leads.push(totalLeads);
    mem.history.price.push(Math.round(avgPrice));

    if (mem.history.sales.length > this.maxHistory) mem.history.sales.shift();
    if (mem.history.leads.length > this.maxHistory) mem.history.leads.shift();
    if (mem.history.price.length > this.maxHistory) mem.history.price.shift();

    // Stats
    const avgSales =
      mem.history.sales.reduce((a, b) => a + b, 0) / mem.history.sales.length;

    const avgLeads =
      mem.history.leads.reduce((a, b) => a + b, 0) / mem.history.leads.length;

    mem.stats = {
      avgPrice: Math.round(avgPrice),
      avgSales: Number(avgSales.toFixed(2)),
      avgLeads: Number(avgLeads.toFixed(2)),
      conversionRate: avgLeads === 0 ? 0 : Number((avgSales / avgLeads).toFixed(4))
    };

    // Trend
    const lastS = mem.history.sales[mem.history.sales.length - 1];
    const prevS = mem.history.sales[mem.history.sales.length - 2] ?? lastS;

    mem.trend.sales = lastS > prevS ? "naik" : lastS < prevS ? "turun" : "stabil";

    const lastL = mem.history.leads[mem.history.leads.length - 1];
    const prevL = mem.history.leads[mem.history.leads.length - 2] ?? lastL;

    mem.trend.leads = lastL > prevL ? "naik" : lastL < prevL ? "turun" : "stabil";

    // Anomaly
    mem.anomaly = {
      salesDrop: this._detectAnomaly(mem.history.sales),
      leadsDrop: this._detectAnomaly(mem.history.leads),
    };

    this.save(mem);
    return mem;
  }
}

module.exports = CRMLearner;
