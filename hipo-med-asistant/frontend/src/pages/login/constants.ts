// constants for login view

export const colorThemes = {
  purple: { gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", accent: "#9b5de5", secondary: "#00bbf9" },
  blue: { gradient: "linear-gradient(135deg, #0093E9 0%, #80D0C9 100%)", accent: "#0093E9", secondary: "#80D0C9" },
  pink: { gradient: "linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)", accent: "#FF6B9D", secondary: "#C44569" },
  green: { gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", accent: "#11998e", secondary: "#38ef7d" },
  orange: { gradient: "linear-gradient(135deg, #FF9A56 0%, #FF6B35 100%)", accent: "#FF9A56", secondary: "#FF6B35" },
  red: { gradient: "linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%)", accent: "#FF6B6B", secondary: "#C92A2A" },
  yellow: { gradient: "linear-gradient(135deg, #FFD93D 0%, #FFA502 100%)", accent: "#FFD93D", secondary: "#FFA502" },
  teal: { gradient: "linear-gradient(135deg, #20C997 0%, #0B7285 100%)", accent: "#20C997", secondary: "#0B7285" },
  indigo: { gradient: "linear-gradient(135deg, #5C7CFF 0%, #4C6FFF 100%)", accent: "#5C7CFF", secondary: "#4C6FFF" },
  cyan: { gradient: "linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)", accent: "#00D4FF", secondary: "#0099CC" }
} as const;

export type ColorThemeName = keyof typeof colorThemes;
