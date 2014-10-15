// Filename: workers/fileReader

(function () {
    'use strict';

    var reader = new FileReaderSync(),

        /**
         *
         * Collection of acceptable MIME types as keys, and
         * sets of their corresponding hexadecimal values,
         * better known as 'magic number'.
         *
         */
        acceptableMIMETypes = {
            'image/jpeg': [ 0xffd8 ],
            'image/png': [ 0x8950, 0x4e47, 0x0D0A, 0x1A0A ]
        };

    /**
     *
     * Creates pseudo iterator that reads from given <tt>file</tt>
     * 2 bytes every iterator.next() call. Call iterator.reset()
     * to start reading <tt>file</tt> from the beginning.
     *
     * @param file A file to read from.
     *
     * @returns {object} iterator
     *
     */
    function getHexIterator(file) {
        var offset = -2,
            buffer = reader.readAsArrayBuffer(file),
            dataView = new DataView(buffer);

        return {

            next: function () {
                // return next 2 bytes

                offset += 2;
                try {
                    return dataView.getUint16(offset);

                } catch (e) {
                    // or false, if offset > file.length
                    return false;

                }
            },

            reset: function () {
                offset = -2;
            }
        };
    }


    /**
     *
     * MIME type determined by browsers is based on the file extension -_-
     *
     * Read bytes from the beginning of the <tt>file</tt> and compare them with
     * values stored in acceptableMIMETypes collection. If match, return key.
     *
     * @param file
     *
     * @returns {string} MIME type or false
     *
     */
    function readMIMEType(file) {
        var hexIterator,
            mimeType,
            howManyHexes,
            n;

        try {
            // In case of big collection, blobs may be missing,
            // I guess it's connected to memory management.
            hexIterator = getHexIterator(file);

        } catch (e) {
            // It's just a demo, so I'll skip it
            return false;
        }

        for (mimeType in acceptableMIMETypes) if (acceptableMIMETypes.hasOwnProperty(mimeType)) {
            // for every defined MIME type

            howManyHexes = acceptableMIMETypes[mimeType].length;
            // check how long is its hex signature

            for (n = 0; n < howManyHexes; n += 1) {
                // and compare hex by hex with current file
                
                if (hexIterator.next() !== acceptableMIMETypes[mimeType][n]) {
                    // if any of compared pairs doesn't match
                    // it must be some other type
                    break;
                }
            }

            if (n === howManyHexes) {
                // but if all of them matched, accept file
                return mimeType;
            }

            hexIterator.reset();
            // otherwise move iterator back to the beginning
            // and try another type from the collection
        }

        return false;
        // if all comparsions failed, reject file
    }

    /**
     *
     * Check if type 'detected' by browser is accurate.
     *
     *
     * @param {string} dataUrl
     * @param {string} MIMEType
     *
     * @returns {boolean}
     */
    function hasProperMIMEType(dataUrl, MIMEType) {
        var regex = new RegExp('^data:' + MIMEType + ';');
        return regex.test(dataUrl);
    }


    /**
     *
     * Set MIME type if incorrect or empty.
     *
     * @param {string} MIMEType Expected MIME type.
     * @param {string} dataUrl
     *
     * @returns {string} dataUrl with corrected MIME type.
     *
     */
    function correctMIMEType(dataUrl, MIMEType) {
        return dataUrl.replace(/[^;]*/, 'data:' + MIMEType);
    }


    /**
     *
     * Event listener. Expects a list of files to be cleaned of non-image files,
     * converted to dataUrl format and sent back. List of files should be
     * accessible via e.data property.
     *
     * @param {MessageEvent} e
     *
     */
    function getValidImages(e) {
        var files = e.data || [],
            images = [];

        if (!(files instanceof Array)) {
            files = Array.prototype.slice.call(files);
        }

        files.forEach(function (file) {
            var mimeType = readMIMEType(file),
                dataUrl;

            if (mimeType) {

                dataUrl = reader.readAsDataURL(file);

                if (!hasProperMIMEType(dataUrl, mimeType)) {
                    dataUrl = correctMIMEType(dataUrl, mimeType);
                }

                images.push(dataUrl);
            }

        });

        self.postMessage(images);

    }

    self.addEventListener('message', getValidImages, false);

}());