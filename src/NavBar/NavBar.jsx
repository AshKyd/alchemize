import { render } from "preact";
import "./navbar.css";
import { useContext, useState } from "preact/hooks";
import { Registry } from "../state";
import { performAction } from "../actions";
import About from "../About/About";

import prettierPackageJson from "prettier/package.json";
import terserPackageJson from "terser/package.json";
import cssoPackageJson from "csso/package.json";
import htmlMinifierTerserPackageJson from "html-minifier-terser/package.json";
import prettierPluginXmlPackageJson from "@prettier/plugin-xml/package.json";

export function NavBar() {
  const registry = useContext(Registry);
  const [modal, setModal] = useState(false);

  const isDisabled =
    registry.editorLength.value === 0 || registry.language.value === "text";

  return (
    <>
      {modal && (
        <About
          onClose={() => setModal(false)}
          packages={[
            prettierPackageJson,
            terserPackageJson,
            cssoPackageJson,
            htmlMinifierTerserPackageJson,
            prettierPluginXmlPackageJson,
          ]}
        />
      )}
      <nav class="navbar">
        <h1>
          <button class="reset" onClick={() => setModal(true)}>
            Alchemize
          </button>
        </h1>
        <div class="navbar__tools">
          <label>
            <span class="sr-only">Format</span>
            <label class="select" for="language-select">
              <select
                id="language-select"
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
            </label>
          </label>
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
    </>
  );
}
