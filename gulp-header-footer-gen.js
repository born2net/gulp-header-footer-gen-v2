/////////////////////////////////////////////
//
// gulp-header-footer-gen
//
// Generate html web pages and inject
// the header and footer from index.html
// 
// >>> updated 7-27-2021
//
//
// ///////////////////////////////////////////


var fs = require('fs');
// var gutil = require('gulp-util');
// var PluginError = gutil.PluginError;
// var PluginError = require('plugin-error');
var through = require('through2');
var template;

const PLUGIN_NAME = 'gulp-header-footer-gen';

module.exports = function (filePath) {
    return through.obj(function (file, encoding, next) {
        loadTemplate(file, filePath, encoding, next);
    });
};

function loadTemplate(file, filePath, encoding, next) {
    if (template) {
        injectContent(file, next);
    } else {
        fs.readFile(filePath, "utf-8", function (err, page) {
            if (err) {
                // next(new PluginError(PLUGIN_NAME, 'problem reading template file'));
                console.log('problem reading template file' + file.history["0"]);
                return;
            }
            console.log('loaded template file');
            template = page.replace(/<!-- MAIN_CONTENT_START -->[\S\s]+<!-- MAIN_CONTENT_END -->/, ':PLACE:');
            injectContent(file, next);
        });
    }
}

function injectContent(file, next) {
    var fileData = file.contents.toString('utf8');
    var match = fileData.match(/<!-- MAIN_CONTENT_START -->([\S\s]+)<!-- MAIN_CONTENT_END -->/);
    if (match == null){
        // next(new PluginError(PLUGIN_NAME, 'did not find the MAIN_CONTENT html tags'));
        console.log('did not find tag while working on ' + file.history["0"]);
        return next(null, file);;
    }
    var finalPage = template.replace(/:PLACE:/, '<!-- MAIN_CONTENT_START -->' + match[1] + '<!-- MAIN_CONTENT_END -->\n');

    finalPage = finalPage.replace(/_css\//ig, "../_css/");
    finalPage = finalPage.replace(/_html\//ig, "../_html/");
    finalPage = finalPage.replace(/_images\//ig, "../_images/");
    finalPage = finalPage.replace(/_js\//ig, "../_js/");



    file.contents = new Buffer(finalPage);
    next(null, file);
}




//
// var fs = require('fs');
// var gutil = require('gulp-util');
// var PluginError = gutil.PluginError;
// var through = require('through2');
// var template;
//
// const PLUGIN_NAME = 'gulp-header-footer-gen';
//
// module.exports = function (filePath) {
//     return through.obj(function (file, encoding, next) {
//         loadTemplate(file, filePath, encoding, next);
//     });
// };
//
// function loadTemplate(file, filePath, encoding, next) {
//     if (template) {
//         injectContent(file, next);
//     } else {
//         fs.readFile(filePath, "utf-8", function (err, page) {
//             if (err) {
//                 next(new PluginError(PLUGIN_NAME, 'problem reading template file'));
//                 return;
//             }
//             console.log('loaded template file');
//             template = page.replace(/<!-- MAIN_CONTENT_START -->[^]+<!-- MAIN_CONTENT_END -->/, ':PLACE:');
//             injectContent(file, next);
//         });
//     }
// }
//
// function injectContent(file, next) {
//     var fileData = file.contents.toString('utf8');
//     var match = fileData.match(/<!-- MAIN_CONTENT_START -->([^]+)<!-- MAIN_CONTENT_END -->/);
//     var title = fileData.match(/<!-- TITLE_NAME: ([^\n]*)(-->)/);
//     if (match == null){
//         // next(new PluginError(PLUGIN_NAME, 'did not find the MAIN_CONTENT html tags ' + file.history[0]));
//         console.log('did not find the MAIN_CONTENT html tags ' + file.history[0]);
//         next(null, file);
//         return;
//     }
//     var finalPage = template.replace(/:PLACE:/, '<!-- MAIN_CONTENT_START -->' + match[1] + '<!-- MAIN_CONTENT_END -->\n');
//     finalPage = finalPage.replace(/"_html/ig, "\"../_html");
//     finalPage = finalPage.replace(/src="_images\//ig, "src=\"/_images/");
//     finalPage = finalPage.replace(/"_css\//ig, "\"../_css/");
//     finalPage = finalPage.replace(/\/videoTutorials\/_common\/_js\//ig, ":TMP12:");
//     finalPage = finalPage.replace(/_js\//ig, "../_js/");
//     finalPage = finalPage.replace(/:TMP12:/ig, "/videoTutorials/_common/_js/");
//
//     if (title){
//         title = '<title>'+title[1]+'</title>';
//         finalPage = finalPage.replace(/<title>([^\n]*)<\/title>/ig, title);
//     }
//
//     file.contents = new Buffer(finalPage);
//     next(null, file);
// }
//
//
