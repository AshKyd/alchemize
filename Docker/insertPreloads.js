import fs from "fs";
import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const htmlPath = path.resolve(__dirname, "../dist/index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const monacoPreloads = fs
  .readdirSync(path.resolve(__dirname, "../dist/assets/"))
  .filter(
    (file) =>
      file.includes("MonacoEditor-") || file.includes("converterWorker-")
  )
  .map((file) =>
    file.includes(".css")
      ? `<link rel="preload" as="style" href="assets/${file}" crossorigin />`
      : `<link rel="modulepreload" href="assets/${file}" />`
  )
  .join("\n    ");

const newHtml = html.replace("</head>", monacoPreloads + "\n  </head>");
fs.writeFileSync(htmlPath, newHtml);
