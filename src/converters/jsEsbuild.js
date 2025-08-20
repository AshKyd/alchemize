import * as esbuild from "esbuild-wasm";
import wasmURL from "esbuild-wasm/esbuild.wasm?url";

let isInitialised = false;

export async function compressJs(text) {
  if (!isInitialised) {
    await esbuild.initialize({
      wasmURL,
      worker: false,
    });
    isInitialised = true;
  }

  let result1 = await esbuild.transform(text, {});
  return result1.code;
}

export async function prettifyJs(text) {
  return text;
}
