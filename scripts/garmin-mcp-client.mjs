import { spawn } from "node:child_process";
import { once } from "node:events";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseMcpBody(text) {
  try { return JSON.parse(text); } catch {}
  const messages = text.split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .map((line) => { try { return JSON.parse(line); } catch { return null; } })
    .filter(Boolean);
  if (!messages.length) throw new Error("Garmin MCP returned an unreadable response.");
  return messages.at(-1);
}

export class GarminMcpClient {
  constructor({ uvxPath, port = "8765", enabledTools }) {
    this.port = String(port);
    this.url = `http://127.0.0.1:${this.port}/mcp`;
    this.nextId = 2;
    this.sessionId = null;
    this.stderr = "";
    this.server = spawn(uvxPath, [
      "--python", "3.12",
      "--from", "git+https://github.com/Taxuspt/garmin_mcp",
      "garmin-mcp",
    ], {
      env: {
        ...process.env,
        GARMIN_MCP_TRANSPORT: "streamable-http",
        GARMIN_MCP_HOST: "127.0.0.1",
        GARMIN_MCP_PORT: this.port,
        GARMIN_ENABLED_TOOLS: enabledTools.join(","),
      },
      stdio: ["ignore", "ignore", "pipe"],
      windowsHide: true,
    });
    this.server.stderr.on("data", (chunk) => {
      this.stderr = `${this.stderr}${chunk}`.slice(-5000);
    });
  }

  async start() {
    for (let attempt = 0; attempt < 120; attempt += 1) {
      if (this.server.exitCode !== null) throw new Error(`Garmin MCP stopped early. ${this.stderr}`);
      try {
        const response = await fetch(`http://127.0.0.1:${this.port}/healthz`);
        if (response.ok) break;
      } catch {}
      await delay(500);
    }
    const initialized = await this.post({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "ap-garmin-weekly-review", version: "1.0.0" } },
    });
    this.sessionId = initialized.sessionId;
    await this.post({ jsonrpc: "2.0", method: "notifications/initialized" });
  }

  async post(body) {
    const headers = { "content-type": "application/json", accept: "application/json, text/event-stream" };
    if (this.sessionId) headers["mcp-session-id"] = this.sessionId;
    const response = await fetch(this.url, { method: "POST", headers, body: JSON.stringify(body) });
    const text = await response.text();
    if (!response.ok) throw new Error(`Garmin MCP returned ${response.status}: ${text.slice(0, 500)}`);
    return { data: text.trim() ? parseMcpBody(text) : null, sessionId: response.headers.get("mcp-session-id") || this.sessionId };
  }

  async call(name, args = {}) {
    const id = this.nextId++;
    const response = await this.post({ jsonrpc: "2.0", id, method: "tools/call", params: { name, arguments: args } });
    if (response.data?.error) throw new Error(`${name}: ${response.data.error.message || "tool error"}`);
    const blocks = response.data?.result?.content || [];
    const text = blocks.filter((item) => item.type === "text").map((item) => item.text).join("\n");
    if (!text) return null;
    if (/^(No |Error |Invalid )/i.test(text)) return { unavailable: text };
    try { return JSON.parse(text); } catch { return text; }
  }

  async stop() {
    if (this.server.exitCode === null) {
      this.server.kill();
      await Promise.race([once(this.server, "exit"), delay(3000)]);
    }
  }
}

export { delay };
