import { createContext, render, h } from "preact";
import { useState, useEffect } from "preact/hooks";

import "./style.css";
import { NavBar } from "./NavBar/NavBar";
import { getState, Registry } from "./state";
import { useRef } from "preact/hooks";
import { Spinner } from "./Spinner/Spinner";

// We'll dynamically import MonacoEditor when needed
let MonacoEditorComponent = null;

export function App() {
  const appState = getState();
  const editorRef = useRef();
  const [loading, setLoading] = useState(true);

  // Handle lazy loading state
  useEffect(() => {
    // Dynamically import MonacoEditor
    import("./MonacoEditor/MonacoEditor").then((module) => {
      MonacoEditorComponent = module.MonacoEditor;
      setLoading(false);
    });
  }, []);

  return (
    <Registry.Provider value={appState}>
      <NavBar editorRef={editorRef} />
      {loading ? <Spinner /> : <MonacoEditorComponent editorRef={editorRef} />}
    </Registry.Provider>
  );
}

render(<App />, document.getElementById("app"));
