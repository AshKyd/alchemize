import { render } from "preact";
import { useRef } from "preact/hooks";
import * as monaco from "monaco-editor";
import { useEffect, useState } from "react";

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
  useEffect(() => {
    if (!rootNode.current) {
      return;
    }

    monaco.editor.create(rootNode.current, {
      value: "function hello() {\n\talert('Hello world!');\n}",
      language: "javascript",
    });
  }, [rootNode.current]);
  return (
    <div
      class="monaco-editor"
      ref={rootNode}
      style="background:red;flex:1;"
    ></div>
  );
}
