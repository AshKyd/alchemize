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

export function MonacoEditor({ editorRef }) {
  const rootNode = useRef();
  const registry = useContext(Registry);

  useEffect(() => {
    if (!rootNode.current) {
      return;
    }

    // Create the editor with the appropriate theme
    const editor = monaco.editor.create(rootNode.current, {
      value: "",
      language: registry.language.value,
      theme: registry.theme.value === "dark" ? "vs-dark" : "vs",
    });

    editorRef.current = editor;

    // Cleanup function
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  // Update editor theme when theme state changes
  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    editorRef.current.updateOptions({
      theme: registry.theme.value === "dark" ? "vs-dark" : "vs",
    });
  }, [registry.theme.value, editorRef]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    monaco.editor.setModelLanguage(
      editorRef.current.getModel(),
      registry.language.value
    );
  }, [registry.language.value, editorRef]);

  // Auto-resize editor when container size changes
  useEffect(() => {
    if (!editorRef.current || !rootNode.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => editorRef.current.layout());
    resizeObserver.observe(rootNode.current);

    return () => resizeObserver.disconnect();
  }, [editorRef, rootNode]);

  return (
    <div
      class="monaco-editor"
      ref={rootNode}
      style="background:red;flex:1;"
    ></div>
  );
}
