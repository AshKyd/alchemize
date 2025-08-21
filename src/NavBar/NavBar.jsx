import { render } from "preact";
import "./navbar.css";
import { useContext } from "preact/hooks";
import { Registry } from "../state";
import workerClient from "../converters/index";

export function NavBar({ editorRef }) {
  const registry = useContext(Registry);

  function performAction(e, action) {
    e.preventDefault();
    const text = editorRef.current.getValue();

    workerClient
      .push(action, { language: registry.language.value, text }, [])
      .then(({ res, error }) => {
        if (error) {
          alert(error);
        }
        if (res) {
          editorRef.current.setValue(res);
          // Put the cursor at the very start of the editor
          editorRef.current.setPosition({ lineNumber: 1, column: 1 });
          editorRef.current.revealPosition({ lineNumber: 1, column: 1 });
        }
      });
  }
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
          <button onClick={(e) => performAction(e, "compress")}>
            Compress
          </button>
          <button onClick={(e) => performAction(e, "prettify")}>
            Prettify
          </button>
        </div>
      </div>
    </nav>
  );
}
