import { render } from "preact";
import { useContext, useRef } from "preact/hooks";
import * as monaco from "monaco-editor";
import { useEffect } from "react";
import { Registry } from "../state";
import { initCommands } from "./monacoCommands";
import { initThemes } from "./themes";
import "./monacoEditor.css";
import { detectLanguage } from "../actions";

// Initialize Monaco Environment for Vite
self.MonacoEnvironment = {
  getWorker: function (workerId, label) {
    switch (label) {
      case "json":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/json/json.worker.js",
            import.meta.url
          ),
          { type: "module" }
        );
      case "css":
      case "scss":
      case "less":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/css/css.worker.js",
            import.meta.url
          ),
          { type: "module" }
        );
      case "html":
      case "handlebars":
      case "razor":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/html/html.worker.js",
            import.meta.url
          ),
          { type: "module" }
        );
      case "typescript":
      case "javascript":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/typescript/ts.worker.js",
            import.meta.url
          ),
          { type: "module" }
        );
      default:
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/editor/editor.worker.js",
            import.meta.url
          ),
          { type: "module" }
        );
    }
  },
};

export function MonacoEditor({ editorRef }) {
  const rootNode = useRef(document.createElement("div"));
  const registry = useContext(Registry);

  useEffect(() => {
    if (!rootNode.current) {
      return;
    }

    // Initialize themes
    initThemes();

    // Create the editor with the GithubDark theme
    const editor = monaco.editor.create(rootNode.current, {
      value: "",
      language: registry.language.value,
      theme:
        registry.theme.value === "dark" ? "AlchemizeDark" : "AlchemizeLight",
    });

    registry.editorRef.value = editor;

    initCommands(registry);

    // Cleanup function
    return () => {
      if (registry.editorRef.value) {
        registry.editorRef.value.dispose();
      }
    };
  }, []);

  // update language when state changes
  useEffect(() => {
    if (!registry.editorRef.value) {
      return;
    }
    monaco.editor.setModelLanguage(
      registry.editorRef.value.getModel(),
      registry.language.value
    );
  }, [registry.language.value, editorRef]);

  useEffect(() => {
    registry.editorRef.value.updateOptions({
      theme:
        registry.theme.value === "dark" ? "AlchemizeDark" : "AlchemizeLight",
    });
  }, [registry.theme.value]);

  // Auto-resize editor when container size changes
  useEffect(() => {
    if (!registry.editorRef.value || !rootNode.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() =>
      registry.editorRef.value.layout()
    );
    resizeObserver.observe(rootNode.current);

    return () => resizeObserver.disconnect();
  }, [editorRef, rootNode]);

  // Log editor content when user pastes new content
  useEffect(() => {
    if (!registry.editorRef.value) {
      return;
    }
    registry.editorRef.value.onDidPaste(() =>
      setTimeout(() => detectLanguage(registry, ""), 0)
    );
  }, [editorRef]);

  // reset savings and update editor length when the editor content changes
  useEffect(() => {
    if (!registry.editorRef.value) {
      return;
    }

    const disposable = registry.editorRef.value.onDidChangeModelContent(() => {
      registry.savings.value = Infinity;
      registry.editorLength.value = registry.editorRef.value
        .getModel()
        .getValueLength();
      registry.errorMessage.value = "";
    });

    return () => disposable.dispose();
  }, [editorRef]);

  return (
    <div class="monaco-editor">
      <div class="monaco-editor__floater" ref={rootNode} style="flex:1;"></div>
    </div>
  );
}
