// Filename: models/picture

(function (window) {
    'use strict';

    /**
     *
     * Creates image thumbnail and a view, to display it.
     *
     *
     * @param dataUrl
     * @param parentView
     * @constructor
     */
    function Picture(dataUrl, parentView) {
        this.srcDataUrl = dataUrl;
        this.parentView = parentView;

        this.createThumbnail();
    }

    Picture.prototype = {
        // uses Canvas object singleton
        canvas: window.app.utils.Canvas,


        /**
         *
         * Thumbnail creation must be performed asynchronously,
         * therefore methods are hidden, so no one can call them
         * in a bad sequence
         *
         */
        createThumbnail: function () {
            var self = this;

            function getThumbnailParams() {
                var ratio,
                    thumbWidth,
                    thumbHeight,
                    leftOffset,
                    topOffset,
                    params;

                if (self.srcWidth > self.srcHeight) {
                    thumbHeight = 150;
                    ratio = 150 / self.srcHeight;
                    thumbWidth = Math.round(self.srcWidth * ratio);
                    leftOffset = -1 * Math.round((thumbWidth - 150) / 2);
                    topOffset = 0;
                } else {
                    thumbWidth = 150;
                    ratio = 150 / self.srcWidth;
                    thumbHeight = Math.round(self.srcHeight * ratio);
                    topOffset = -1 * Math.round((thumbHeight - 150) / 2);
                    leftOffset = 0;
                }

                params = {
                    'thumbWidth': thumbWidth,
                    'thumbHeight': thumbHeight,
                    'leftOffset': leftOffset,
                    'topOffset': topOffset,
                    'img': self.img
                };

                return params;
            }

            function renderThumbnail() {
                self.thumbnail = self.canvas.getThumbnail(
                    getThumbnailParams()
                );

                // images can be really big,
                // don't keep them too long
                delete self.img;
                self.createView();
            }

            function srcImageReady() {
                self.srcWidth = self.img.naturalWidth || self.img.width;
                self.srcHeight = self.img.naturalHeight || self.img.height;

                renderThumbnail();
            }

            this.img = document.createElement('img');
            this.img.addEventListener('load', srcImageReady.bind(this));
            this.img.src = this.srcDataUrl;
        },

        createView: function () {
            this.view = new window.app.views.Picture(this);
        }

    };

    window.app.models.Picture = Picture;

}(window));