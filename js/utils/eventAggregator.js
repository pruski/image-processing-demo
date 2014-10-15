// Filename: utils/eventAggregator

(function (global) {
    'use strict';

        /**
         *
         * Event aggregator, Pub/Sub convention.
         *
         * Uses strings to determine event types.
         * Adds _evtAggId property to listening objects
         *
         * */
    var aggregator = {

            /**
             *
             * Array of registered listeners. It's structure:
             *
             * listeners[ 'event type' ][ 'object's unique id' ] = { callback, context };
             *
             *
             * Note that object can register only one listener for particular
             * event type. Another try overrides previous value.
             *
             */
            listeners: {},


            /**
             *
             * Map of object's registered listeners. Useful when unbinding
             * all of them at once. It's structure:
             *
             * contexts[ 'object's unique id' ][ 'event type' ];
             *
             */
            contexts: {},


            /**
             *
             * A counter used to generate unique id.
             *
             */
            counter: 0,


            trigger: function (eventType) {
                if (typeof eventType === 'string' && eventType.length > 0 && this.listeners[eventType]) {

                    this.triggerListeners(eventType, $.slice(arguments, 1));

                }
            },


            triggerListeners: function (eventType, args) {
                var callbacks = this.listeners[eventType],
                    key;

                for (key in callbacks) {
                    if (callbacks.hasOwnProperty(key)) {
                        callbacks[key].callback.apply(callbacks[key].context, args);
                    }

                }
            },


            on: function (eventType, callback, context) {
                if (context && typeof eventType === 'string' && eventType.length > 0 && typeof callback === 'function') {

                    this.addListener(eventType, callback, context);

                }
            },


            addListener: function (eventType, callback, context) {
                this.addContext(context, eventType);

                this.listeners[eventType] = this.listeners[eventType] || {};
                this.listeners[eventType][context._evtAggId] = {callback: callback, context: context};

            },


            /**
             *
             * Adds new listener to object listener's map. Generates unique id if needed.
             *
             */
            addContext: function (context, eventType) {
                var ctxEvents;

                context._evtAggId = context._evtAggId || this.getUniqueId();

                ctxEvents = this.contexts[context._evtAggId] = this.contexts[context._evtAggId] || [];

                if (ctxEvents.indexOf(eventType) < 0) {

                    ctxEvents.push(eventType);

                }
            },


            getUniqueId: function () {
                this.counter += 1;
                return 'ctx' + this.counter;

            },

            off: function (context, eventType) {
                var ctxId = context && context._evtAggId;

                if (ctxId) {
                    if (typeof eventType === 'string' && eventType.length > 0) {
                        this.unbind(ctxId, eventType);

                    } else {

                        this.unbindAll(ctxId);

                    }
                }
            },

            unbindAll: function (ctxId) {
                var self = this;

                this.contexts[ctxId].forEach(function (eventType) {
                    self.unbind(ctxId, eventType);

                });

                delete this.contexts[ctxId];

            },

            unbind: function (ctxId, eventType) {
                delete this.listeners[eventType][ctxId];

                if (!this.listeners[eventType].length) {
                    delete this.listeners[eventType];

                }
            }
        };


    /** Expose public api */
    global.$.vent = {

        on: aggregator.on.bind(aggregator),

        off: aggregator.off.bind(aggregator),

        trigger: aggregator.trigger.bind(aggregator)

    };

}(this));