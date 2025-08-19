import { render } from "preact";
import { useContext, useRef } from "preact/hooks";
import * as monaco from "monaco-editor";
import { useEffect, useState } from "react";
import { Registry } from "../state";

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

export function MonacoEditor() {
  const rootNode = useRef();
  const editorRef = useRef(null);
  const registry = useContext(Registry);

  useEffect(() => {
    if (!rootNode.current) {
      return;
    }
    console.log("initialising editor");

    // Create the editor with the appropriate theme
    const editor = monaco.editor.create(rootNode.current, {
      value: "function hello() {\n\talert('Hello world!');\n}",
      language: "javascript",
      theme: registry.theme.value === "dark" ? "vs-dark" : "vs",
    });

    editorRef.current = editor;

    // Cleanup function
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, [rootNode.current]);

  // Update editor theme when theme state changes
  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    editorRef.current.updateOptions({
      theme: registry.theme.value === "dark" ? "vs-dark" : "vs",
    });
  }, [registry.theme.value, editorRef.current]);

  return (
    <div
      class="monaco-editor"
      ref={rootNode}
      style="background:red;flex:1;"
    ></div>
  );
}
