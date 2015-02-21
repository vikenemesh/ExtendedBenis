// ==UserScript==
// @name		ExtendedBenis
// @author		vikenzor, holzmaster
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
	var tmpl_css =
	'.ext-vote { color: #BBB; } ' +
	'#ext-bar { overflow: hidden; } ' +
	'#ext-bar div { height: 2px; float: left; } ' +
	'#ext-bar-item-up { background-color: #A7D713; } ' +
	'#ext-bar-item-down { background-color: #6C432B; } ' +
	'.item-vote * { text-align: left !important; } ';

	var tmpl_hack = '<span class="ext-vote">{item.up} Up, {item.down} Down</span>';
	tmpl_hack += '<div id="ext-bar"><div id="ext-bar-item-up">&nbsp;</div><div id="ext-bar-item-down">&nbsp;</div></div>';

	var tmpl_old = p.View.Stream.Item.prototype.template;
	var tmpl_new = tmpl_old.replace(/(<\?js print.*?\?><\/span>)/, "$1 "+tmpl_hack);

	function addGlobalStyle(css) {
		var head = document.getElementsByTagName('head')[0];
		if (!head)
			return;
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}

	addGlobalStyle(tmpl_css);

	p.View.Stream.Item = p.View.Stream.Item.extend({
		template: tmpl_new,
		show: function(rowIndex, itemData, defaultHeight, jumpToComment) {
			this.parent(rowIndex, itemData, defaultHeight, jumpToComment);

			var totalVotes = itemData.up + itemData.down;
			if(totalVotes == 0)
			{
				document.getElementById('ext-bar').style.opacity = 0;
			}
			else
			{
				document.getElementById('ext-bar').style.opacity = 1;

				var upWidth = itemData.up / totalVotes * 100;
				var downWidth = 100.0 - upWidth;
				document.getElementById('ext-bar-item-up').style.width = upWidth + "%";
				document.getElementById('ext-bar-item-down').style.width = downWidth + "%";
			}
		}
	});
});
