(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Stream.Item.Plugins.StreamlinedPinboardVisualization
 * Transforms a media stream into a pinboard with a streamlined interface.
 *
 * Apps that use this plugin should also include the TweetDisplay plugin. It is
 * optional but recommended to also include ItemSourceClass. CSS styles are
 * defined here that expect these plugins to be available, although this module
 * will not break if they're missing.
 *
 * @extends Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("StreamlinedPinboardVisualization",
								  "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	this.extendTemplate("insertAfter", "container", plugin.templates.mediafull);
};

plugin.dependencies = [{
	"loaded": function() { },
	"url": "//cdn.echoenabled.com/sdk/v3/gui.pack.js"
}, {
	"loaded": function() { },
	"url": "//cdn.echoenabled.com/sdk/v3/gui.pack.css"
}, {
	"loaded": function() { return !!Echo.jQuery().isotope; },
	"url": "{config:cdnBaseURL.sdk}/third-party/jquery/jquery.isotope.min.js"
}, {
	// This plugin lets us debounce events
	"loaded": function() { return !!Echo.jQuery().doTimeout; },
	"url": "//echocsthost.s3.amazonaws.com/plugins/jquery.ba-dotimeout.min.js"
}, {
	// The Media Polyfill is used to extract IMG/etc tags for separate display
	"loaded": function() { return !!Echo.Polyfills && !!Echo.Polyfills.Media; },
	"url": "//echocsthost.s3.amazonaws.com/polyfills/media.js"
}];

plugin.config = {
	/**
	 * @cfg {Function} mediaSelector
	 * Override this to define the function that extracts media from arriving
	 * stream items.
	 *
	 * The default function looks for IMG, VIDEO, EMBED, and IFRAME tags using
	 * the following code:
	 *
	 * 	"mediaSelector": function(content) {
	 * 		var dom = $("<div>" + content + "</div>");
	 * 		return $("img, video, embed, iframe", dom);
	 * 	}
	 */
	"mediaSelector": function(content) {
		var dom = $("<div>" + content + "</div>");
		return $("img, video, embed, iframe", dom);
	},

	/**
	 * @cfg {Object} gallery
	 * Pinboard requires the MediaGallery plugin. Any settings defined here will
	 * be passed through to it.
	 */
	"gallery": {
		"resizeDuration": 250
	}
};

plugin.labels = {
};

/**
 * @echo_template
 */
plugin.templates.mediafull = '<div class="{plugin.class:mediafull}"></div>';

/**
 * Rendering magic to create a header DIV and position the required elements
 * within it from their usual spots.
 *
 * @echo_renderer
 */
plugin.component.renderers.frame = function(element) {
	var item = this.component,
	    headerClass = this.cssPrefix + 'header';

	// We need the frame rendered before we can monkey with it
	element = item.parentRenderer("frame", arguments);

	// Most of the header elements are a set of DIV siblings found just before
	// the data block. We won't always know which ones are there because some
	// are generated with plugins. Instead, we find our data element and wrap
	// all of the prev-siblings before it.
	$(item.view.get('data').prevAll().get().reverse())
	        .wrapAll('<div class="' + this.cssPrefix + 'header"></div>');

	// Now move the avatar into the header we just made
	var avatar = item.view.get("avatar-wrapper");
	$('.' + headerClass, element).prepend(avatar);

	return element;
};

/**
 * @echo_renderer
 */
plugin.component.renderers.body = function(element) {
	var plugin = this, item = this.component;
	element = item.parentRenderer("body", arguments);
	var filteredElements = plugin.config.get("mediaSelector")(item.get("data.object.content"));
	$(filteredElements.selector, item.view.get("text")).remove();
	var text = Echo.Utils.stripTags(item.get("data.object.content"));

	return element;
};

/**
 * @echo_renderer
 */
plugin.renderers.mediafull = function(element) {
	var plugin = this, item = this.component;

	var mediaItems = Echo.Polyfills.Media.processMedia(item);

	if (mediaItems.length < 1) {
		element.addClass('empty');
	} else {
		element.append(mediaItems);
		element.find('img, iframe').one('error', function() {
			item.view.get('content').parent().addClass('load-error');
			plugin.events.publish({ "topic": "onMediaError", "data": {} });
		}).one('load', function() {
			item.view.get('content').parent().addClass('loaded');
			plugin.events.publish({ "topic": "onMediaLoaded", "data": {} });
		});
	}

	return element;
};

plugin.css =
	// Override some incompatible default styles
	'.{class:container} { padding: 0px; }' +
	'.{class:subwrapper} { margin-left: 0px; }' +
	'.{class:avatar-wrapper} { margin-right: 7px; }' +
	'.{plugin.class} a { color: #2CA0C7; }' +

	// General layout
	'.{plugin.class} { perspective: 1000; -webkit-perspective: 1000; }' +
	'.{plugin.class} img, .{plugin.class} iframe { display: block; ; }' +
	'.{plugin.class} div { box-sizing: border-box; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; } ' +
	'.{plugin.class} .{class:data} { padding: 7px; }' +

	// Transitions for card flipping
	'.{plugin.class} .{class:content} { transition: 0.6s; transform-style: preserve-3d; position: relative; -webkit-perspective: 800; padding-bottom: 0px; margin: 5px; }' +
	'.{plugin.class} .{class:content} .{class:container}, ' +
	'.{plugin.class} .{class:content} .{plugin.class:mediafull} { -webkit-backface-visibility: hidden; transition: 250ms cubic-bezier(.8,.01,.74,.79); -webkit-transition: 250ms cubic-bezier(.8,.01,.74,.79); position: static; border: 1px solid #111; background: white; box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.8); }' +
	'.{plugin.class} .{class:content} .{class:container} { -webkit-transform: rotatey(-180deg); transform: rotateY(-180deg); position: absolute; top: 0; bottom: 0; width: 100%; }' +
	'.{plugin.class} .{class:content}:hover > .{plugin.class:mediafull} { -webkit-transform: rotatey(180deg); transform: rotateY(180deg); }' +
	'.{plugin.class} .{class:content}:hover > .{class:container} { -webkit-transform: rotatey(0deg); transform: rotateY(-0deg); }' +

	// General media visuals
	'.{plugin.class:media} { margin: 4px 7px 0 0; width: 25%; float: left; }' +
	'.{plugin.class:mediafull} { background: #000; }' +
	'.{plugin.class:mediafull} img { max-width: 100%; backface-visibility: hidden; display: block; margin: 0 auto; }' +

	// Separate the header visually, and color-code it
	'.{plugin.class} .{plugin.class:header} { padding: 5px; background: #f0f0f0; border-bottom: 1px solid #ccc; }' +
	'.{plugin.class} .item-source-twitter .{plugin.class:header} { background: #E5F5FF; border-bottom: 1px solid #A1C7DF; }' +
	'.{plugin.class} .item-source-instagram .{plugin.class:header} { background: #E4CAB1; border-bottom: 1px solid #B49F8B; }' +

	// Separate the footer visually, and color-code it
	'.{plugin.class} .{class:footer} { position: absolute; bottom: 0; left: 0; right: 0; height: 24px; background: #f0f0f0; border-top: 1px solid #ccc; padding: 4px 8px; }' +
	'.{plugin.class} .item-source-twitter .{class:footer} { background: #E5F5FF; border-top: 1px solid #A1C7DF; }' +
	'.{plugin.class} .item-source-twitter .{class:button-Share} { display: none; }' +
	'.{plugin.class} .item-source-instagram .{class:footer} { background: #E4CAB1; border-top: 1px solid #B49F8B; }' +

	// Un-float the auth/user values since there won't be room for them side-by-side. Also add ellipsis if necessary
	'.{plugin.class} .{class:plugin-TweetDisplay-tweetUserName},' +
	'.{plugin.class} .{class:authorName} { float: none; display: block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin-left: 0px; }';

Echo.Plugin.create(plugin);

})(Echo.jQuery);

(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Stream.Plugins.StreamlinedPinboardVisualization
 * See Echo.StreamServer.Controls.Stream.Items.Plugins.StreamlinedPinboardVisualization
 * above for details.
 *
 * @extends Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("StreamlinedPinboardVisualization", "Echo.StreamServer.Controls.Stream");

if (Echo.Plugin.isDefined(plugin)) return;

var ua = navigator.userAgent.toLowerCase();
var isMozillaBrowser = !!(
		!~ua.indexOf("chrome")
		&& !~ua.indexOf("webkit")
		&& !~ua.indexOf("opera")
		&& (
			/(msie) ([\w.]+)/.exec(ua)
			|| ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)
		)
	);

plugin.config = {
	/**
	 * @cfg {Array} columns
	 * A single integer column count, or an array of breakpoint widths. If
	 * supplied as an array, each value should be a pixel width for each
	 * desired column count. The index of the array is columnCount-1. Examples:
	 *
	 *   Always use four columns, specify integer 4:
	 *   "columns": 4
	 *
	 *   Use one column minimum, two columns at >=330px wide, three columns at
	 *   >=560px wide, four columns at >=900px wide, and five columns for any
	 *   width >=1100px:
	 *   "columns": [ 0, 330, 560, 900, 1100 ]
	 */
	"columns": 4,

	/**
	 * @cfg {Object} isotope
	 * Allows to configure the Isotope jQuery plugin, used by the plugin as the
	 * rendering engine. The possible config values can be found at the Isotope
	 * plugin homepage ([http://isotope.metafizzy.co/](http://isotope.metafizzy.co/)). It's NOT recommended to
	 * change the settings of the Isotope unless it's really required.
	 *
	 *__Note__: the Isotope JS library doesn't work in IE <a href="http://en.wikipedia.org/wiki/Quirks_mode">quirks mode</a>.
	 * Due to this fact you should declare the necessary <a href="http://en.wikipedia.org/wiki/DOCTYPE">\<DOCTYPE\></a>
	 * on the page. We recommend to use a
	 * <a href="http://en.wikipedia.org/wiki/DOCTYPE#HTML5_DTD-less_DOCTYPE">HTML5 DOCTYPE</a> declaration.
	 */
	"isotope": {
		"resizable": false,
		"animationOptions": {
			// change duration for mozilla browsers
			"duration": isMozillaBrowser ? 0 : 2750,
			"easing": "linear",
			"queue": false
		},
		// use only jQuery engine for animation in mozilla browsers
		// due to the issues with video display with CSS transitions
		"animationEngine": isMozillaBrowser ? "jquery" : "best-available"
	}
};

plugin.init = function() {
	var plugin = this, stream = this.component;

	// display an item immediately (cancel the slide down animation)
	// to let the Isotope library work with the final state of the DOM element
	// representing the item, to avoid its incorrect positioning in the grid
	this.component.config.set("slideTimeout", 0);

	// Update columnWidth on window resize
	$(window).on('resize', function() {
		$.doTimeout('refresh-view', 250, function() { plugin._refreshView(); });
	});
};

plugin.enabled = function() {
	return document.compatMode !== "BackCompat"
};

plugin.dependencies = [{
	"loaded": function() { return !!Echo.jQuery().isotope; },
	"url": "{config:cdnBaseURL.sdk}/third-party/jquery/jquery.isotope.min.js"
}];

plugin.events = {};
(function() {
	$.map([
		"Echo.StreamServer.Controls.Stream.Item.Plugins.StreamlinedPinboardVisualization.onMediaError",
		"Echo.StreamServer.Controls.Stream.Item.Plugins.StreamlinedPinboardVisualization.onMediaLoaded",
		"Echo.StreamServer.Controls.Stream.onRender",
		"Echo.StreamServer.Controls.Stream.onRefresh"
	], function(entry) {
		plugin.events[entry] = function(topic, args) {
			var plugin = this;
			$.doTimeout('refresh-view', 250, function() { plugin._refreshView(); });
		};
	});
})();

plugin.methods._refreshView = function() {
	var plugin = this, stream = this.component;
	var hasEntries = stream.threads.length;

	var $body = stream.view.get("body");
	if ($body.length < 1) {
		return;
	}

	// Clean up any broken images before they disrupt the visualization.
	$body.find('.load-error').remove();

	var bodyWidth = $body.width();

	var columns = plugin.config.get("columns", 4);
	if ($.isArray(columns)) {
		var length = columns.length;
		for (var i = 0; i < length; i++) {
			if (bodyWidth < columns[i]) {
				break;
			}
		}

		columns = i;
	}

	var config = $.extend({
		sortBy: "original-order",
		masonry: {
			columnWidth: Math.floor(bodyWidth / columns)
		}
	}, plugin.config.get("isotope"));

	$body.children().css({ "width": config.masonry.columnWidth + "px" });
	$body.data("isotope")
		? (hasEntries
			? $body.isotope("reloadItems").isotope(config)
			: $body.isotope("destroy"))
		: hasEntries && $body.isotope(config);

	// Temporary hack while we research why the Twitter-Display plugin isn't
	// always doing this itself
	if (window.twttr && window.twttr.widgets) {
		window.twttr.widgets.load();
	}
};

plugin.css =
	'.{plugin.class} { background: #333; }' +
	'.{plugin.class} .isotope { -webkit-transition-property: height, width; -moz-transition-property: height, width; -o-transition-property: height, width; transition-property: height, width;  -webkit-transition-duration: 0.8s; -moz-transition-duration: 0.8s; -o-transition-duration: 0.8s; transition-duration: 0.8s; }' +
	// TODO: These classes below should probably move up to the Stream.Item plugin
	'.{plugin.class} .isotope .isotope-item { -webkit-transition-property: -webkit-transform, opacity; -moz-transition-property: -moz-transform, opacity; -o-transition-property: top, left, opacity; transition-property:transform, opacity; -webkit-transition-duration: 0.8s; -moz-transition-duration: 0.8s; -o-transition-duration: 0.8s; transition-duration: 0.8s; }';

Echo.Plugin.create(plugin);

})(Echo.jQuery);
