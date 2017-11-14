// ==UserScript==
// @name		ExtendedBenis
// @author		vikenzor, holzmaster, Chromegear
// @namespace	vehacks
// @include		http://*pr0gramm.com*
// @include		https://*pr0gramm.com*
// @exclude		http://full.pr0gramm.com*
// @exclude		https://full.pr0gramm.com*
// @version		2.0.3
// @updateURL	https://vikenemesh.github.io/ExtendedBenis.user.js
// @downloadURL	https://vikenemesh.github.io/ExtendedBenis.user.js
// @description	Zeigt auf pr0gramm.com die Ups und Downs eines Bildes an.
// @icon		http://pr0gramm.com/media/pr0gramm-favicon.png
// @grant		unsafeWindow
// @run-at		document-end
// ==/UserScript==

(function() {
var mutex = false;

function script_init(ev) {
	if(mutex) {
		return;
	}

	mutex = true;

	const bar_width = 100;
	const bar_green = '#A7D713';
	const bar_red = '#EE4D2E';
	const bar_grey = '#55585A';

	// Define the elements we're going to hack in
	const tmpl_hack =
		'<div class="ext-bar"><div class="ext-bar-item-up">&nbsp;</div><div class="ext-bar-item-down">&nbsp;</div></div>' +
		'<span class="ext-vote">{item.up} Up, {item.down} Down</span>';

	// Build some custom CSS-Rules
	const tmpl_css =
		'.ext-vote { color: #BBB; } ' +
		'.ext-bar { overflow: hidden; padding-top: 5px; padding-bottom: 2px; } ' +
		'.ext-bar div { height: 2px; float: left; transition: width 0.2s ease-out; } ' +
		'.item-vote * { text-align: left !important; } ';

	// Inject the new stuff into the "p.View.Stream.Item" template
	const tmpl_old = unsafeWindow.p.View.Stream.Item.prototype.template;
	const tmpl_new = tmpl_old.replace(/(<\?js print.*?\?><\/span>)/, "$1 " + tmpl_hack);

	// Add our CSS to the document
	addGlobalStyle(tmpl_css);

	// Overwrite the "Class" with an extension of itself, wrapping important functions
	// Because of Firefox 57 and GreaseMonkey 4.0 we do this in an eval...
	window.eval([
"		CONFIG.SHOW_SCORE_MIN_AGE = 0;",
"		const target = p.View.Stream.Item.TARGET;",
"		p.View.Stream.Item = p.View.Stream.Item.extend({",
"			template: '" + tmpl_new + "',",
"			// Extend show()",
"			show: function(rowIndex, itemData, defaultHeight, jumpToComment) {",
"				//this.",
"				this.parent( rowIndex, itemData, defaultHeight, jumpToComment );",
"				this._updateBar( itemData.up, itemData.down );",
"			},",
"			// Extend vote(), update our details and bar",
"			vote: function(ev, vote) {",
"				this.parent(ev, vote);",
"				this._updateBenis();",
"			},",
"			_updateBenis: function() {",
"				$('.ext-vote').text(this.data.item.up + ' Up, ' + this.data.item.down + ' Down');",
"				this._updateBar();",
"			},",
"			_updateBar: function() {",
"				const total = this.data.item.up + this.data.item.down;",
"				if( !total ) {",
"					$('.ext-bar').css('opacity', 0);",
"				} else {",
"					$('.ext-bar').css('opacity', 1);",
"",
"					const ratio_up = this.data.item.up / total;",
"					const ratio_down = 1.0 - ratio_up;",
"",
"					if( ratio_up >= ratio_down ) {",
"						// Grey downvote-bar if more up- than downvotes",
"						$('.ext-bar-item-up').css('background-color', '"+bar_green+"');",
"						$('.ext-bar-item-down').css('background-color', '"+bar_grey+"');",
"					} else {",
"						// Grey upvote-bar if more down- than upvotes",
"						$('.ext-bar-item-up').css('background-color', '"+bar_grey+"');",
"						$('.ext-bar-item-down').css('background-color', '"+bar_red+"');",
"					}",
"",
"					$('.ext-bar-item-up').css('width', Math.round(ratio_up * "+bar_width+") + 'px');",
"					$('.ext-bar-item-down').css('width', Math.round(ratio_down * "+bar_width+") + 'px');",
"				}",
"			}",
"		});",
"",
"		p.View.Stream.Item.TARGET = target;"
	].join("\n"));

	function addGlobalStyle(css) {
		const style = unsafeWindow.document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		unsafeWindow.document.head.appendChild(style);
	}
}

if (unsafeWindow.document.readyState == "complete" || unsafeWindow.document.readyState == "loaded" || unsafeWindow.document.readyState == "interactive") {
	script_init();
} else {
	unsafeWindow.document.addEventListener("DOMContentLoaded", (ev) => script_init(ev));
}

})();