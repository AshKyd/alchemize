import fs from "fs";
import path from "path";

const htmlPath = path.resolve(import.meta.dirname, "../dist/index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const monacoPreloads = fs
  .readdirSync(path.resolve(import.meta.dirname, "../dist/assets/"))
  .filter(
    (file) =>
      file.includes("MonacoEditor-") || file.includes("converterWorker-")
  )
  .map((file) => `<link rel="modulepreload" href="assets/${file}" />`)
  .join("\n    ");

const newHtml = html.replace("</head>", monacoPreloads + "\n  </head>");
fs.writeFileSync(htmlPath, newHtml);
