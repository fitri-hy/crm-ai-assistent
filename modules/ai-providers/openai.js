const OpenAI = require("openai");

module.exports = class OpenAIProvider {
  constructor(apiKey, opts = {}) {
    this.client = new OpenAI({ apiKey });
    this.model = (opts.model) || "gpt-5-mini";
  }

  async chat(prompt, userMessage) {
    const res = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 700
    });

    return res?.choices?.[0]?.message?.content || "";
  }
};
