import GithubDark from "monaco-themes/themes/GitHub Dark.json";
import GithubLight from "monaco-themes/themes/GitHub Light.json";
import * as monaco from "monaco-editor";
import { getHighlightColours } from "../highlightColours";

export async function initThemes() {
  const {
    highlight,
    highlightDark,
    highlightDarkest,
    highlightLight,
    highlightLightest,
  } = getHighlightColours();
  monaco.editor.defineTheme("AlchemizeDark", {
    base: "vs-dark",
    inherit: true,
    rules: GithubDark.rules,
    colors: {
      "editor.foreground": "#f6f8fa",
      "editor.background": "#111112ff",
      "editor.selectionBackground": highlightDarkest,
      "editor.inactiveSelectionBackground": "#444d56",
      "editor.lineHighlightBackground": "#24292e",
      "editorCursor.foreground": "#ffffff",
      "editorWhitespace.foreground": "#6a737d",
      "editorIndentGuide.background": "#6a737d",
      "editorIndentGuide.activeBackground": "#f6f8fa",
      "editor.selectionHighlightBorder": "#444d56",
      "minimap.background": "#131313",
      "scrollbarSlider.background": highlightDarkest,
      "scrollbarSlider.hoverBackground": highlightDark,
      "scrollbarSlider.activeBackground": highlight,
    },
  });
  monaco.editor.defineTheme("AlchemizeLight", {
    base: "vs",
    inherit: true,
    rules: GithubLight.rules,
    colors: {
      "editor.foreground": "#222222",
      "editor.background": "#fffffe",
      "editor.selectionBackground": highlightLightest,
      "minimap.background": "#f1f1f1",
      "scrollbarSlider.background": highlightLightest,
      "scrollbarSlider.hoverBackground": highlightDark,
      "scrollbarSlider.activeBackground": highlight,
    },
  });
}
