import { render } from "preact";
import "./navbar.css";
import { useContext } from "preact/hooks";
import { Registry } from "../state";
import { performAction } from "../actions";

export function NavBar({}) {
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
          <button
            onClick={(e) => {
              e.preventDefault();
              performAction(
                registry.editorRef.value,
                "compress",
                registry.language.value
              );
            }}
          >
            Compress
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              performAction(
                registry.editorRef.value,
                "prettify",
                registry.language.value
              );
            }}
          >
            Prettify
          </button>
        </div>
      </div>
    </nav>
  );
}
