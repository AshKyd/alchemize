import { render } from "preact";
import { useContext, useRef } from "preact/hooks";
import * as monaco from "monaco-editor";
import { useEffect, useState } from "react";
import { Registry } from "../state";

self.MonacoEnvironment = {
  getWorker: function (workerId, label) {
    const getWorkerModule = (moduleUrl, label) => {
      return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl), {
        name: label,
        type: "module",
      });
    };

    switch (label) {
      case "json":
        return getWorkerModule(
          "/monaco-editor/esm/vs/language/json/json.worker?worker",
          label
        );
      case "css":
      case "scss":
      case "less":
        return getWorkerModule(
          "/monaco-editor/esm/vs/language/css/css.worker?worker",
          label
        );
      case "html":
      case "handlebars":
      case "razor":
        return getWorkerModule(
          "/monaco-editor/esm/vs/language/html/html.worker?worker",
          label
        );
      case "typescript":
      case "javascript":
        return getWorkerModule(
          "/monaco-editor/esm/vs/language/typescript/ts.worker?worker",
          label
        );
      default:
        return getWorkerModule(
          "/monaco-editor/esm/vs/editor/editor.worker?worker",
          label
        );
    }
  },
};

export function MonacoEditor() {
  const rootNode = useRef();
  const editorRef = useRef(null);
  const registry = useContext(Registry);

  useEffect(() => {
    console.log({ registry });
  }, [registry]);

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
