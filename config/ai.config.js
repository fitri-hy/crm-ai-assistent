module.exports = {
  provider: process.env.AI_PROVIDER || "openai", // openai | gemini | claude | custom

  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    baseURL: "https://api.openai.com/v1",
    model: "gpt-5-mini"
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    baseURL: "https://generativelanguage.googleapis.com/v1beta",
    model: "gemini-1.5-flash"
  },

  claude: {
    apiKey: process.env.CLAUDE_API_KEY || "",
    baseURL: "https://api.anthropic.com/v1",
    model: "claude-3-haiku"
  },

  custom: {
    apiKey: "",
    baseURL: "",
    model: ""
  }
};
