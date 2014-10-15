// Filename: views/mixins/horizontalList

(function (window) {
    'use strict';

    var KeyboardListener = window.app.views.mixins.KeyboardListener,
        BufferedView = window.app.views.mixins.BufferedView;


    /**
     *
     * Object handles animations of a list of elements
     * in a generic way. Extends BufferedView
     * and KeyboardListener functionality.
     *
     * @param wrapperWidth
     * @param itemWidth
     * @param itemMargin
     * @constructor
     */
    function HorizontalList(wrapperWidth, itemWidth, itemMargin) {
        KeyboardListener.call(this);
        BufferedView.call(this);

        this.isScrollable = false;

        this.wrapperWidth = wrapperWidth;
        this.distance = ~~(wrapperWidth / 4 * 3);
        this.listWidth = -1 * itemMargin;
        this.itemWidth = itemWidth + itemMargin;
        this.offset = 0;
    }

    HorizontalList.prototype =  Object.create(BufferedView.prototype);

    $.extend(
        HorizontalList.prototype,
        KeyboardListener.prototype,

        {
            constructor: HorizontalList,

            // own methods
            moveLeft: function () {
                this.offset -= this.distance;

                if (this.offset + this.listWidth < this.wrapperWidth) {
                    this.offset = -1 * (this.listWidth - this.wrapperWidth);
                }

                this.move();
            },

            moveRight: function () {
                this.offset += this.distance;

                if (this.offset > 0) {
                    this.offset = 0;
                }

                this.move();
            },

            moveEnd: function () {
                if (this.isScrollable) {
                    this.offset = -1 * (this.listWidth - this.wrapperWidth);
                    this.move();
                }
            },

            move: function () {
                this.el.style.left = this.offset + "px";
            },

            initKeyboard: function () {
                this.isScrollable = true;

                this.addKeyboardListener('left', this.moveLeft, 'keydown');
                this.addKeyboardListener('right', this.moveRight, 'keydown');
            },

            // BufferedView methods override, to add some own logic

            appendChild: function (item) {
                this.listWidth += this.itemWidth;
                BufferedView.prototype.appendChild.call(this, item);
            },

            releaseBufferedElements: function () {
                this.el.style.width = this.listWidth + "px";

                BufferedView.prototype.releaseBufferedElements.call(this);

                if (!this.isScrollable && this.listWidth > this.wrapperWidth) {
                    this.initKeyboard();
                }

                this.moveEnd();
            }
        }
    );
    
    window.app.views.mixins.HorizontalList = HorizontalList;
    
}(window));