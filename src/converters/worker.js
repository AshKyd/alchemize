import { WorkerClient } from "workiq";
import { compressJs, prettifyJs } from "./jsEsbuild";

function getError(message) {
  return [{ error: message }];
}

const languages = {
  javascript: {
    compress: compressJs,
    prettify: prettifyJs,
  },
  json: {
    compress: async function (text) {
      try {
        var ugly = JSON.stringify(JSON.parse(text));
      } catch (e) {
        throw new Error("Error parsing: " + e.message);
      }
      return ugly;
    },
    prettify: async function (text) {
      try {
        const json = JSON.parse(text);
        return JSON.stringify(json, null, 2);
      } catch (e) {
        throw new Error("Error parsing: " + e.message);
      }
    },
  },
};

async function compress({ language, text }) {
  const compressor = languages[language].compress;
  if (!compressor) {
    return getError("Compressor not found for " + language);
  }
  return compressor(text)
    .then((res) => [{ res }])
    .catch((e) => getError(e.message));
}

async function prettify({ language, text }) {
  const prettifier = languages[language].prettify;
  if (!prettifier) {
    return getError("Prettifier not found for " + language);
  }
  return prettifier(text)
    .then((res) => [{ res }])
    .catch((e) => getError(e.message));
}

const workerClient = new WorkerClient({ compress, prettify });
