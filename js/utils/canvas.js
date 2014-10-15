// Filename: utils/canvas

(function (window) {
    'use strict';

    /**
     *
     * Simple helper that render thumbnails of images.
     *
     * Decoupled for sake of SRP or future extensions
     *
     */
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    canvas.width = canvas.height = 150;

    // no need to create canvas for every picture instance
    window.app.utils.Canvas = {

        getThumbnail: function (params) {
            ctx.drawImage(
                params.img,
                params.leftOffset,
                params.topOffset,
                params.thumbWidth,
                params.thumbHeight
            );

            return canvas.toDataURL();
        }
    };


}(window));