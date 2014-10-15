// Filename: views/thumbs

(function (window) {
    'use strict';

    var HorizontalList = window.app.views.mixins.HorizontalList,
        KeyboardListener = window.app.views.mixins.KeyboardListener,
        BufferedView = window.app.views.mixins.BufferedView;


    /**
     *
     * Object responsible for presenting a collection of pictures.
     * Extends functionality of HorizontalList and it's predecessors.
     *
     * @param element
     * @constructor
     */
    function Thumbs(element) {
        HorizontalList.call(this, 800, 150, 5);

        this.el = element;
        this.el.addEventListener('click', this.click, false);
    }

    Thumbs.prototype = Object.create(HorizontalList.prototype);

    $.extend(Thumbs.prototype, {
        constructor: Thumbs,

        // own methods

        // catches click event and fires callback on target element
        click: function (e) {
            e.preventDefault();
            e.target.clickCallback(e);
        },

        // after activating keyboard funcionality,
        // shows user an info about it
        // and hides it once he gets it
        keyboardHelper: function () {
            this.keyboardHelperCounter -= 1;
            if (this.keyboardHelperCounter < 1) {
                this.closeKeyboardHelper();
            }
        },

        closeKeyboardHelper: function () {
            $('info').className = "";
            this.removeKeyboardListener('keyup', 'left');
            this.removeKeyboardListener('keyup', 'right');
            delete this.keyboardHelperCounter;
        },

        // HorizontalListView methods overrides, to add some own logic

        releaseBufferedElements: function () {
            HorizontalList.prototype.releaseBufferedElements.call(this);

            // feedback to filesView, so it can enable ui
            $.vent.trigger('files:displayed');
        },

        initKeyboard: function () {
            // I think it should belong here, as every KeyboardListener's user
            //  may do it different way. or not at all.
            $('info').className = "keyboard";
            HorizontalList.prototype.initKeyboard.call(this);

            this.keyboardHelperCounter = 4;
            this.addKeyboardListener('left', this.keyboardHelper, 'keyup');
            this.addKeyboardListener('right', this.keyboardHelper, 'keyup');
        }
    });

    window.app.views.Thumbs = Thumbs;

}(window));