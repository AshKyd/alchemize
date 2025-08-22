import { useSignal } from "@preact/signals";
import { createContext } from "preact";
import { useEffect } from "preact/hooks";

function getTheme() {
  const theme = useSignal(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e) => {
      theme.value = e.matches ? "dark" : "light";
    };

    mediaQuery.addEventListener("change", handleThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  return theme;
}

export function getState() {
  return {
    theme: getTheme(),
    language: useSignal("text"),
    /** @type {import("@preact/signals").Signal<import("monaco-editor").editor.IStandaloneCodeEditor>} */
    editorRef: useSignal(),
  };
}

export const Registry = createContext({
  theme: {
    value: "light",
  },
  language: {
    value: "text",
  },
  editorRef: {
    value: {},
  },
});
