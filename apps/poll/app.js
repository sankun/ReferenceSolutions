(function($) {
"use strict";

var poll = Echo.App.manifest("Echo.Apps.Poll");

if (Echo.App.isDefined(poll)) return;

poll.init = function() {
	if (!this.checkAppKey()) return;

	this.render();
	this.ready();
};

poll.labels = {
	"signin": "Please sign in..."
};

/**
 * Configuration defaults.
 *
 * NOTE: These defaults must match those defined in the Dashboard template
 * _exactly_. When we receive an app config, if the user sets a setting to its
 * default value, the setting is _removed_. That means if we define a different
 * default here, we will get the default app.js defines, not the default from
 * the dashboard.
 *
 * This is especially confusing for checkboxes. If a checkbox defaults to True
 * in Dashboard and the user has it checked, if we then have it defaulting to
 * false here or simply not defined it will always evaluate to false!
 */
poll.config = {
	appkey: "",
	query: "",

	display: {
		visualization: "pinboard",
		sourcefilter: true,
		replies: true,
		likes: true,
		sharing: false,
		flags: true,
	},

	integration: {
		nativeinterval: 0
	},

	upload: {
		enabled: false,
		fpkey: ""
	},

	auth: {
		enabled: false,
		janrainApp: undefined
	},

	// We don't use this but StreamServer dies if we don't have it
	children: {
		maxDepth: 0,
		itemsPerPage: 15
	},
};

poll.dependencies = [{
	"url": "{config:cdnBaseURL.sdk}/streamserver.pack.js",
	"app": "Echo.StreamServer.Controls.Stream"
}];

poll.templates.main =
	'<div class="{class:container}">' +
		'<div class="{class:stream} {config:display.visualization}"></div>' +
	'</div>';

poll.renderers.stream = function(element) {
	var app = this,
	    plugins = [];

	console.log(app);
	switch (app.config.get('display.visualization')) {
		case "tugofwar":
		case "tugowar":
			plugins.push({
				name: 'TugOfWar',
				url: '//echocsthost.s3.amazonaws.com/apps/poll/visualizations/tug-of-war.js'
			});
			break;
	}


	var query = 'url:' +
	            app.config.get("datasource.specifiedURL") +
				' children:1';

	this.initComponent({
		id: 'Stream',
		component: 'Echo.StreamServer.Controls.Stream',
		config: {
			target: element,
			query: query,
			plugins: plugins,
			slideTimeout: 0,
			infoMessages: { enabled: false },
			state: {
				label: { icon: false, text: false },
				toggleBy: 'none'
			},
			item: {
				infoMessages: { enabled: false },
				reTag: false,
				viaLabel: { icon: false, text: false  }
			}
		}
	});
	return element;
};

poll.css =
	".{class:stream} { clear: both; margin: 0; }" +

	".{class:container} .poll { margin: 0 0 40px 0; text-transform: uppercase; }" +
	".{class:container} .poll .bar { border: 1px solid #777; height: 100px; color: #fff; text-transform: uppercase; position: relative; font-size: 30px; color: #fff; }" +
	".{class:container} .poll .bar > div { position: absolute; top: 0; bottom: 0; left: 0; line-height: 100px; }" +
	".{class:container} .poll .bar .left { z-index: 1; border-right: 1px solid #777; text-align: left; }" +
	".{class:container} .poll .bar .right { z-index: 0; right: 0; text-align: right; }" +
	".{class:container} .poll .bar i { display: block; width: 76px; height: 77px; overflow: hidden; background: url(/sites/all/themes/echocms/layouts/cse/coke_zero/badges.png) 0 0 no-repeat; margin: 12px; }" +
	".{class:container} .poll .bar .left i { float: left; }" +
	".{class:container} .poll .bar .right i { float: right; }" +
	".{class:container} .poll .buttons > a { display: block; padding: 6px 20px; border-radius: 9px; background: #fff; text-decoration: none; font-weight: bold; margin-top: 10px; }" +
	".{class:container} .poll .buttons .left { float: left; margin-left: 20px; }" +
	".{class:container} .poll .buttons .right { float: right; margin-right: 20px; }" +

	".{class:container} .poll .bar .alabama { background: #8f052d; }" +
	".{class:container} .poll .bar .osu {  }" +
	".{class:container} .poll .bar .missouri { background: #e9ad2d; }" +
	".{class:container} .poll .bar .florida {  }" + // 540115  8f072b
	".{class:container} .poll .bar .ucla { background: #137bc1; }" +
	".{class:container} .poll .bar .miami { background: #0e4a23; }" +

	".{class:container} .poll .bar .alabama i { background-position: 0 0; }" +
	".{class:container} .poll .bar .osu i { background-position: 0 -77px; }" +
	".{class:container} .poll .bar .missouri i { background-position: 0 -154px; }" +
	".{class:container} .poll .bar .florida i { background-position: 0 -231px; }" +
	".{class:container} .poll .bar .ucla i { background-position: 0 -308px; }" +
	".{class:container} .poll .bar .miami i { background-position: 0 -385px; }" +

	".{class:container} .buttons .alabama { color: #700808; }" +
	".{class:container} .buttons .osu { color: #ca1745; }" +
	".{class:container} .buttons .missouri { color: #e8ad2d; }" +
	".{class:container} .buttons .florida { color: #8f072b; }" +
	".{class:container} .buttons .ucla { color: #137bc1; }" +
	".{class:container} .buttons .miami { color: #0e4a23; }" +

	"";

Echo.App.create(poll);

})(Echo.jQuery);