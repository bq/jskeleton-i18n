(function(root, factory) {
    'use strict';

    /*globals require, define, module */

    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define(['jskeleton', 'i18next', '_', '$'], function(JSkeleton, i18Next, _, $) {
            return factory.call(root, root, JSkeleton, i18Next, _, $);
        });
    } else if (typeof module !== 'undefined' && module.exports) {

        var JSkeleton = require('jskeleton'),
            _ = require('_'),
            $ = require('$'),
            i18Next = require('i18next');

        module.exports = factory(root, JSkeleton, i18Next, _, $);

    } else if (root !== undefined) {
        factory.call(root, root, root.Jskeleton, root.i18next, root._, root.$);
    }

})(this, function(root, JSkeleton, i18Next, _, $) {

    'use strict';

    //Set initial i18next configuration
    var config = _.extend({
        getAsync: true,
        lang: 'es-ES',
        cookieName: 'lang',
        load: 'current',
        escapeInterpolation: true,
        fallbackLng: 'es-ES',
        resGetPath: 'res/locales/__lng__/locales.json'
    }, JSkeleton.common.get('i18n'));



    JSkeleton.i18n = {

        // i18n initialization
        initialize: function(lang) {
            this.lang = lang || this.getInitLang();

            localStorage.setItem('lang', this.lang);

            return new JSkeleton.Promise(function(resolve) {

                $.i18n.init(config, function() {
                    resolve($.i18n);
                });

                //Expose i18n as dependency
                JSkeleton.di.inject({
                    i18n: $.i18n
                });

            });

        },

        // Gets detected language
        getInitLang: function() {
            var lang = localStorage.getItem('lang');

            if (!lang) {
                lang = config.lang;
            }

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
        }

    };

    //Add i18next as JSkeleton.Extension
    JSkeleton.Extension.add('i18n', {
        initialize: true,
        waitBeforeStart: true,
        async: true,
        resolver: JSkeleton.i18n.initialize,
        factory: false
    });


    return JSkeleton.i18n;

});