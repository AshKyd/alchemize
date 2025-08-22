import { useSignal } from "@preact/signals";
import { createContext } from "preact";
import { useEffect } from "preact/hooks";

export const languages = {
  text: "Text",
  xml: "XML",
  html: "HTML",
  javascript: "JavaScript",
  json: "JSON",
  css: "CSS",
};

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

/**
 * @typedef {Object} AlchemizeState
 * @property {ReturnType<typeof getTheme>} theme
 * @property {import("@preact/signals").Signal<string>} language
 * @property {import("@preact/signals").Signal<import("monaco-editor").editor.IStandaloneCodeEditor>} editorRef
 * @property {import("@preact/signals").Signal<number>} savings
 * @property {import("@preact/signals").Signal<number>} editorLength
 * @property {import("@preact/signals").Signal<boolean>} isWorking
 * @property {import("@preact/signals").Signal<string>} errorMessage
 */

/**
 * @returns {AlchemizeState}
 */
export function getState() {
  return {
    theme: getTheme(),
    language: useSignal("text"),
    /** @type {import("@preact/signals").Signal<import("monaco-editor").editor.IStandaloneCodeEditor>} */
    editorRef: useSignal(),
    savings: useSignal(Infinity),
    editorLength: useSignal(0),
    isWorking: useSignal(false),
    errorMessage: useSignal(""),
  };
}

/** @type {import("preact").Context<AlchemizeState>} */
export const Registry = createContext();
