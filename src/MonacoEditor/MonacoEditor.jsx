import { render } from "preact";
import { useContext, useRef } from "preact/hooks";
import * as monaco from "monaco-editor";
import { useEffect } from "react";
import { Registry } from "../state";
import { getLanguageFromFilename, detectContentTypeFromContent } from "./utils";
import { initCommands } from "./monacoCommands";

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

  function detectLanguage(filename = "") {
    if (filename) {
      const language = getLanguageFromFilename(filename);
      if (language) {
        registry.language.value = language;
        return;
      }
    }

    const editorContent = registry.editorRef.value.getValue();
    registry.language.value = detectContentTypeFromContent(editorContent);
  }

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

    registry.editorRef.value = editor;

    initCommands(registry);

    // Cleanup function
    return () => {
      if (registry.editorRef.value) {
        registry.editorRef.value.dispose();
      }
    };
  }, []);

  // Update editor theme when theme state changes
  useEffect(() => {
    if (!registry.editorRef.value) {
      return;
    }
    registry.editorRef.value.updateOptions({
      theme: registry.theme.value === "dark" ? "vs-dark" : "vs",
    });
  }, [registry.theme.value, editorRef]);

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
    registry.editorRef.value.onDidPaste(() => setTimeout(detectLanguage, 0));
  }, [editorRef]);

  // Log filename and contents when user drops a file
  useEffect(() => {
    if (!registry.editorRef.value || !rootNode.current) {
      return;
    }

    function cancelEvents(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const handleDrop = (e) => {
      cancelEvents(e);

      const files = e.dataTransfer.files;
      if (!files.length) {
        return;
      }

      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        registry.editorRef.value.setValue(event.target.result);
        detectLanguage(file.name);
      };
      reader.readAsText(file);
    };

    const editorContainer = rootNode.current;
    editorContainer.addEventListener("dragover", cancelEvents);
    editorContainer.addEventListener("drop", handleDrop);

    return () => {
      editorContainer.removeEventListener("dragover", cancelEvents);
      editorContainer.removeEventListener("drop", handleDrop);
    };
  }, [editorRef, rootNode]);

  return <div class="monaco-editor" ref={rootNode} style="flex:1;"></div>;
}
