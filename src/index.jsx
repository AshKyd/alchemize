import { render } from "preact";

import "./style.css";
import { NavBar } from "./NavBar/NavBar";
import { MonacoEditor } from "./MonacoEditor/MonacoEditor";

export function App() {
  return (
    <>
      <NavBar />
      <MonacoEditor />
    </>
  );
}

render(<App />, document.getElementById("app"));
