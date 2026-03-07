import type { AgentToolResult, ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";

const BASE_URL = process.env.PI_MONO_CORPUS_BASE_URL ?? "https://joelclaw.com";
const USER_AGENT = "contributing-to-pi-mono/0.1.0";

type ToolResult = AgentToolResult<Record<string, unknown> | undefined>;

function asText(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function buildError(message: string): ToolResult {
  return {
    content: [{ type: "text", text: message }],
    details: { error: message },
  };
}

function formatSearchResult(payload: any): string {
  const result = payload?.result;
  if (!result) return JSON.stringify(payload, null, 2);

  const hits = Array.isArray(result.hits) ? result.hits : [];
  const lines = [
    `query: ${result.query ?? ""}`,
    `collection: ${result.requestedCollection ?? "pi_mono_artifacts"}`,
    `hits: ${hits.length}`,
    "",
  ];

  if (hits.length === 0) {
    lines.push("No hits.");
    return lines.join("\n");
  }

  hits.forEach((hit: any, index: number) => {
    lines.push(`${index + 1}. ${hit.title ?? "untitled"}`);
    if (hit.type) lines.push(`   type: ${hit.type}`);
    if (hit.url) lines.push(`   url: ${hit.url}`);
    if (hit.snippet) lines.push(`   snippet: ${String(hit.snippet).replace(/\s+/g, " ").trim()}`);
    lines.push("");
  });

  return lines.join("\n").trim();
}

export default function registerPiMonoExtension(pi: ExtensionAPI) {
  pi.registerTool({
    name: "pi_mono_search",
    label: "pi-mono Corpus Search",
    description:
      "Search the public pi-mono maintainer corpus on joelclaw.com. Use before filing issues or PRs upstream.",
    parameters: Type.Object({
      q: Type.String({ description: "Search query" }),
      limit: Type.Optional(Type.Number({ description: "Max results (default 5)", minimum: 1, maximum: 10 })),
    }),
    async execute(_id, params) {
      const url = new URL("/api/search", BASE_URL);
      url.searchParams.set("q", params.q);
      url.searchParams.set("collection", "pi_mono_artifacts");
      url.searchParams.set("limit", String(params.limit ?? 5));

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": USER_AGENT,
        },
      }).catch((error) => null);

      if (!response) {
        return buildError(`Failed to reach ${url.toString()}`);
      }

      const text = await response.text();
      let payload: any = null;
      try {
        payload = JSON.parse(text);
      } catch {
        return buildError(`Search endpoint returned non-JSON:\n\n${text}`);
      }

      if (!response.ok || payload?.ok === false) {
        return buildError(asText(payload?.error?.message ?? text));
      }

      return {
        content: [{ type: "text", text: formatSearchResult(payload) }],
        details: payload,
      } satisfies ToolResult;
    },
  });

  pi.registerTool({
    name: "pi_mono_discovery",
    label: "pi-mono Corpus Discovery",
    description: "Fetch install and corpus discovery metadata from joelclaw.com/api/pi-mono.",
    parameters: Type.Object({}),
    async execute() {
      const url = new URL("/api/pi-mono", BASE_URL);
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": USER_AGENT,
        },
      }).catch((error) => null);

      if (!response) {
        return buildError(`Failed to reach ${url.toString()}`);
      }

      const text = await response.text();
      let payload: any = null;
      try {
        payload = JSON.parse(text);
      } catch {
        return buildError(`Discovery endpoint returned non-JSON:\n\n${text}`);
      }

      if (!response.ok || payload?.ok === false) {
        return buildError(asText(payload?.error?.message ?? text));
      }

      return {
        content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
        details: payload,
      } satisfies ToolResult;
    },
  });
}
