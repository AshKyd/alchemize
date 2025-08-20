import * as prettier from "prettier/standalone";
import prettierBabel from "prettier/plugins/babel";
import prettierEstree from "prettier/plugins/estree";
import prettierHtml from "prettier/plugins/html";
import { minify } from "html-minifier-terser";

export async function compressHtml(text) {
  return minify(text, {
    decodeEntities: true,
    removeComments: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    collapseWhitespace: true,
  });
}

export async function prettifyHtml(text) {
  return await prettier.format(text, {
    parser: "html",
    plugins: [prettierHtml],
  });
}
