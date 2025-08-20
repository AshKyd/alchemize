import * as prettier from "prettier/standalone";
import prettierPostcss from "prettier/plugins/postcss";
import * as esbuild from "esbuild-wasm";
import wasmURL from "esbuild-wasm/esbuild.wasm?url";

let isInitialised = false;
async function initEsbuild() {
  if (isInitialised) {
    return;
  }
  await esbuild.initialize({
    worker: true,
    wasmURL,
  });
  isInitialised = true;
}

export async function compressCss(text) {
  await initEsbuild();
  const result = await esbuild.transform(text, {
    loader: "css",
    minify: true,
  });
  return result.code;
}

export async function prettifyCss(text) {
  let formatted = await prettier.format(text, {
    parser: "css",
    plugins: [prettierPostcss],
  });
  return formatted;
}
