import { minify } from "terser";
import * as prettier from "prettier/standalone";
import prettierBabel from "prettier/plugins/babel";
import prettierEstree from "prettier/plugins/estree";

export async function compressJs(text) {
  let transformed = await minify(text, { sourceMap: false });
  return transformed.code;
}

export async function prettifyJs(text) {
  let formatted = await prettier.format(text, {
    parser: "babel",
    plugins: [prettierBabel, prettierEstree],
  });
  return formatted;
}
