import * as prettier from "prettier/standalone";
import prettierPostcss from "prettier/plugins/postcss";
import { minify } from "csso";

export async function compressCss(text) {
  return minify(text).css;
}

export async function prettifyCss(text) {
  let formatted = await prettier.format(text, {
    parser: "css",
    plugins: [prettierPostcss],
  });
  return formatted;
}
