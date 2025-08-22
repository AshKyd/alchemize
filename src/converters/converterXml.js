import * as prettier from "prettier/standalone";
import prettierXml from "@prettier/plugin-xml";
import prettydata from "pretty-data";

export async function compressXml(text) {
  // prettify first, because prettier has xmlWhitespaceSensitivity:'ignore'
  return prettydata.pd.xmlmin(await prettifyXml(text));
}

export async function prettifyXml(text) {
  return await prettier.format(text, {
    parser: "xml",
    plugins: [prettierXml],
    xmlWhitespaceSensitivity: "ignore",
  });
}
