// Globals and general ugliness.
var $ = require('jquery');
window.jQuery = $;
require('../../node_modules/bootstrap/dist/js/bootstrap.min.js');

// note: html-minifier needs to have './htmlparser' replaced with 'htmlparser'

// Ace editor
var ace = require('brace');
require('brace/mode/javascript');
require('brace/mode/xml');
require('brace/mode/css');
require('brace/mode/json');
require('brace/mode/html');
require('brace/ext/searchbox');
require('brace/theme/chrome');

var editor;

// Formats we support.
var formats = {
    Text: {
        name: 'Text',
        filename: /\.txt$/,
        parser: 'text',
        actions: []
    },
    Javascript: {
        name: 'Javascript',
        filename: /\.js$/,
        parser: 'js',
        actions: ['compress','prettify']
    },
    HTML: {
        name: 'HTML',
        filename: /\.html?$/,
        parser: 'html',
        actions: ['compress','prettify']
    },
    CSS: {
        name: 'CSS',
        filename: /\.js$/,
        parser: 'css',
        actions: ['compress','prettify']
    },
    XML: {
        name: 'XML',
        filename: /\.xml$/,
        parser: 'xml',
        actions: ['compress','prettify']
    },
    JSON: {
        name: 'JSON',
        filename: /\.json$/,
        parser: 'json',
        actions: ['compress','prettify']
    },
};

function formatChange(){
    var format = $('.formats').val();
    var $actions = $('.action').attr('disabled','disabled');
    formats[format].actions.forEach(function(action){
        $actions.filter('.'+action).removeAttr('disabled');
    })
}

function performAction(){
    var format = $('.formats').val();
    var action = $(this).data('action');
    postMessage({
        lang: formats[format].parser,
        direction: action,
        input: editor.getValue(),
    });
    return false;
}

function postMessage(message){
    var i = document.getElementById('if');
    i.contentWindow.postMessage(message, '*');
    console.log('posted');
}

$(document).ready(function(){
    for(var i in formats){
        $('.formats').append('<option>'+formats[i].name+'</option>')
    };
    $('.formats').change(formatChange);

    $('button.action').click(performAction);
    $(window).resize();

    editor = ace.edit('editor');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setTheme('ace/theme/chrome');
});

$(window).resize(function(){
    var bodyHeight = $(window).innerHeight()
    $('body').height(bodyHeight);
    $('#editor').height(bodyHeight - $('.navbar-static-top').outerHeight() - $('.navbar-fixed-bottom').outerHeight());
});

window.addEventListener('message', function(event) {
    console.log('replied',event.data.response.message);
    editor.setValue(event.data.response.output);
});