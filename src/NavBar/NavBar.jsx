import { render } from "preact";
import "./navbar.css";

export function NavBar() {
  return (
    <nav class="navbar">
      <h1>Alchemize</h1>
      <div class="navbar__tools">
        <select class="form-control formats" style="min-width:10em;">
          <option>Text</option>
          <option>JavaScript</option>
          <option>HTML</option>
          <option>CSS</option>
          <option>XML</option>
          <option>JSON</option>
        </select>
        <div class="btn-group">
          <button>Compress</button>
          <button>Prettify</button>
        </div>
      </div>
    </nav>
  );
}
