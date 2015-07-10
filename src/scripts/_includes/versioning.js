var pkg = require('../../../package.json');
var packages = [
    require('../../../node_modules/uglify-js/package.json'),
    require('../../../node_modules/clean-css/package.json'),
    require('../../../node_modules/html-minifier/package.json'),
    require('../../../node_modules/js-beautify/package.json'),
    require('../../../node_modules/pretty-data/package.json'),
];

module.exports = function(){
    $('.modal .version').text(pkg.version);

    var $table = $('<tbody></tbody>');

    var $template = $('<tr><th><a href="#" target="_blank"></a></th><td></td><td></td><td></td></tr>');

    packages.forEach(function(pkg){
        var $row = $template.clone().appendTo($table);
        var license = pkg.license.type || pkg.license;
        var author = pkg.author.name || pkg.author;
        $row.find('a')
                .attr('href', pkg.homepage).text(pkg.name)
                .end()
            .find('th')
            .next()
            .text('v'+pkg.version);
            // .next()
            // .text(author)
            // .next()
            // .text(license);
    });

    $('#software-table').append($table);
};
