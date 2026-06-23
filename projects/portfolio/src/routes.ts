const BASE = import.meta.env.VITE_BASE_PATH || "/";

export function url(path: string): string {
  return `${BASE}${path.replace(/^\//, "")}`;
}
