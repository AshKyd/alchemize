import { render } from "preact";
import "./navbar.css";
import { useContext } from "preact/hooks";
import { Registry } from "../state";
import { performAction } from "../actions";

export function NavBar({}) {
  const registry = useContext(Registry);

  const isDisabled =
    registry.editorLength.value === 0 || registry.language.value === "text";

  return (
    <nav class="navbar">
      <h1>Alchemize</h1>
      <div class="navbar__tools">
        <select
          class="form-control formats"
          style="min-width:10em;"
          disabled={isDisabled}
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
            disabled={isDisabled}
            onClick={(e) => {
              e.preventDefault();
              performAction(registry, "compress", registry.language.value);
            }}
          >
            Compress
          </button>
          <button
            disabled={isDisabled}
            onClick={(e) => {
              e.preventDefault();
              performAction(registry, "prettify", registry.language.value);
            }}
          >
            Prettify
          </button>
        </div>
      </div>
    </nav>
  );
}
