// Filename: app

(function (window) {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var collection,
            inputArea;

        if ($.features.fileApi) {

            collection = new window.app.collections.Pictures();
            inputArea = new window.app.collections.Files();

        } else {
            console.log('The File APIs are not supported in this browser.');
        }

    }, false);

}(window));