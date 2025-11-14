let GoogleGenAI;
try {
  GoogleGenAI = require("@google/genai").GoogleGenAI;
} catch (e) {
  GoogleGenAI = null;
}

module.exports = class GeminiProvider {
  constructor(apiKey, opts = {}) {
    if (!GoogleGenAI) {
      throw new Error("Gemini SDK (@google/genai) not installed.");
    }

    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    if (!this.apiKey) throw new Error("Gemini API Key missing.");

    this.client = new GoogleGenAI({ apiKey: this.apiKey });
    this.model = opts.model || "gemini-2.5-flash";
  }

  async chat(systemPrompt, userMessage) {
    try {
      const prompt = `${systemPrompt}\n\nUser: ${userMessage}`;

      const result = await this.client.models.generateContent({
        model: this.model,
        contents: prompt
      });

      return result.text || "";
    } catch (err) {
      console.error("[GeminiProvider] ERROR:", err.message);
      return "Maaf, terdapat masalah pada AI Provider Gemini.";
    }
  }
};
