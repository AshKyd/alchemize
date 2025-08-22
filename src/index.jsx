import { createContext, render, h } from "preact";
import { useState, useEffect } from "preact/hooks";

import "./style.css";
import { NavBar } from "./NavBar/NavBar";
import { getState, Registry } from "./state";
import { Spinner } from "./Spinner/Spinner";
import { useRef } from "react";
import { detectLanguage } from "./actions";

// We'll dynamically import MonacoEditor when needed
let MonacoEditorComponent = null;

export function App() {
  const appState = getState();
  const rootNode = useRef();
  const [loading, setLoading] = useState(true);
  const [dropping, setDropping] = useState(false);
  const [droppedValue, setDroppedValue] = useState({ text: "", fileName: "" });

  // Handle lazy loading state
  useEffect(() => {
    // Dynamically import MonacoEditor
    import("./MonacoEditor/MonacoEditor").then((module) => {
      MonacoEditorComponent = module.MonacoEditor;
      setLoading(false);
    });
  }, []);

  // Handle drop
  useEffect(() => {
    if (!rootNode.current) {
      return;
    }

    function cancelEvents(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function dragOver(e) {
      cancelEvents(e);
      setDropping(true);
    }

    function dragLeave(e) {
      cancelEvents(e);
      // Only set dropping to false if we're actually leaving the element
      if (e.target === rootNode.current) {
        setDropping(false);
      }
    }

    const handleDrop = (e) => {
      cancelEvents(e);
      setDropping(false); // Reset dropping state when drop occurs

      const files = e.dataTransfer.files;
      if (!files.length) {
        return;
      }

      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) =>
        setDroppedValue({
          text: String(event.target.result),
          fileName: file.name,
        });

      reader.readAsText(file);
    };

    const { current } = rootNode;
    current.addEventListener("dragover", dragOver);
    current.addEventListener("dragleave", dragLeave);
    current.addEventListener("drop", handleDrop);

    return () => {
      current.removeEventListener("dragover", dragOver);
      current.removeEventListener("dragleave", dragLeave);
      current.removeEventListener("drop", handleDrop);
    };
  }, [appState.editorRef, rootNode]);

  // wait until the editor is available before setting text
  useEffect(() => {
    const { text, fileName } = droppedValue;
    if (!fileName || !appState.editorRef.value) {
      return;
    }
    appState.editorRef.value.setValue(text);
    detectLanguage(appState, fileName);
  }, [droppedValue, appState.editorRef]);

  return (
    <Registry.Provider value={appState}>
      <div
        class={`app app--${dropping ? "is-dropping" : "not-dropping"}`}
        ref={rootNode}
      >
        <NavBar />
        {loading ? (
          <Spinner />
        ) : (
          <MonacoEditorComponent isDropping={dropping} />
        )}
      </div>
    </Registry.Provider>
  );
}

render(<App />, document.getElementById("app"));
