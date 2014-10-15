// Filename: utils/helpers

(function (global) {
    'use strict';

    /**
     *
     * super tiny helper lib
     *
     *
     * */

    var memoized = {};

    // id selector
    function $(id) {
        var el = memoized[id];

        if (!el) {
            el = memoized[id] = document.getElementById(id);
        }
        return el;
    }

    // feature detection
    $.features = {
        fileApi: global.File && global.FileReader && global.FileList && global.Blob
    };

    $.render = function (template, variables) {
        var html = template,
            name,
            regex;

        for (name in variables) if (variables.hasOwnProperty(name)) {
            regex = new RegExp('{{' + name + '}}', 'g');
            html = html.replace(regex, variables[name]);
        }

        return html;
    };

    $.slice = function (collection, offset) {
        offset = offset || 0;
        return Array.prototype.slice.call(collection, offset);
    };

    $.extend = function (target) {
        var srcs = this.slice(arguments, 1);

        srcs.forEach(function (srcObject) {
            var key;

            for (key in srcObject) {

                if (srcObject.hasOwnProperty(key)) {
                    target[key] = srcObject[key];
                }
            }
        });
    };

    global.$ = $;

}(this));