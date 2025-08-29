import * as prettier from "prettier/standalone";
import prettierPostcss from "prettier/plugins/postcss";
import { minify } from "csso";

export async function compressCss(text) {
  const ugly = minify(text).css;
  return ugly;
}

export async function prettifyCss(text) {
  let formatted = await prettier.format(text, {
    parser: "css",
    plugins: [prettierPostcss],
  });
  return formatted;
}
