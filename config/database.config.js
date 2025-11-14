module.exports = {
  // global active/inactive database
  enabled: true,

  sources: [

    // ========== MySQL MULTI TABLE ==========
    {
      type: "mysql",
      connection: {
        host: "localhost",
        user: "root",
        password: "",
        database: "crm_db"
      },
      tables: {
        customers: "customers",
        leads: "leads",
        sales: "sales",
        products: "products"
      }
    },

    // ========== POSTGRES MULTI TABLE ==========
    {
      type: "postgres",
      connection: {
        host: "localhost",
        user: "postgres",
        password: "",
        database: "marketing"
      },
      tables: {
        funnel: "funnels",
        traffic: "traffic_sources"
      }
    },

    // ========== MONGO MULTI COLLECTION ==========
    {
      type: "mongo",
      connection: {
        url: "mongodb://localhost:27017/crm_logs"
      },
      collections: {
        logs: "activity_logs",
        sessions: "user_sessions"
      }
    },

    // ========== API MULTI ENDPOINT ==========
    {
      type: "api",
      baseURL: "https://dummyjson.com",
      endpoints: {
        products: "/products",
        carts: "/carts",
        users: "/users"
      }
    }
  ]
};
