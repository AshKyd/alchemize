import { WorkerClient } from "workiq";
import { compressJs, prettifyJs } from "./converterJavascript";
import { compressCss, prettifyCss } from "./converterCss";
import { compressHtml, prettifyHtml } from "./converterHtml";
import { compressXml, prettifyXml } from "./converterXml";

function getError(message) {
  console.error(message);
  console.trace();
  return [{ error: message }];
}

const languages = {
  xml: {
    compress: compressXml,
    prettify: prettifyXml,
  },
  html: {
    compress: compressHtml,
    prettify: prettifyHtml,
  },
  css: {
    compress: compressCss,
    prettify: prettifyCss,
  },
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
