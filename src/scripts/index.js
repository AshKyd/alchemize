try {
  navigator.serviceWorker.register("workerService.js");
} catch (e) {
  console.error(e);
}

// Globals and general ugliness.
window.$ = require("jquery");
window.jQuery = $;
require("../../node_modules/bootstrap/dist/js/bootstrap.min.js");
var versioning = require("./_includes/versioning");

var editor;
var before;
var theme;

// Formats we support.
var formats = {
  Text: {
    name: "Text",
    filename: /\.txt$/,
    parser: "text",
    mode: "ace/mode/text",
    actions: []
  },
  JavaScript: {
    name: "JavaScript",
    filename: /\.js$/,
    parser: "js",
    mode: "ace/mode/javascript",
    actions: ["compress", "prettify"]
  },
  HTML: {
    name: "HTML",
    filename: /\.html?$/,
    parser: "html",
    mode: "ace/mode/html",
    actions: ["compress", "prettify"]
  },
  CSS: {
    name: "CSS",
    filename: /\.js$/,
    parser: "css",
    mode: "ace/mode/css",
    actions: ["compress", "prettify"]
  },
  XML: {
    name: "XML",
    filename: /\.xml$/,
    parser: "xml",
    mode: "ace/mode/xml",
    actions: ["compress", "prettify"]
  },
  JSON: {
    name: "JSON",
    filename: /\.json$/,
    parser: "json",
    mode: "ace/mode/json",
    actions: ["compress", "prettify"]
  }
};

function formatChange(format) {
  changeFormat($(".formats").val());
}

function changeFormat(format) {
  $(".formats").val(format);
  var $actions = $(".action").attr("disabled", "disabled");
  formats[format].actions.forEach(function(action) {
    $actions.filter("." + action).removeAttr("disabled");
  });
  editor.getSession().setMode(formats[format].mode);
}

function performAction() {
  var format = $(".formats").val();
  var action = $(this).data("action");
  var input = editor.getValue();
  before = input.length;
  postMessage({
    lang: formats[format].parser,
    direction: action,
    input: input
  });
  return false;
}

function initDrag() {
  var holder = document.getElementsByTagName("body")[0];

  holder.ondragover = function() {
    this.className = "hover";
    return false;
  };
  holder.ondragend = function() {
    this.className = "";
    return false;
  };
  holder.ondrop = function(e) {
    this.className = "";
    e.preventDefault();

    dragSingle(e.dataTransfer.files[0]);
    return false;
  };
}

function dragSingle(file) {
  var reader = new FileReader();

  reader.onload = function(event) {
    // Uglify occasionally inserts \x01 for some reason.
    var isBinary = /[\x00\x02-\x08\x0E-\x1F]/.test(event.target.result);
    if (isBinary) {
      window.bin = event.target.result;
      message("Binary file detected. Loading as base64.");
      reader.readAsDataURL(file);
    } else {
      editor.setValue("");
      detectContentType(file.name, event.target.result);
      editor.setValue(event.target.result);
    }
  };

  reader.readAsText(file);
}

function detectContentType(filename, content) {
  var format;
  format = detectContentTypeFromExtension(filename);
  if (!format) {
    format = detectContentTypeFromContent(content);
  }
  if (!format) {
    format = "Text";
  }
  changeFormat(format);
}
function detectContentTypeFromExtension(filename) {
  for (var i in formats) {
    if (filename.match(formats[i].filename)) {
      return i;
    }
  }
}
function detectContentTypeFromContent(content) {
  var round1 = [
    // Matches an initial /* comment */ and subsequent function def.
    {
      test: /^\/\*(.|\n)+function\s*\(/,
      type: "JavaScript"
    },
    {
      test: /<html(.*)?>/,
      type: "HTML"
    },
    {
      test: /<(div|span|ul|li|head|script)(.*)?>/,
      type: "HTML"
    },
    {
      // Matches a partial arrow function
      test: /\)\s?=>/,
      type: "JavaScript"
    },
    {
      test: /^\s*{/,
      type: "JSON"
    },
    {
      test: /console\.log/,
      type: "JavaScript"
    },
    {
      test: /function\s*\(/,
      type: "JavaScript"
    },
    {
      test: /@import/,
      type: "CSS"
    },
    // Matches something like "foo {", a syntax you'd likely
    // not find elsewhere
    // False positive on var a=\n//foo\n{a:b}
    {
      test: /\w+\s*\{/,
      type: "CSS"
    },
    // Matches assignment, excluding something like the CSS syntax [foo=bar]
    // False positive on something like @import("/foo?a=b")
    {
      test: /\s[^'"\[]+\=/,
      type: "JavaScript"
    },
    {
      test: /^\s*</,
      type: "XML"
    }
  ];

  for (var i = 0; i < round1.length; i++) {
    if (content.match(round1[i].test)) {
      return round1[i].type;
    }
  }

  return false;
}

function bytesToDisplay(bytes, units) {
  return Math.round(bytes / 10.24) / 100 + (units ? " KB" : "");
}

function message(msg) {
  $(".status.message").text(msg);
}

var worker;
function initWorker() {
  // If we don't have workers for whatever reason, fire up a frame.
  if (typeof Worker !== "function") {
    return message("this browser doesn't support workers. I can't go on!");
  }
  worker = new Worker("worker.js");
  worker.onmessage = onmessage;
}

function postMessage(payload) {
  // If we've got a worker, use that! these should be mutually exclusive.
  if (worker) {
    worker.postMessage(payload);
  }

  $(".progress").fadeIn(25);
  $("button, select").attr("disabled", "disabled");
  message(payload.direction + "ing…");
}

function onmessage(event) {
  $(".progress").fadeOut(25);
  $("button, select").removeAttr("disabled");
  var output = event.data.response.output;
  var error = event.data.response.error;
  editor.setValue(output);
  if (error) {
    message(error);
  } else {
    message(
      "New size: " +
        bytesToDisplay(output.length, true) +
        ", saving " +
        bytesToDisplay(before - output.length, true)
    );
  }
}

$(document).ready(function() {
  initWorker();
  $(window).resize();
  editor = ace.edit("editor");
  var session = editor.getSession();
  session.setMode("ace/mode/text");
  session.setUseWrapMode(true);
  session.setWrapLimitRange(null, null);
  editor.renderer.setPrintMarginColumn(80);
  editor.focus();

  editor.on("paste", function(content) {
    // Break out so the editor can actually have the new value set.
    setTimeout(function() {
      detectContentType("", editor.getValue());
    });
  });

  editor.on("change", function(content) {
    $(".status.format").text($(".formats").val());
    message(bytesToDisplay(editor.getValue().length, true));
  });

  for (var i in formats) {
    $(".formats").append("<option>" + formats[i].name + "</option>");
  }
  $(".formats").change(formatChange);
  changeFormat("Text");

  $("button.action").click(performAction);
  initDrag();

  initTheme();

  versioning();

  message("Drag a file or paste from the clipboard");

  document.body.classList.remove("preload");
  document.body.classList.add("loaded");
  
  require('./preload.js');
});

$(window).resize(function() {
  var bodyHeight = $(window).innerHeight();
  $("body").height(bodyHeight);
  $("#editor").height(
    bodyHeight -
      $(".navbar-static-top").outerHeight() -
      $(".navbar-fixed-bottom").outerHeight()
  );
});

$(window).focus(function() {
  editor.focus();
});

// dark theme switch functions
// apply the theme
function applyTheme(){
	$('body').removeClass('dark light')
	$('body').addClass(theme)
	editor.setTheme("ace/theme/" + (theme == 'dark' ? "tomorrow_night" : "chrome"));
}
// check local storage then user's preferred theme
function initTheme(){
  theme = localStorage.getItem('theme');
  if (!theme){
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light'
  }
  // switch theme
  $('#dark-theme-switch').on("click", () => {
    theme = theme == 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', theme);
    applyTheme()
  })
  // apply default
  applyTheme()
}