let Anthropic;
try {
  Anthropic = require("@anthropic-ai/sdk");
} catch (e) {
  Anthropic = null;
}

module.exports = class ClaudeProvider {
  constructor(apiKey, opts = {}) {
    if (!Anthropic) throw new Error("Anthropic SDK (@anthropic-ai/sdk) not installed.");
    this.client = new Anthropic({ apiKey });
    this.model = (opts.model) || "claude-3.5-mini";
  }

  async chat(prompt, userMessage) {
    const content = `${prompt}\n\nUser: ${userMessage}`;
    const r = await this.client.responses.create({
      model: this.model,
      input: content,
      max_tokens_to_sample: 700
    });
    return r?.output?.[0]?.content?.[0]?.text || "";
  }
};
