const SuperCRMAI = require("./modules");
const axios = require("axios");
require("dotenv").config();
const readline = require("readline");

// INISIALISASI AI ENGINE
const ai = new SuperCRMAI({
  companyName: "Perusahaan Dummy",
  aiProvider: "gemini",
  apiKey:
    process.env.GEMINI_API_KEY || "AIzaSyBPUSb_vhlsa_aQKsZre3wxDAYCjC8pI6c",

  useDatabase: false, // doesn't use a database

  // AUTOMATIC MAP DATA
  dataMap: {
    // PRODUCT CATALOG
    products: async () => {
      const r = await axios.get("https://dummyjson.com/products");
      return r.data.products.map((p) => ({
        id: p.id,
        name: p.title,
        price: p.price,
        category: p.category,
        rating: p.rating,
        stock: p.stock,
        brand: p.brand,
        tags: p.tags,
        discount: p.discountPercentage,
      }));
    },

    // LEADS
    leads: async () => {
      const r = await axios.get("https://jsonplaceholder.typicode.com/users");
      return r.data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        company: u.company?.name,
        status: ["new", "contacted", "qualified", "lost"][
          Math.floor(Math.random() * 4)
        ],
        source: ["Ads", "Google", "Facebook", "Referral"][
          Math.floor(Math.random() * 4)
        ],
      }));
    },

    // SALES DATA
    sales: async () => {
      const r = await axios.get("https://dummyjson.com/carts");
      return r.data.carts.map((c) => ({
        id: c.id,
        userId: c.userId,
        totalItems: c.totalQuantity,
        total: c.total,
        discountedTotal: c.discountedTotal,
        products: c.products.map((p) => ({
          id: p.id,
          name: p.title,
          price: p.price,
          quantity: p.quantity,
          total: p.total,
          discountedTotal: p.discountedTotal,
        })),
      }));
    },

    // CUSTOMERS
    customers: async () => {
      const r = await axios.get("https://jsonplaceholder.typicode.com/users");
      return r.data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        city: u.address?.city,
        phone: u.phone,
      }));
    },

    // SUPPORT / TICKETS
    tickets: async () => {
      const r = await axios.get("https://jsonplaceholder.typicode.com/comments");
      return r.data.slice(0, 50).map((t) => ({
        id: t.id,
        customerName: t.name,
        issue: t.body,
        status: ["open", "closed", "pending"][Math.floor(Math.random() * 3)],
      }));
    },

    // CAMPAIGNS / ADS
    campaigns: async () => {
      const r = await axios.get("https://jsonplaceholder.typicode.com/albums");
      return r.data.slice(0, 20).map((c) => ({
        id: c.id,
        name: c.title,
        impressions: Math.floor(Math.random() * 5000),
        clicks: Math.floor(Math.random() * 500),
        ctr: Math.random().toFixed(2),
        budget: Math.floor(Math.random() * 1000000),
      }));
    },

    // WEB TRAFFIC
    traffic: () => ({
      google: 1200,
      facebook: 800,
      instagram: 600,
      tiktok: 400,
      direct: 300,
    }),

    // TEAM PERFORMANCE
    team: () => [
      { name: "Andi", dealsClosed: 12, revenue: 24000000 },
      { name: "Budi", dealsClosed: 8, revenue: 17500000 },
      { name: "Cindy", dealsClosed: 14, revenue: 26000000 },
      { name: "Dewi", dealsClosed: 10, revenue: 22000000 },
      { name: "Eko", dealsClosed: 7, revenue: 16000000 },
    ],

    // FINANCIAL SUMMARY
    finance: () => ({
      monthlyRevenue: 52000000,
      monthlyExpense: 18000000,
      netProfit: 34000000,
    }),

    // MARKET TREND / COMPETITOR
    market: () => [
      { category: "Smartphone", trend: "naik", competitorPrice: 3500000 },
      { category: "Laptop", trend: "stabil", competitorPrice: 7500000 },
      { category: "Tablet", trend: "turun", competitorPrice: 2500000 },
    ],
  },
});

// CHATBOT MODE
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🤖 CRM AI Assistant siap! Ketik pertanyaan Anda...\n");

const ask = () => {
  rl.question("Anda: ", async (q) => {
    if (q.trim().toLowerCase() === "exit") {
      console.log("👋 Chat ditutup.");
      rl.close();
      return;
    }

    const answer = await ai.chat(q);
    console.log("\nAI:", answer, "\n");

    ask();
  });
};

ask();
