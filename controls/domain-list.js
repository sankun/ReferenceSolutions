/**
 * Adds an app-key select list control. This is a near 1:1 clone of .Select just
 * modified to obtain its values from an API call.
 *
 * I did it this way instead of trying to inherit from .Select because I
 * couldn't figure out how the inheritance was supposed to work...
 *
 * It's probably pretty ugly...
 */

(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.AppServer.App.isDefined("Echo.Apps.AppServer.Controls.Configurator.Items.DomainList")) return;

var domainlist = Echo.AppServer.App.manifest("Echo.AppServer.Controls.Configurator.Items.DomainList");

domainlist.inherits = Echo.Utils.getComponent("Echo.AppServer.Controls.Configurator.Item");

domainlist.config = {
	"defaultTitle": ""
};

domainlist.init = function() {
	// TODO: SURELY there is a better way to get this...?
	var self = this,
	    customerId = Echo.AppServer.User.data.customer.id,     // 312
		customerName = Echo.AppServer.User.data.customer.name, // echo-apps-chad
		apiBaseURL = this.config.get('apiBaseURL', 'http://api.appserver.aboutecho.com');

	// TODO: The SDK is not yet Open Source and there are no docs. I found
	// Echo.AppServer.API.request but couldn't quite get it to work right, so I
	// just used this.
	$.ajax({
		url: apiBaseURL + '/customer/' + customerId + '/domains',
		timeout: 5000,
		dataType: 'jsonp',
		success: function(data) {
			var options = [];
			$.each(data, function(i, entry) {
				options.push({
					title: entry,
					value: entry
				});
			});

			self.config.set('options', options);
			self.fillMenuItems(self.view.get('menu'));
		},
		error: function() {
			// TODO: What is an appropriate error mechanism for a control that
			// has no acceptable behavior if it cannot populate itself? Can we
			// terminate or reload the entire app?
			alert('Error loading appkey list');
		}
	});

	this.parent();
}

domainlist.templates.main =
	'<div class="{inherited.class:container} {class:container} clearfix">' +
		'<div class="{inherited.class:subcontainer} {class:subcontainer} clearfix">' +
			'<div class="{inherited.class:titleContainer} {class:titleContainer}">' +
				'<div class="{inherited.class:titleSubcontainer} {class:titleSubcontainer}">' +
					'<span class="{inherited.class:title} {class:title}">' +
						'<span class="{inherited.class:titleText} {class:titleText}">{config:title}</span>' +
						'<span class="{inherited.class:additionalInfo} {class:additionalInfo}">{config:info}</span>' +
					'</span>' +
					'<div class="{inherited.class:toolbar} {class:toolbar}">' +
						'<div class="echo-clickable {inherited.class:icon} {class:icon} {inherited.class:help} {class:help} pull-left">' +
							'<i class="icon-question-sign"></i>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="{inherited.class:valueContainer} {class:valueContainer} clearfix">' +
				'<div class="{inherited.class:value} {class:value} btn-group">' +
					'<button type="button" class="btn btn-mini dropdown-toggle {class:dropdown}" data-toggle="dropdown">' +
						'<span class="caret pull-right"></span>' +
						'<span class="{class:selected}"></span>' +
					'</button>' +
					'<ul class="dropdown-menu {class:menu}" role="menu"></ul>' +
				'</div>' +
			'</div>' +
			'<div class="{inherited.class:error} {class:error} clearfix"></div>' +
		'</div>' +
	'</div>';

domainlist.templates.option =
	'<li><a class="{class:option}">{data:value}</a></li>';

domainlist.renderers.dropdown = function(element) {
	if (this.config.get("options").length === 0) element.addClass("disabled");
	return element.dropdown();
};

domainlist.renderers.menu = function(element) {
	var self = this, view = this.view.fork();

	self.fillMenuItems(element);

	return element;
};

domainlist.renderers.option = function(element) {
	var self = this;
	return element.click(function() {
		var value = self.getValue($(this).html());
		var prevValue = self.get("data.value");
		self.set("data.value", value);
		if (prevValue !== value) self.changed(self.get("data.value"), prevValue);
		self.view.render({"name": "selected"});
	});
};

domainlist.renderers.selected = function(element) {
	var title = this.getTitle(this.get("data.value"))
		|| this.config.get("defaultTitle");

	return element.empty().append(title);
};

domainlist.methods.fillMenuItems = function(element) {
	var self = this,
	    options = this.config.get("options") || [],
	    // TODO: What is forking actually doing behind the scenes? This isn't
		// clear to me... If it gets called multiple times, what happens?
	    view = this.view.fork();

	element.empty();
	$.map(options, function(option) {
		element.append(view.render({
			"template": self.templates.option,
			"data": {"value": option.value}
		}));
	});

	var dropdown = self.view.get('dropdown');
	if (dropdown) {
		if (options.length > 0) {
			dropdown.removeClass('disabled');
		} else {
			dropdown.addClass('disabled');
		}
	}

	var selected = self.view.get('selected');
	if (selected) {
		var title = this.getTitle(this.get("data.value"))
		            || this.config.get("defaultTitle");
		selected.empty().append(title);
	}

	return element;
};

domainlist.methods.getTitle = function(value) {
	var title;
	$.each(this.config.get("options", []), function(key, option) {
		if (option.value === value) {
			title = option.title;
			return false;
		}
	});
	return title;
};

domainlist.methods.getValue = function(title) {
	var value;
	$.each(this.config.get("options", []), function(key, option) {
		if (option.title === title) {
			value = option.value;
			return false;
		}
	});
	return value;
};

domainlist.methods.value = function() {
	return this.get("data.value");
};

domainlist.css =
	'.{class:titleContainer} { padding-top: 2px; display: inline-block; }' +
	'.{class:container} .{class:valueSubcontainer} { max-width: 100%; }' +
	'.{class:container} .{class:valueContainer} .{class:value} { display: block; }' +
	'.{class:value} button.btn { width: auto; max-width: 100%; display: block; white-space: nowrap; }' +
	'.{class:icon} { opacity: 0.8; height: 18px; width: 16px; margin-top: -1px; padding-left: 3px; } ' +
	'.{class:help} { height: 23px; width: 16px; }' +
	'.{class:container} .{class:menu} a.{class:option} { cursor: pointer; font: 12px Arial; font-weight: bold; color: #787878; text-decoration: none; line-height: 15px; }' +
	'.{class:container} .{class:dropdown}.btn { text-align: left; padding: 0; }' +
	'.{class:container} .{class:dropdown} span.{class:selected} { min-height: 20px; min-width: 50px; display: block; margin-left: 6px; margin-right: 18px; overflow: hidden; text-overflow: ellipsis; }' +
	'.{class:container} .{class:dropdown} span.caret { margin-top: 8px; margin-right: 6px; }';

Echo.AppServer.App.create(domainlist);

})(Echo.jQuery);
