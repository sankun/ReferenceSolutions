/* Generated by Grunt, do not edit directly. */
angular.module('templates-main', ['/gallery/dashboard', '/poll/dashboard']);

angular.module("/gallery/dashboard", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/gallery/dashboard",
    "<!-- NOTES:\n" +
    "\n" +
    "1. You must make your app.config{} block defaults match these defaults _exactly_\n" +
    "   or you will get unexpected behaviors when your app loads. If the user leaves\n" +
    "   a field set to its default value, the field is _removed_ from the config\n" +
    "   block. So if the default is true, it will not be sent at all if the checkbox\n" +
    "   is checked. That means if you go to use it in app.js it can evaluate to false\n" +
    "   unexpectedly. See the related comment there for details.\n" +
    "\n" +
    "-->\n" +
    "\n" +
    "<!-- APP Key -->\n" +
    "<select name=\"appkey\" required=\"required\" data-component=\"AppKeyList\" title=\"Application key\" data-help=\"Specifies the application key for this instance\" />\n" +
    "<input name=\"query\" type=\"text\" required=\"required\" value=\"\" title=\"Query\" data-help=\"The query to execute. May be modified by components like the filter control.\" />\n" +
    "<input name=\"queryb\" type=\"text\" data-component=\"QueryBuilder\" value=\"\" title=\"Query Builder\" data-help=\"Work in progress.\" />\n" +
    "\n" +
    "<!-- Display -->\n" +
    "<fieldset name=\"display\">\n" +
    "  <legend class=\"icon-picture\">Display</legend>\n" +
    "\n" +
    "  <select name=\"visualization\" title=\"Visualization\" data-help=\"Select the display mode for the gallery\">\n" +
    "    <option value=\"pinboard\" selected=\"selected\">Pinboard-style Gallery</option>\n" +
    "    <option value=\"streamlined\">Streamlined Gallery</option>\n" +
    "    <option value=\"slideshow\">Slideshow w/ Full-Screen Support</option>\n" +
    "  </select>\n" +
    "\n" +
    "  <input name=\"sourcefilter\" type=\"checkbox\" checked=\"checked\" title=\"Display a source filter control\" data-help=\"A drop-down or similar control will be displayed that allows the user to choose the source of the media shown\" />\n" +
    "\n" +
    "  <input name=\"replies\" type=\"checkbox\" checked=\"checked\" title=\"Allow users to post replies\" data-help=\"Check to display replies for each item and provide an ability for the users to post their replies\" />\n" +
    "  <input name=\"likes\" type=\"checkbox\" checked=\"checked\" title=\"Allow users to Like items\" data-help=\"Check to enable Likes for the items\" />\n" +
    "  <input name=\"sharing\" type=\"checkbox\" title=\"Allow users to share items\" data-help=\"Check to provide an ability for the users to share the items with their friends via social networks\" />\n" +
    "  <input name=\"flags\" type=\"checkbox\" checked=\"checked\" title=\"Allow community flagging\" data-help=\"Check to add a button for the users to mark inappropriate content\" />\n" +
    "</fieldset>\n" +
    "\n" +
    "<!-- Ad/analytics -->\n" +
    "<fieldset name=\"integration\">\n" +
    "  <legend class=\"icon-certificate\">Ad / Analytics Integration</legend>\n" +
    "\n" +
    "  <input name=\"nativeinterval\" type=\"text\" data-storage=\"number\" title=\"Native Ad Interval\" data-help=\"Interval between native ad placeholders, or leave blank to disable. Subscribe to Echo.StreamServer.Controls.Stream.Item.onNativeAdRender to fill each placeholder.\" />\n" +
    "</fieldset>\n" +
    "\n" +
    "<!-- Upload -->\n" +
    "<fieldset name=\"upload\">\n" +
    "  <legend class=\"icon-upload\">Upload Options</legend>\n" +
    "\n" +
    "  <input name=\"enabled\" type=\"checkbox\" title=\"Enable Upload\" data-help=\"If checked, an upload Submit form will be displayed\" />\n" +
    "\n" +
    "  <input name=\"fpkey\" type=\"text\" title=\"FilePicker API Key\" data-help=\"If supplied, this will enable FilePicker in the upload form\" />\n" +
    "</fieldset>\n" +
    "\n" +
    "<!-- Authorization -->\n" +
    "<!--\n" +
    "Disabled for now, until we're ready to put upload back in.\n" +
    "<fieldset name=\"auth\">\n" +
    "  <legend class=\"icon-user\">Authorization</legend>\n" +
    "\n" +
    "  <input name=\"enabled\" type=\"checkbox\" checked=\"checked\" title=\"Enable user authorization\" data-help=\"Check to enable authorization\" />\n" +
    "  <select name=\"janrainApp\" title=\"Janrain app\" data-help=\"Specifies the Janrain application\">\n" +
    "</fieldset>\n" +
    "-->");
}]);

angular.module("/poll/dashboard", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/poll/dashboard",
    "<!-- NOTES:\n" +
    "\n" +
    "1. You must make your app.config{} block defaults match these defaults _exactly_\n" +
    "   or you will get unexpected behaviors when your app loads. If the user leaves\n" +
    "   a field set to its default value, the field is _removed_ from the config\n" +
    "   block. So if the default is true, it will not be sent at all if the checkbox\n" +
    "   is checked. That means if you go to use it in app.js it can evaluate to false\n" +
    "   unexpectedly. See the related comment there for details.\n" +
    "\n" +
    "-->\n" +
    "\n" +
    "<select name=\"appkey\" required=\"required\" data-component=\"AppKeyList\" title=\"Application key\" data-help=\"Specifies the application key for this instance\" />\n" +
    "\n" +
    "<input name=\"parentURL\" type=\"text\" title=\"Parent URL\" data-help=\"The root item that contains the poll.\" />\n" +
    "\n" +
    "<fieldset name=\"display\">\n" +
    "  <legend class=\"icon-picture\">Display</legend>\n" +
    "\n" +
    "  <select name=\"layout\" title=\"Layout\" data-help=\"How should the individual poll elements be arranged?\">\n" +
    "    <option value=\"list\" selected=\"selected\">Vertical List</option>\n" +
    "    <option value=\"sidebyside\">Side by Side</option>\n" +
    "    <option value=\"tugowar\">Tug Of War (Nested)</option>\n" +
    "  </select>\n" +
    "</fieldset>\n" +
    "\n" +
    "<fieldset name=\"results\">\n" +
    "  <legend class=\"icon-tasks\">Results</legend>\n" +
    "\n" +
    "  <select name=\"format\" title=\"Format\" data-help=\"Select the graphic display format for the results.\">\n" +
    "    <option value=\"hbar\" selected=\"selected\">Horizontal Bar</option>\n" +
    "    <option value=\"vbar\">Vertical Bar</option>\n" +
    "    <option value=\"pie\">Pie Chart</option>\n" +
    "  </select>\n" +
    "\n" +
    "  <input name=\"percent\" type=\"checkbox\" checked=\"checked\" title=\"Show Percentage\" data-help=\"If checked, a percentage value will be displayed in the result elements.\" />\n" +
    "  <input name=\"count\" type=\"checkbox\" checked=\"checked\" title=\"Show Vote Count\" data-help=\"If checked, the vote count will be displayed in the result elements.\" />\n" +
    "</fieldset>\n" +
    "");
}]);
