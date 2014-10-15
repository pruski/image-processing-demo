// Filename: views/files

(function (window) {
    'use strict';


    /**
     * 
     * Object allows a user to select or drop image files
     * to be displayed within the app. 
     * 
     * 
     * @param {FilesCollection} model
     * @param element
     * @constructor
     */
    function Files(model, element) {
        this.model = model;
        this.el = element;
        this.infoEl = this.el.nextElementSibling;
        this.isProcessing = false;

        this.delegateEvents();

    }

    Files.prototype = {

        processingText: "Processing...",
        infoText: "Click or drop pictures here",

        // trggered when user select or drop files
        filesSelected: function (e) {
            e.preventDefault();

            // if already processing, reject request
            if (this.isProcessing) {
                return false;
            }

            // inform user that received files
            this.infoEl.className = 'filesSelected';
            this.infoEl.innerHTML = this.processingText;
            setTimeout(this.revertBackground.bind(this), 300);

            // block ui, if he put 200 files he can't handle waiting
            // and add more to queue
            this.undelegateUIEvents();
            this.isProcessing = true;

            // triggered by views/thumbs
            $.vent.on('files:displayed', this.processingCompleted, this);

            this.model.filesSelected(e);

        },

        handleClick: function (e) {
            if (this.isProcessing) {
                e.preventDefault();
            }
        },

        processingCompleted: function () {
            $.vent.off(this);
            this.infoEl.innerHTML = this.infoText;
            this.isProcessing = false;
            this.delegateUIEvents();
        },

        revertBackground: function () {
            this.infoEl.className = '';
        },

        lowlight: function () {
            this.el.className = '';
        },

        highlight: function () {
            this.el.className = 'hover';
        },

        delegateEvents: function () {
            // set up file input listeners
            this.el.addEventListener('change', this.filesSelected.bind(this), false);
            this.el.addEventListener('click', this.handleClick.bind(this), false);

            // can't find info which versions will fire change event on drop
            this.el.addEventListener('drop', this.filesSelected.bind(this), false);

            this.delegateUIEvents();
        },

        delegateUIEvents: function () {
            this.el.addEventListener('mouseover', this.highlight.bind(this), false);
            this.el.addEventListener('dragover', this.highlight.bind(this), false);
            this.el.addEventListener('mouseout', this.lowlight.bind(this), false);
            this.el.addEventListener('dragleave', this.lowlight.bind(this), false);
        },

        undelegateUIEvents: function () {
            this.el.removeEventListener('mouseover', this.highlight, false);
            this.el.removeEventListener('dragover', this.highlight, false);
            this.el.removeEventListener('mouseout', this.lowlight, false);
            this.el.removeEventListener('dragleave', this.lowlight, false);
        }
    };

    window.app.views.Files = Files;

}(window));