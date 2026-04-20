const a = document.createElement("a");

export function resolveURL(url: string): string {
  a.href = url;
  return a.href;
}
