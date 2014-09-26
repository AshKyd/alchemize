var UglifyJS = require('uglify-js');
var fs = require('fs');
var beautify = require('js-beautify');
var htmlminifier = require('html-minifier');
var cleancss = require('clean-css');
var prettydata = require('pretty-data');

var langs = {
    js: {
        compress: function(opts, cb){
        var ugly = UglifyJS.minify(opts.input, {
                fromString: true
            });

            cb({
                output: ugly.code
            });
        },
        prettify: function(opts, cb){
            var pretty = beautify(opts.input, { indent_size: 4 });
            cb({
                output: pretty
            });
        }
    },
    json: {
        compress: function(opts, cb){
            var ugly = JSON.stringify(JSON.parse(opts.input));
            cb({
                output: ugly
            });
        },
        prettify: function(opts, cb){
            var pretty = JSON.stringify(JSON.parse(opts.input),null,4);
            cb({
                output: pretty
            })
        }
    },
    html: {
        compress: function(opts, cb){
            opts.collapseWhitespace = true;
            var ugly = htmlminifier.minify(opts.input, opts);
            cb({
                output: ugly
            });
        },
        prettify: function(opts, cb){
            opts.indent_size = opts.indent_size || 4;
            opts.indent_char = opts.indent_char || ' ';
            opts.wrap_line_length = opts.wrap_line_length || 0;
            opts.preserve_newlines = opts.preserve_newlines || false;

            var pretty = beautify.html_beautify(opts.input,opts);
            cb({
                output: pretty
            })
        }
    },
    css: {
        compress: function(opts, cb){
            var ugly = cleancss(opts).minify(opts.input);
            cb({
                output: ugly
            });
        },
        prettify: function(opts, cb){
            var pretty = beautify.css_beautify(opts.input,opts);
            cb({
                output: pretty
            })
        }
    },
    xml: {
        compress: function(opts, cb){
            var ugly = prettydata.pd.xmlmin(opts.input);
            cb({
                output: ugly
            });
        },
        prettify: function(opts, cb){
            var pretty = prettydata.pd.xml(opts.input,opts);
            cb({
                output: pretty
            })
        }
    }
}

window.addEventListener('message', function(e) {
    var opts = e.data;
    var response = '';

    if(!langs[opts.lang]){
        return reply(e,opts.input,'Language '+opts.lang+'isn\'t defined');
    }

    if(!langs[opts.lang][opts.direction]){
        return reply(e,opts.input,'Direction '+opts.direction+'isn\'t defined');
    }
    langs[opts.lang][opts.direction](opts,function(resp){
        reply(e, resp);
    });
});

function reply(event, resp){
    event.source.postMessage({
        response: resp
    }, event.origin);
}