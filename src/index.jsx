import { createContext, render } from "preact";

import "./style.css";
import { NavBar } from "./NavBar/NavBar";
import { MonacoEditor } from "./MonacoEditor/MonacoEditor";
import { getState, Registry } from "./state";
import { useRef } from "preact/hooks";

export function App() {
  const appState = getState();
  const editorRef = useRef();

  return (
    <Registry.Provider value={appState}>
      <NavBar />
      <MonacoEditor editorRef={editorRef} />
    </Registry.Provider>
  );
}

render(<App />, document.getElementById("app"));
