// Filename: views/mixins/keyboardListener

(function (window) {
    'use strict';

    /**
     *
     * Object is helping to handle keyboard events.
     * It is really simple.
     *
     * @constructor
     */
    function KeyboardListener() {
        this.keysObserved = {};
    }

    KeyboardListener.prototype = {
        constructor: KeyboardListener,

        codeBase: {
            'left': 37,
            'right': 39
        },

        addKeyboardListener: function (code, callback, type) {
            var mode = type || 'keyup',
                number = this.getCode(code),
                self = this;

            function init(type) {
                if (!self.keysObserved[type]) {
                    self.keysObserved[type] = [];
                    document.body.addEventListener(type, self.keyPressed.bind(self), false);
                }
            }

            if (!this.keysObserved[mode]) {
                init(mode);
            }

            if (!!number) {
                this.keysObserved[mode][number] = callback;
            }
        },

        keyPressed: function (e) {
            if (this.keysObserved[e.type][e.keyCode]) {
                this.keysObserved[e.type][e.keyCode].call(this, e);
            }
        },

        removeKeyboardListener: function (type, code) {
            if (!this.keysObserved[type]) {
                var number = this.getCode(code);

                if (!!number) {
                    delete this.keysObserved[type][code];
                }
            }
        },

        getCode: function (code) {
            return isNaN(code) ? this.codeBase[code] : code;
        }
    };

    window.app.views.mixins.KeyboardListener = KeyboardListener;

}(window));