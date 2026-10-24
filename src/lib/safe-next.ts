/** Returns the value only if it's a same-site relative path; otherwise undefined. */
export function safeNextClient(next: unknown): string | undefined {
  if (typeof next !== "string") return undefined;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return undefined;
  return next;
}
