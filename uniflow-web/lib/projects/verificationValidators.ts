export function isValidHttpOrHttpsUrl(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidGithubRepoUrl(input: string): boolean {
  const trimmed = input.trim();
  if (!isValidHttpOrHttpsUrl(trimmed)) return false;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (host !== "github.com" && host !== "www.github.com") return false;

    const pathParts = parsed.pathname
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);

    // Require at least /owner/repo
    return pathParts.length >= 2;
  } catch {
    return false;
  }
}
