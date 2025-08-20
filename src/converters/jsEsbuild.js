import * as esbuild from "esbuild-wasm";
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
  await initialiseWasm();
  let transformed = await esbuild.transform(text, {
    minify: false,
  });
  return transformed.code;
}
