// Filename: views/picture

(function (window) {
    'use strict';

    /**
     *
     * Responsible for presenting picture.
     *
     * Puts image into thumbnails list, and
     * opens new window, to display full size,
     * when clicked
     *
     * @constructor
     * @param {Picture} model
     *
     */
    function Picture(model) {
        this.model = model;

        this.render();
    }



    Picture.prototype = {

        template: '<img src="{{src}}" />',
        tagName: 'li',

        render: function () {
            this.el = document.createElement(this.tagName);
            this.el.innerHTML = $.render(
                this.template,
                {src: this.model.thumbnail}
            );


            this.el.getElementsByTagName('img')[0].clickCallback = this.showFullImage.bind(this);
            // events are delegated to collection view
            // to setup one listener instead of X
            //
            // attach click callback to node, so parent view don't have to
            // find coresponding model


            this.model.parentView.appendChild(this.el);
        },

        showFullImage: function () {
            var options = 'menubar=no,' +
                'location=no,' +
                'resizable=no,' +
                'scrollbars=no,' +
                'status=yes,' +
                'width=' + this.model.srcWidth +
                ',height=' + this.model.srcHeight;

            window.open(this.model.srcDataUrl, '', options);
        }
    };

    window.app.views.Picture = Picture;

}(window));