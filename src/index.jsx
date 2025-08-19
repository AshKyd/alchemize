import { createContext, render } from "preact";

import "./style.css";
import { NavBar } from "./NavBar/NavBar";
import { MonacoEditor } from "./MonacoEditor/MonacoEditor";
import { getState, Registry } from "./state";

export function App() {
  const appState = getState();

  return (
    <Registry.Provider value={appState}>
      <NavBar />
      <MonacoEditor />
    </Registry.Provider>
  );
}

render(<App />, document.getElementById("app"));
