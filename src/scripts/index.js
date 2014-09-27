// Globals and general ugliness.
var $ = require('jquery');
window.jQuery = $;
require('../../node_modules/bootstrap/dist/js/bootstrap.min.js');

// note: html-minifier needs to have './htmlparser' replaced with 'htmlparser'

// Ace editor
var ace = require('brace');
require('brace/mode/text');
require('brace/mode/javascript');
require('brace/mode/xml');
require('brace/mode/css');
require('brace/mode/json');
require('brace/mode/html');
require('brace/ext/searchbox');
require('brace/theme/chrome');

var editor;
var before;

// Formats we support.
var formats = {
    Text: {
        name: 'Text',
        filename: /\.txt$/,
        parser: 'text',
        mode: 'ace/mode/text',
        actions: []
    },
    JavaScript: {
        name: 'JavaScript',
        filename: /\.js$/,
        parser: 'js',
        mode: 'ace/mode/javascript',
        actions: ['compress','prettify']
    },
    HTML: {
        name: 'HTML',
        filename: /\.html?$/,
        parser: 'html',
        mode: 'ace/mode/html',
        actions: ['compress','prettify']
    },
    CSS: {
        name: 'CSS',
        filename: /\.js$/,
        parser: 'css',
        mode: 'ace/mode/css',
        actions: ['compress','prettify']
    },
    XML: {
        name: 'XML',
        filename: /\.xml$/,
        parser: 'xml',
        mode: 'ace/mode/xml',
        actions: ['compress','prettify']
    },
    JSON: {
        name: 'JSON',
        filename: /\.json$/,
        parser: 'json',
        mode: 'ace/mode/json',
        actions: ['compress','prettify']
    },
};

function formatChange(format){
    changeFormat($('.formats').val());
}

function changeFormat(format){
    $('.formats').val(format);
    var $actions = $('.action').attr('disabled','disabled');
    formats[format].actions.forEach(function(action){
        $actions.filter('.'+action).removeAttr('disabled');
    });
    editor.getSession().setMode(formats[format].mode);
}

function performAction(){
    var format = $('.formats').val();
    var action = $(this).data('action');
    var input = editor.getValue();
    before = input.length;
    postMessage({
        lang: formats[format].parser,
        direction: action,
        input: input,
    });
    return false;
}

function initDrag(){
    var holder = document.getElementsByTagName('body')[0];
    
    holder.ondragover = function () { this.className = 'hover'; return false; };
    holder.ondragend = function () { this.className = ''; return false; };
    holder.ondrop = function (e) {
        this.className = '';
        e.preventDefault();

        dragSingle(e.dataTransfer.files[0]);
        return false;
    };
}

function dragSingle(file){
    var reader = new FileReader();

    reader.onload = function (event) {
        // Uglify occasionally inserts \x01 for some reason.
        var isBinary = /[\x00\x02-\x08\x0E-\x1F]/.test(event.target.result);
        if(isBinary){
            window.bin = event.target.result;
            message('Binary file detected. Loading as base64.');
            reader.readAsDataURL(file);
        } else {
            editor.setValue('');
            detectContentType(file.name,event.target.result);
            editor.setValue(event.target.result);
        }
    };
    
    reader.readAsText(file);
}



function detectContentType(filename, content){
    var format;
    format = detectContentTypeFromExtension(filename);
    if(!format){
        format = detectContentTypeFromContent(content);
    }
    if(!format){
        format = 'Text';
    }
    changeFormat(format);
}
function detectContentTypeFromExtension(filename){
    for(var i in formats){
        if(filename.match(formats[i].filename)){
            return i;
        }
    }
}
function detectContentTypeFromContent(content){
    var round1 = [
        // Matches an initial /* comment */ and subsequent function def.
        {
            test : /^\/\*(.|\n)+function\s*\(/,
            type : 'JavaScript'
        },
        {
            test : /^\s*</,
            type : 'XML'
        },
        {
            test : /<html(.*?)?>/,
            type : 'HTML'
        },
        {
            test : /^\s*{/,
            type : 'JSON'
        },
        {
            test : /function\s*\(/,
            type : 'JavaScript'
        },
        {
            test : /@import/,
            type : 'CSS'
        },
        // Matches something like "foo {", a syntax you'd likely
        // not find elsewhere
        // False positive on var a=\n//foo\n{a:b}
        {
            test : /\w+\s*\{/,
            type : 'CSS'
            
        },
        // Matches assignment, excluding something like the CSS syntax [foo=bar]
        // False positive on something like @import("/foo?a=b")
        {
            test : /\s[^'"\[]+\=/,
            type : 'JavaScript'
        }
        
    ];
    
    for(var i=0; i<round1.length; i++){
        if(content.match(round1[i].test)){
            return round1[i].type;
        }
    }
    
    return false;
    
}
    
function bytesToDisplay(bytes,units){
    return Math.round((bytes)/10.24)/100 + (units ? ' KB' : '');
}

function message(msg){
    $('.status.message').text(msg);
}

$(document).ready(function(){
    $(window).resize();
    editor = ace.edit('editor');
    editor.setTheme('ace/theme/chrome');
    var session = editor.getSession();
    session.setMode('ace/mode/text');
    session.setUseWrapMode(true);
    session.setWrapLimitRange(null, null);
    editor.renderer.setPrintMarginColumn(80);
    editor.focus();

    editor.on('paste',function(content){
        // Break out so the editor can actually have the new value set.
        setTimeout(function(){
            detectContentType('',editor.getValue());
        });
    });
    
    editor.on('change',function(content){
        $('.status.format').text($('.formats').val());
        message(bytesToDisplay(editor.getValue().length,true));
    });

    for(var i in formats){
        $('.formats').append('<option>'+formats[i].name+'</option>')
    };
    $('.formats').change(formatChange);
    changeFormat('Text');

    $('button.action').click(performAction);
    initDrag();

});

$(window).resize(function(){
    var bodyHeight = $(window).innerHeight()
    $('body').height(bodyHeight);
    $('#editor').height(bodyHeight - $('.navbar-static-top').outerHeight() - $('.navbar-fixed-bottom').outerHeight());
});


$(window).focus(function(){
    editor.focus();
});


function postMessage(message){
    var i = document.getElementById('if');
    i.contentWindow.postMessage(message, '*');
}

window.addEventListener('message', function(event) {
    var output = event.data.response.output;
    var error = event.data.response.error;
    editor.setValue(output);
    if(error){
        message(error);
    } else {
        message('New size: '+bytesToDisplay(output.length,true)+
            ', saving '+bytesToDisplay(before - output.length,true));
    }
});