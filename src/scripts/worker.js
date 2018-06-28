// clean-css requires http which requires window
self.window = self;
const fs = require("fs");
var UglifyJS = require("uglify-es");
var beautify = require("js-beautify");
var htmlminifier = require("html-minifier");
var cleancss = require("clean-css");
var prettydata = require("pretty-data");

var langs = {
  js: {
    compress: function(opts, cb) {
      try {
        var ugly = UglifyJS.minify(opts.input);
        if (ugly.error) throw ugly.error;
      } catch (e) {
        console.log(e);
        return cb({
          output: opts.input,
          error:
            "Error parsing: " +
            e.message +
            ". Line " +
            e.line +
            ", col " +
            e.col
        });
      }

      cb({
        output: ugly.code
      });
    },
    prettify: function(opts, cb) {
      var pretty = beautify(opts.input, { indent_size: 4 });
      cb({
        output: pretty
      });
    }
  },
  json: {
    compress: function(opts, cb) {
      try {
        var ugly = JSON.stringify(JSON.parse(opts.input));
      } catch (e) {
        return cb({
          output: opts.input,
          error: "Error parsing: " + e.message
        });
      }
      cb({
        output: ugly
      });
    },
    prettify: function(opts, cb) {
      langs.js.prettify(opts, cb);
    }
  },
  html: {
    compress: function(opts, cb) {
      opts.collapseWhitespace = true;
      var ugly = htmlminifier.minify(opts.input, opts);
      cb({
        output: ugly
      });
    },
    prettify: function(opts, cb) {
      opts.indent_size = opts.indent_size || 4;
      opts.indent_char = opts.indent_char || " ";
      opts.wrap_line_length = opts.wrap_line_length || 0;
      opts.preserve_newlines = opts.preserve_newlines || false;

      var pretty = beautify.html_beautify(opts.input, opts);
      cb({
        output: pretty
      });
    }
  },
  css: {
    compress: function(opts, cb) {
      var ugly = cleancss(opts).minify(opts.input);
      cb({
        output: ugly
      });
    },
    prettify: function(opts, cb) {
      var pretty = beautify.css_beautify(opts.input, opts);
      cb({
        output: pretty
      });
    }
  },
  xml: {
    compress: function(opts, cb) {
      var ugly = prettydata.pd.xmlmin(opts.input);
      cb({
        output: ugly
      });
    },
    prettify: function(opts, cb) {
      var pp = new prettydata.pp({
        step: 4
      });

      var pretty = pp.xml(opts.input, opts);
      cb({
        output: pretty
      });
    }
  }
};

addEventListener("message", function(e) {
  var opts = e.data;

  if (!langs[opts.lang]) {
    return reply(e, opts.input, "Language " + opts.lang + "isn't defined");
  }

  if (!langs[opts.lang][opts.direction]) {
    return reply(
      e,
      opts.input,
      "Direction " + opts.direction + "isn't defined"
    );
  }
  langs[opts.lang][opts.direction](opts, function(resp) {
    reply(e, resp);
  });
});

function reply(event, resp) {
  postMessage({
    response: resp
  });
}
