requirejs.config({
	baseUrl: '/viewjs',
    urlArgs: '20160930',
	paths: {
		backbone: 'lib/backbone',
		underscore: 'lib/underscore',
		jquery: 'lib/jquery',
		backboneLocalStorage: 'lib/backbone.localStorage',
        text: 'lib/plugins/text',
        css: 'lib/plugins/css.min',
        'jAlert': 'lib/jquery.alerts'
	},
	shim: {
		backbone: {
            deps: ['jquery', 'underscore', 'jAlert'],
			exports: 'Backbone'
        },
		underscore: {
			exports: '_'
        },
        jAlert: ['jquery']
	}
});
(function () {
    require(['main'], function (App) {
        new App().authAndLoad();
    });
})();
