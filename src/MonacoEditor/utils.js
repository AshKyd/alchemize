export function getLanguageFromFilename(filename) {
  const extension = filename.split(".").pop();
  if (!extension) {
    return "";
  }
  switch (extension) {
    case "js":
    case "ts":
      return "javascript";
    case "css":
      return "css";
    case "xml":
    case "rss":
    case "atom":
    case "opml":
      return "xml";
    case "html":
    case "htm":
      return "html";
    case "json":
      return "json";
    default:
      return "text";
  }
}

export function detectContentTypeFromContent(content) {
  var round1 = [
    {
      test: /^<\?xml\s/,
      type: "xml",
    },
    {
      test: /^<?xml\s/,
      type: "xml",
    },
    // Matches an initial /* comment */ and subsequent function def.
    {
      test: /^\/\*(.|\n)+function\s*\(/,
      type: "javascript",
    },
    {
      test: /<html(.*)?>/,
      type: "html",
    },
    {
      test: /<(div|span|ul|li|head|script)(.*)?>/,
      type: "html",
    },
    {
      // Matches a partial arrow function
      test: /\)\s?=>/,
      type: "javascript",
    },
    {
      test: /^\s*{/,
      type: "json",
    },
    {
      test: /console\.log/,
      type: "javascript",
    },
    {
      test: /function\s*\(/,
      type: "javascript",
    },
    {
      test: /@import/,
      type: "css",
    },
    // Matches something like "foo {", a syntax you'd likely
    // not find elsewhere
    // False positive on var a=\n//foo\n{a:b}
    {
      test: /\w+\s*\{/,
      type: "css",
    },
    // Matches assignment, excluding something like the CSS syntax [foo=bar]
    // False positive on something like @import("/foo?a=b")
    {
      test: /\s[^'"\[]+\=/,
      type: "javascript",
    },
    {
      test: /^\s*</,
      type: "xml",
    },
  ];

  for (var i = 0; i < round1.length; i++) {
    if (content.match(round1[i].test)) {
      return round1[i].type;
    }
  }

  return "text";
}
