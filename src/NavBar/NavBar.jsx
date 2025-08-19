import { render } from "preact";
import "./navbar.css";
import { useContext } from "preact/hooks";
import { Registry } from "../state";

export function NavBar() {
  const registry = useContext(Registry);
  return (
    <nav class="navbar">
      <h1>Alchemize</h1>
      <div class="navbar__tools">
        <select
          class="form-control formats"
          style="min-width:10em;"
          onChange={(e) => {
            e.preventDefault();
            console.log("changing to", e.target.value);
            registry.language.value = e.target.value;
          }}
          value={registry.language.value}
        >
          <option value="text">Text</option>
          <option value="javascript">JavaScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="xml">XML</option>
          <option value="json">JSON</option>
        </select>
        <div class="btn-group">
          <button>Compress</button>
          <button>Prettify</button>
        </div>
      </div>
    </nav>
  );
}
