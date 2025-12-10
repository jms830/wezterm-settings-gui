import type { ColorScheme } from "@/lib/schema/types";

// Extended WezTerm color schemes collection
// These are popular themes from WezTerm's built-in collection
// Full list: https://wezfurlong.org/wezterm/colorschemes/index.html

export const extendedThemes: ColorScheme[] = [
  // Ayu themes
  {
    name: "Ayu Dark",
    foreground: "#e6e1cf",
    background: "#0f1419",
    cursor_bg: "#e6e1cf",
    cursor_fg: "#0f1419",
    cursor_border: "#e6e1cf",
    selection_bg: "#253340",
    selection_fg: "#e6e1cf",
    ansi: ["#000000", "#ff3333", "#b8cc52", "#e7c547", "#36a3d9", "#f07178", "#95e6cb", "#ffffff"],
    brights: ["#323232", "#ff6565", "#eafe84", "#fff779", "#68d5ff", "#ffa3aa", "#c7fffd", "#ffffff"],
  },
  {
    name: "Ayu Light",
    foreground: "#5c6166",
    background: "#fafafa",
    cursor_bg: "#5c6166",
    cursor_fg: "#fafafa",
    cursor_border: "#5c6166",
    selection_bg: "#d1e4f4",
    selection_fg: "#5c6166",
    ansi: ["#000000", "#f07171", "#86b300", "#f2ae49", "#399ee6", "#a37acc", "#4cbf99", "#ffffff"],
    brights: ["#323232", "#ff3333", "#b8cc52", "#e7c547", "#36a3d9", "#f07178", "#95e6cb", "#ffffff"],
  },
  // Material themes
  {
    name: "Material",
    foreground: "#eeffff",
    background: "#263238",
    cursor_bg: "#ffcc00",
    cursor_fg: "#263238",
    cursor_border: "#ffcc00",
    selection_bg: "#314549",
    selection_fg: "#eeffff",
    ansi: ["#000000", "#e53935", "#91b859", "#ffb62c", "#6182b8", "#ff5370", "#39adb5", "#ffffff"],
    brights: ["#4a4a4a", "#ff5370", "#c3e88d", "#ffcb6b", "#82aaff", "#f07178", "#89ddff", "#ffffff"],
  },
  {
    name: "Material Darker",
    foreground: "#eeffff",
    background: "#212121",
    cursor_bg: "#ffcc00",
    cursor_fg: "#212121",
    cursor_border: "#ffcc00",
    selection_bg: "#303030",
    selection_fg: "#eeffff",
    ansi: ["#000000", "#e53935", "#91b859", "#ffb62c", "#6182b8", "#ff5370", "#39adb5", "#ffffff"],
    brights: ["#4a4a4a", "#ff5370", "#c3e88d", "#ffcb6b", "#82aaff", "#f07178", "#89ddff", "#ffffff"],
  },
  // Everforest
  {
    name: "Everforest Dark",
    foreground: "#d3c6aa",
    background: "#2d353b",
    cursor_bg: "#d3c6aa",
    cursor_fg: "#2d353b",
    cursor_border: "#d3c6aa",
    selection_bg: "#543a48",
    selection_fg: "#d3c6aa",
    ansi: ["#4b565c", "#e67e80", "#a7c080", "#dbbc7f", "#7fbbb3", "#d699b6", "#83c092", "#d3c6aa"],
    brights: ["#4b565c", "#e67e80", "#a7c080", "#dbbc7f", "#7fbbb3", "#d699b6", "#83c092", "#d3c6aa"],
  },
  {
    name: "Everforest Light",
    foreground: "#5c6a72",
    background: "#fdf6e3",
    cursor_bg: "#5c6a72",
    cursor_fg: "#fdf6e3",
    cursor_border: "#5c6a72",
    selection_bg: "#e0dcc7",
    selection_fg: "#5c6a72",
    ansi: ["#5c6a72", "#f85552", "#8da101", "#dfa000", "#3a94c5", "#df69ba", "#35a77c", "#dfddc8"],
    brights: ["#5c6a72", "#f85552", "#8da101", "#dfa000", "#3a94c5", "#df69ba", "#35a77c", "#dfddc8"],
  },
  // Nightfox
  {
    name: "Nightfox",
    foreground: "#cdcecf",
    background: "#192330",
    cursor_bg: "#cdcecf",
    cursor_fg: "#192330",
    cursor_border: "#cdcecf",
    selection_bg: "#2b3b51",
    selection_fg: "#cdcecf",
    ansi: ["#393b44", "#c94f6d", "#81b29a", "#dbc074", "#719cd6", "#9d79d6", "#63cdcf", "#dfdfe0"],
    brights: ["#575860", "#d16983", "#8ebaa4", "#e0c989", "#86abdc", "#baa1e2", "#7ad5d6", "#e4e4e5"],
  },
  {
    name: "Dawnfox",
    foreground: "#575279",
    background: "#faf4ed",
    cursor_bg: "#575279",
    cursor_fg: "#faf4ed",
    cursor_border: "#575279",
    selection_bg: "#d0d8d8",
    selection_fg: "#575279",
    ansi: ["#575279", "#b4637a", "#618774", "#ea9d34", "#286983", "#907aa9", "#56949f", "#e5e9f0"],
    brights: ["#5f5695", "#c26d85", "#629f81", "#eea846", "#2d81a3", "#9b87b6", "#5ca7b4", "#eef1f8"],
  },
  // Horizon
  {
    name: "Horizon Dark",
    foreground: "#e0e0e0",
    background: "#1c1e26",
    cursor_bg: "#e95678",
    cursor_fg: "#1c1e26",
    cursor_border: "#e95678",
    selection_bg: "#2e303e",
    selection_fg: "#e0e0e0",
    ansi: ["#16161c", "#e95678", "#29d398", "#fab795", "#26bbd9", "#ee64ae", "#59e3e3", "#d5d8da"],
    brights: ["#5b5858", "#ec6a88", "#3fdaa4", "#fbc3a7", "#3fc6de", "#f075b7", "#6be6e6", "#d5d8da"],
  },
  // Palenight
  {
    name: "Palenight",
    foreground: "#bfc7d5",
    background: "#292d3e",
    cursor_bg: "#ffcc00",
    cursor_fg: "#292d3e",
    cursor_border: "#ffcc00",
    selection_bg: "#434758",
    selection_fg: "#bfc7d5",
    ansi: ["#292d3e", "#f07178", "#c3e88d", "#ffcb6b", "#82aaff", "#c792ea", "#89ddff", "#d0d0d0"],
    brights: ["#434758", "#ff8b92", "#ddffa7", "#ffe585", "#9cc4ff", "#e1acff", "#a3f7ff", "#ffffff"],
  },
  // Snazzy
  {
    name: "Snazzy",
    foreground: "#eff0eb",
    background: "#282a36",
    cursor_bg: "#97979b",
    cursor_fg: "#282a36",
    cursor_border: "#97979b",
    selection_bg: "#3e4452",
    selection_fg: "#eff0eb",
    ansi: ["#282a36", "#ff5c57", "#5af78e", "#f3f99d", "#57c7ff", "#ff6ac1", "#9aedfe", "#f1f1f0"],
    brights: ["#686868", "#ff5c57", "#5af78e", "#f3f99d", "#57c7ff", "#ff6ac1", "#9aedfe", "#eff0eb"],
  },
  // Synthwave
  {
    name: "Synthwave 84",
    foreground: "#ffffff",
    background: "#262335",
    cursor_bg: "#ff7edb",
    cursor_fg: "#262335",
    cursor_border: "#ff7edb",
    selection_bg: "#463465",
    selection_fg: "#ffffff",
    ansi: ["#000000", "#fe4450", "#72f1b8", "#fede5d", "#03edf9", "#ff7edb", "#03edf9", "#ffffff"],
    brights: ["#495495", "#fe4450", "#72f1b8", "#f97e72", "#03edf9", "#ff7edb", "#03edf9", "#ffffff"],
  },
  // Atom One themes
  {
    name: "Atom One Light",
    foreground: "#383a42",
    background: "#fafafa",
    cursor_bg: "#383a42",
    cursor_fg: "#fafafa",
    cursor_border: "#383a42",
    selection_bg: "#e5e5e6",
    selection_fg: "#383a42",
    ansi: ["#000000", "#e45649", "#50a14f", "#c18401", "#4078f2", "#a626a4", "#0184bc", "#383a42"],
    brights: ["#a0a1a7", "#e06c75", "#98c379", "#d19a66", "#61afef", "#c678dd", "#56b6c2", "#ffffff"],
  },
  // Cobalt2
  {
    name: "Cobalt2",
    foreground: "#ffffff",
    background: "#193549",
    cursor_bg: "#ffc600",
    cursor_fg: "#193549",
    cursor_border: "#ffc600",
    selection_bg: "#0050a4",
    selection_fg: "#ffffff",
    ansi: ["#000000", "#ff0000", "#38de21", "#ffe50a", "#1460d2", "#ff005d", "#00bbbb", "#bbbbbb"],
    brights: ["#555555", "#f40e17", "#3bd01d", "#edc809", "#5555ff", "#ff55ff", "#6ae3fa", "#ffffff"],
  },
  // Night Owl
  {
    name: "Night Owl",
    foreground: "#d6deeb",
    background: "#011627",
    cursor_bg: "#80a4c2",
    cursor_fg: "#011627",
    cursor_border: "#80a4c2",
    selection_bg: "#1d3b53",
    selection_fg: "#d6deeb",
    ansi: ["#011627", "#ef5350", "#22da6e", "#c5e478", "#82aaff", "#c792ea", "#21c7a8", "#ffffff"],
    brights: ["#575656", "#ef5350", "#22da6e", "#ffeb95", "#82aaff", "#c792ea", "#7fdbca", "#ffffff"],
  },
  // Poimandres
  {
    name: "Poimandres",
    foreground: "#e4f0fb",
    background: "#1b1e28",
    cursor_bg: "#a6accd",
    cursor_fg: "#1b1e28",
    cursor_border: "#a6accd",
    selection_bg: "#303340",
    selection_fg: "#e4f0fb",
    ansi: ["#1b1e28", "#d0679d", "#5de4c7", "#fffac2", "#89ddff", "#fcc5e9", "#add7ff", "#ffffff"],
    brights: ["#506477", "#d0679d", "#5de4c7", "#fffac2", "#89ddff", "#fcc5e9", "#add7ff", "#ffffff"],
  },
  // Mellow
  {
    name: "Mellow",
    foreground: "#c9c7cd",
    background: "#161617",
    cursor_bg: "#c9c7cd",
    cursor_fg: "#161617",
    cursor_border: "#c9c7cd",
    selection_bg: "#27272a",
    selection_fg: "#c9c7cd",
    ansi: ["#27272a", "#f5a191", "#90b99f", "#e6b99d", "#aca1cf", "#e29eca", "#ea83a5", "#c1c0d4"],
    brights: ["#353539", "#ffae9f", "#9dc6ac", "#f0c5a9", "#b9aeda", "#ecaad6", "#f591b2", "#cac9dd"],
  },
  // Moonlight
  {
    name: "Moonlight II",
    foreground: "#c8d3f5",
    background: "#222436",
    cursor_bg: "#c8d3f5",
    cursor_fg: "#222436",
    cursor_border: "#c8d3f5",
    selection_bg: "#2d3f76",
    selection_fg: "#c8d3f5",
    ansi: ["#191a2a", "#ff757f", "#c3e88d", "#ffc777", "#82aaff", "#c099ff", "#86e1fc", "#c8d3f5"],
    brights: ["#828bb8", "#ff757f", "#c3e88d", "#ffc777", "#82aaff", "#c099ff", "#86e1fc", "#c8d3f5"],
  },
  // Iceberg
  {
    name: "Iceberg Dark",
    foreground: "#c6c8d1",
    background: "#161821",
    cursor_bg: "#c6c8d1",
    cursor_fg: "#161821",
    cursor_border: "#c6c8d1",
    selection_bg: "#1e2132",
    selection_fg: "#c6c8d1",
    ansi: ["#161821", "#e27878", "#b4be82", "#e2a478", "#84a0c6", "#a093c7", "#89b8c2", "#c6c8d1"],
    brights: ["#6b7089", "#e98989", "#c0ca8e", "#e9b189", "#91acd1", "#ada0d3", "#95c4ce", "#d2d4de"],
  },
  {
    name: "Iceberg Light",
    foreground: "#33374c",
    background: "#e8e9ec",
    cursor_bg: "#33374c",
    cursor_fg: "#e8e9ec",
    cursor_border: "#33374c",
    selection_bg: "#c9cdd7",
    selection_fg: "#33374c",
    ansi: ["#dcdfe7", "#cc517a", "#668e3d", "#c57339", "#2d539e", "#7759b4", "#3f83a6", "#33374c"],
    brights: ["#8389a3", "#cc3768", "#598030", "#b6662d", "#22478e", "#6845ad", "#327698", "#262a3f"],
  },
  // Zenburn
  {
    name: "Zenburn",
    foreground: "#dcdccc",
    background: "#3f3f3f",
    cursor_bg: "#dcdccc",
    cursor_fg: "#3f3f3f",
    cursor_border: "#dcdccc",
    selection_bg: "#2b2b2b",
    selection_fg: "#dcdccc",
    ansi: ["#3f3f3f", "#cc9393", "#7f9f7f", "#e3ceab", "#dfaf8f", "#cc9393", "#8cd0d3", "#dcdccc"],
    brights: ["#3f3f3f", "#dca3a3", "#bfebbf", "#f0dfaf", "#f0dfaf", "#dc8cc3", "#93e0e3", "#ffffff"],
  },
  // Afterglow
  {
    name: "Afterglow",
    foreground: "#d0d0d0",
    background: "#212121",
    cursor_bg: "#d0d0d0",
    cursor_fg: "#212121",
    cursor_border: "#d0d0d0",
    selection_bg: "#5a5a5a",
    selection_fg: "#d0d0d0",
    ansi: ["#151515", "#ac4142", "#7e8d50", "#e5b566", "#6c99ba", "#9e4e85", "#7dd5cf", "#d0d0d0"],
    brights: ["#505050", "#ac4142", "#7e8d50", "#e5b566", "#6c99ba", "#9e4e85", "#7dd5cf", "#f5f5f5"],
  },
  // Monokai variants
  {
    name: "Monokai Soda",
    foreground: "#c4c5b5",
    background: "#1a1a1a",
    cursor_bg: "#f6f7ec",
    cursor_fg: "#1a1a1a",
    cursor_border: "#f6f7ec",
    selection_bg: "#343434",
    selection_fg: "#c4c5b5",
    ansi: ["#1a1a1a", "#f4005f", "#98e024", "#fd971f", "#9d65ff", "#f4005f", "#58d1eb", "#c4c5b5"],
    brights: ["#625e4c", "#f4005f", "#98e024", "#e0d561", "#9d65ff", "#f4005f", "#58d1eb", "#f6f6ef"],
  },
  // Wombat
  {
    name: "Wombat",
    foreground: "#dedacf",
    background: "#171717",
    cursor_bg: "#dedacf",
    cursor_fg: "#171717",
    cursor_border: "#dedacf",
    selection_bg: "#453e41",
    selection_fg: "#dedacf",
    ansi: ["#000000", "#ff615a", "#b1e969", "#ebd99c", "#5da9f6", "#e86aff", "#82fff7", "#dedacf"],
    brights: ["#313131", "#f58c80", "#ddf88f", "#eee5b2", "#a5c7ff", "#ddaaff", "#b7fff9", "#ffffff"],
  },
];

// Get all available themes (curated + extended)
export function getAllThemes(): ColorScheme[] {
  // Import curated schemes - this avoids circular dependency
  // by having curated schemes in separate file
  return extendedThemes;
}

// Search themes by name
export function searchThemes(query: string, themes: ColorScheme[]): ColorScheme[] {
  const lowerQuery = query.toLowerCase();
  return themes.filter(theme => 
    theme.name.toLowerCase().includes(lowerQuery)
  );
}

// Categorize themes by type (dark/light)
export function categorizeThemes(themes: ColorScheme[]): { dark: ColorScheme[], light: ColorScheme[] } {
  return themes.reduce((acc, theme) => {
    // Simple heuristic: check if background is light or dark
    const bg = theme.background;
    const isLight = isLightColor(bg);
    if (isLight) {
      acc.light.push(theme);
    } else {
      acc.dark.push(theme);
    }
    return acc;
  }, { dark: [] as ColorScheme[], light: [] as ColorScheme[] });
}

// Helper to determine if a color is light
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
