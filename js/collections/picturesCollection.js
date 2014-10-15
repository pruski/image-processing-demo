// Filename: collections/pictures

(function (window) {
    'use strict';

    var Picture = window.app.models.Picture;

    /**
     *
     * Creates empty collection of Pictures. When published,
     * gets raw dataURL collection, and stores it as Picture models.
     *
     * @constructor
     *
     */
    function Pictures() {
        this.pictures = [];
        this.view = new window.app.views.Thumbs($('thumbs'));

        // setup event listener
        // triggered by collections/files
        $.vent.on('files:selected', this.addPictures, this);
    }

    Pictures.prototype = {

        addPictures: function (files) {
            files.forEach(this.createPicture.bind(this));
        },

        createPicture: function (dataUrl) {
            this.pictures.push(new Picture(dataUrl, this.view));
        }

    };

    window.app.collections.Pictures = Pictures;


}(window));