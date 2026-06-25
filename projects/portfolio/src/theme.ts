import { signal } from "@preact/signals";

export interface Theme {
  name: string;
  label: string;
  circleColor: string;
}

export const themes: Theme[] = [
  { name: "dark", label: "Dark", circleColor: "#0f0f1a" },
  { name: "light", label: "Light", circleColor: "#3DB8A9" },
];

function getStored(): string {
  try {
    return localStorage.getItem("theme") || "dark";
  } catch {
    return "dark";
  }
}

function findTheme(name: string): Theme {
  return themes.find((t) => t.name === name) || themes[0];
}

const initial = getStored();
document.documentElement.dataset.theme = initial;

export const currentTheme = signal<Theme>(findTheme(initial));

export function setTheme(name: string) {
  const theme = findTheme(name);
  currentTheme.value = theme;
  document.documentElement.dataset.theme = theme.name;
  try {
    localStorage.setItem("theme", theme.name);
  } catch { }
}

export function applyInitialTheme() {
  const name = getStored();
  document.documentElement.dataset.theme = name;
}
