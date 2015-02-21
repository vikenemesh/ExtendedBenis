// ==UserScript==
// @name		ExtendedBenis
// @author		vikenzor
// @namespace	vehacks
// @include		*pr0gramm.com*
// @version		1.4.4
// @updateURL	https://github.com/vikenemesh/ExtendedBenis/raw/master/ExtendedBenis.user.js
// @downloadURL	https://github.com/vikenemesh/ExtendedBenis/raw/master/ExtendedBenis.user.js
// @copyright	2014+, vikenzor
// @description	Zeigt auf pr0gramm.com die Ups und Downs eines Bildes an.
// @grant		none
// ==/UserScript==

$(function() {
	var tmpl_css = ".ext-vote { color: #BBB; }";
	var tmpl_hack = '<span class="ext-vote">{item.up} Up, {item.down} Down</span>';
	var tmpl_old = p.View.Stream.Item.prototype.template;
	var tmpl_new = tmpl_old.replace(/(<\?js print.*?\?><\/span>)/, "$1 "+tmpl_hack);

	function addGlobalStyle(css) {
		var head = document.getElementsByTagName("head")[0];
		if (!head)
			return;
		var style = document.createElement("style");
		style.type = "text/css";
		style.innerHTML = css;
		head.appendChild(style);
	}

	addGlobalStyle(tmpl_css);

	p.View.Stream.Item = p.View.Stream.Item.extend({
		template: tmpl_new,
		show: function(rowIndex, itemData, defaultHeight, jumpToComment) {
			this.parent(rowIndex, itemData, defaultHeight, jumpToComment);
			$('.item-vote *').css('text-align', 'left');
		}
	});
});

