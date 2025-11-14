module.exports = {
  enabled: true,
  autoRetrain: true,
  retrainInterval: process.env.RETRAIN_INTERVAL || "daily", // daily | weekly | monthly
  minDataToRetrain: Number(process.env.MIN_DATA_TO_RETRAIN || 50),
  monitorNewData: true,
  vectorStore: process.env.VECTOR_STORE || "local", // local | pinecone | milvus

  local: {
    path: process.env.LOCAL_VECTOR_PATH || "./storage/vectors"
  },

  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || "",
    index: process.env.PINECONE_INDEX || "crm-ai"
  },

  milvus: {
    url: process.env.MILVUS_URL || "localhost:19530",
    collection: process.env.MILVUS_COLLECTION || "crm_ai_vectors"
  }
};
