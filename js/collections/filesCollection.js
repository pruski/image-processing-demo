// Filename: collections/files

(function (window) {
    'use strict';


    /**
     *
     * This object handles files selected by user.
     * After processing, sends them to Pictures collection
     * as dataURL.
     *
     * @constructor
     */
    function Files() {
        this.view = new window.app.views.Files(this, $('fileInput'));
    }

    Files.prototype = {
        /**
         * 
         * Names of methods that should be performed on every item 
         * selected by user.
         * 
         * Methods must return the file (may be modified) or 
         * false, if file did't pass the test.
         * 
         */
        testSuite: ['isFileNotEmpty', 'isNotDirEntry'],


        /**
         *
         * Called by FilesView
         *
         * @param {Event} e Passed from the view
         */
        filesSelected: function (e) {
            var selection;
            if (e.dataTransfer && e.dataTransfer.items) {
                this.testSuiteLength = this.testSuite.length;
                selection = e.dataTransfer.items;

            } else {
                this.testSuiteLength = this.testSuite.length - 1;
                // if can't check directory entries,
                // skip "isNotDirEntry" test, because it's not

                selection = e.target.files;
            }

            this.prefilterSelection($.slice(selection));
        },


        /**
         *
         * Loops entire collection, performs set of tests on every item
         *
         * Tests are defined in testSuite property as method names to be called
         *
         * @param files
         */
        prefilterSelection: function (files) {
            var filteredSelection = [],
                self = this,
                i;

            files.forEach(function (file) {
                i = self.testSuiteLength;

                while (file !== false && i > 0) {
                    // loop through tests from testSuite
                    file = self[self.testSuite[i - 1]](file);
                    i -= 1;
                }

                if (file) {
                    // if still file, store it
                    filteredSelection.push(file);
                }
            });

            if (filteredSelection.length) {
                this.readFiles(filteredSelection);

            } else {
                // if all files were removed, enable selection
                this.view.processingCompleted();
            }
        },

        /**
         *
         * Returns file if not empty, or false otherwise
         *
         * @param file
         *
         */
        isFileNotEmpty: function (file) {
            if (file.size > 0) {
                return file;
            }

            return false;
        },

        /**
         *
         * Returns false if Entry is a directory,
         * or converts it to File and returns
         *
         * @param Entry
         *
         */
        isNotDirEntry: function (entry) {
            if (!entry.webkitGetAsEntry().isDirectory) {
                return entry.getAsFile();
            }

            return false;
        },

        /**
         *
         * Send list to the web worker for further processing
         *
         * @param files
         */
        readFiles: function (files) {
            if (!this.worker) {
                this.createWorker();
            }

            this.worker.postMessage(files);
        },

        /**
         *
         * Creates web worker instance and registers listener
         *
         */
        createWorker: function () {
            this.worker = new Worker('js/workers/fileReader.js');

            this.worker.addEventListener('message', this.processFilteredFiles.bind(this));
        },

        /**
         *
         * Receives files filtered by worker and distributes it
         * through an event channel if not empty.
         *
         * @param {urlData} workerResponse.data Raw image data.
         */
        processFilteredFiles: function (workerResponse) {
            if (workerResponse.data.length > 0) {
                // if there are valid files in the list, send them
                $.vent.trigger('files:selected', workerResponse.data);
            } else {
                // if all files were removed, enable selection
                this.view.processingCompleted();
            }
        }

    };

    window.app.collections.Files = Files;

}(window));