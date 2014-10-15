// Filename: views/mixins/BufferedView

(function (window) {
    'use strict';

    /**
     *
     * Object allows preventing unnecessary repaints/reflows
     * in a generic way. Useful for collections.
     *
     * @constructor
     */
    function BufferedView() {
        this.buffer = [];
    }

    BufferedView.prototype = {
        constructor: BufferedView,

        appendChild: function (child) {
            // if some elements are already awaiting to be injected
            // have them wait for another one
            if (this.buffer.length > 0) {
                clearTimeout(this.timeout);
            }

            // add element to queue
            this.buffer.push(child);

            // wait, there may be next in the line
            this.timeout = setTimeout(this.releaseBufferedElements.bind(this), 50);
        },

        releaseBufferedElements: function () {
            var children = document.createDocumentFragment();

            while (this.buffer.length > 0) {
                children.appendChild(this.buffer.pop());
            }

            this.el.appendChild(children);

        }
    };

    window.app.views.mixins.BufferedView = BufferedView;

}(window));