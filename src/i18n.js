(function(root, factory) {
    'use strict';

    /*globals require, define, module */

    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define(['jskeleton', 'i18next', 'underscore', 'jquery'], function(JSkeleton, i18Next, _) {
            return factory.call(root, root, JSkeleton, i18Next, _);
        });
    } else if (typeof module !== 'undefined' && module.exports) {

        var JSkeleton = require('jskeleton'),
            _ = require('underscore'),
            i18Next = require('i18next');

        module.exports = factory(root, JSkeleton, i18Next, _);

    } else if (root !== undefined) {
        factory.call(root, root, root.JSkeleton, root.i18next, root._);
    }

})(this, function(root, JSkeleton, i18next, _) {

    'use strict';

    //Set initial i18next configuration merged with the application i18n config settings
    var config = _.extend({
        getAsync: true,
        cookieName: 'lang',
        load: 'current',
        escapeInterpolation: true,
        fallbackLng: 'es-ES',
        resGetPath: 'res/locales/__lng__/locales.json'
    }, JSkeleton.common.get('i18n'));



    JSkeleton.i18n = {

        // i18n initialization
        initialize: function(lang) {
            //Get the initial lang from local storage, application config or navigator lang
            this.lang = lang || this.getInitLang();

            //Set the language into the local storage
            localStorage.setItem('lang', this.lang);

            //Return a promise to resolve the extension async
            return new JSkeleton.Promise(function(resolve) {


                //Initialize the i18n with the specified config
                i18next.init(config, function() {

                    resolve(JSkeleton.i18n);
                    //Expose i18n object as dependency
                    JSkeleton.di.inject({
                        i18n: JSkeleton.i18n
                    });

                    // helper i18n
                    JSkeleton.i18n.registerHelper();

                });

            });

        },

        // Gets detected language
        getInitLang: function() {
            //try to get the lang from the local storage first
            var lang = localStorage.getItem('lang');


            //get the language from the application settings
            if (!lang) {
                lang = config.lang;
            }

            //if no lang is sets, try to get it from the navigator object
            if (!lang) {
                // Explorer || FF
                lang = navigator.userLanguage || navigator.language;
            }

            return lang;
        },

        //Gets detected language, a proxy method of getInitLang())
        getLang: function() {
            return this.getInitLang();
        },

        // Sets a specific langage.
        // Trigggers a 'locale:changed' event
        setLang: function(lang) {
            this.lang = lang;

            localStorage.setItem('lang', lang);

            this.changed();
        },

        //Locales changed handler
        //By default, it refresh the page
        changed: function() {
            window.location.reload();
        },

        // register helper
        registerHelper: function() {
            JSkeleton.registerHelper('i18n', function(params, env, args) {

                /**
                 * Helpers for i18next
                 * @example
                 * {{ i18n "key" }}
                 * {{ i18n "key" "{ count: 1 }" }} => count is { count: 1 }
                 * @param  {String} context
                 * @param  {Object} options optional parameter to localization (like count, or context)
                 * @return {String} Localized String
                 */

                var options = args[1] ? JSkeleton.Utils.stringToObject(args[1]) : {};

                return i18next.t(args[0], options);

            });
        },

        // translator
        t: function(key, options) {
            return i18next.t(key, options || {});
        }

    };

    //Add i18next as JSkeleton.Extension
    JSkeleton.extension.add('i18n', {
        async: true,
        promise: JSkeleton.i18n.initialize(),
        factory: false,
        beforeStartHook: true
    });


    return JSkeleton.i18n;

});