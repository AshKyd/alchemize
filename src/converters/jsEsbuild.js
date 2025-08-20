import * as esbuild from "esbuild-wasm";
import * as prettier from "prettier/standalone";
import prettierBabel from "prettier/plugins/babel";
import prettierEstree from "prettier/plugins/estree";
import wasmURL from "esbuild-wasm/esbuild.wasm?url";

let isInitialised = false;
async function initialiseWasm() {
  if (!isInitialised) {
    await esbuild.initialize({
      wasmURL,
      worker: false,
    });
    isInitialised = true;
  }
}

export async function compressJs(text) {
  await initialiseWasm();
  let transformed = await esbuild.transform(text, {
    minify: true,
  });
  return transformed.code;
}

export async function prettifyJs(text) {
  let formatted = await prettier.format(text, {
    parser: "babel",
    plugins: [prettierBabel, prettierEstree],
  });
  return formatted;
}
