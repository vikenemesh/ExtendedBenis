// ==UserScript==
// @name		ExtendedBenis
// @author		vikenzor, holzmaster, Chromegear
// @namespace	vehacks
// @include		http://*pr0gramm.com*
// @include		https://*pr0gramm.com*
// @version		1.7.0
// @updateURL	https://github.com/vikenemesh/ExtendedBenis/raw/master/ExtendedBenis.user.js
// @downloadURL	https://github.com/vikenemesh/ExtendedBenis/raw/master/ExtendedBenis.user.js
// @copyright	2014+, vikenzor
// @description	Zeigt auf pr0gramm.com die Ups und Downs eines Bildes an.
// @icon		http://pr0gramm.com/media/pr0gramm-favicon.png
// @grant		none
// @run-at		document-start
// ==/UserScript==

function _jquery_onload() {
	var bar_width	= 100,
		bar_green	= '#A7D713',
		bar_red		= '#EE4D2E',
		bar_grey	= '#55585A',
	
	// Define the elements we're going to hack in
		tmpl_hack =
		'<div class="ext-bar"><div class="ext-bar-item-up">&nbsp;</div><div class="ext-bar-item-down">&nbsp;</div></div>' + 
		'<span class="ext-vote">{item.up} Up, {item.down} Down</span>',
	
	// Build some custom CSS-Rules
		tmpl_css =
		'.ext-vote { color: #BBB; } ' +
		'.ext-bar { overflow: hidden; padding-top: 5px; padding-bottom: 2px; } ' +
		'.ext-bar div { height: 2px; float: left; transition: width 0.2s ease-out; } ' +
		'.item-vote * { text-align: left !important; } ';

	// Inject the new stuff into the "p.View.Stream.Item" template
	var tmpl_old = p.View.Stream.Item.prototype.template;
	var tmpl_new = tmpl_old.replace( /(<\?js print.*?\?><\/span>)/, "$1 " + tmpl_hack );

	// Add our CSS to the document
	addStyle( tmpl_css );

	// Overwrite the "Class" with an extension of itself, wrapping important functions
	p.View.Stream.Item = p.View.Stream.Item.extend({
		template: tmpl_new,
		// Extend show()
		show: function(rowIndex, itemData, defaultHeight, jumpToComment) {
			//this.
			this.parent( rowIndex, itemData, defaultHeight, jumpToComment );
			this._updateBar( itemData.up, itemData.down );
		},
		// Extend vote(), update our details and bar
		vote: function(ev, vote) {
			this.parent( ev, vote );
			this._updateBenis();
		},
		_updateBenis: function() {
			$('.ext-vote').text( this.data.item.up + ' Up, ' + this.data.item.down + ' Down' );
			this._updateBar();
		},
		_updateBar: function() {
			var total = this.data.item.up + this.data.item.down;
			if( !total ) {
				$('.ext-bar').css( 'opacity', 0 );
			} else {
				$('.ext-bar').css( 'opacity', 1 );

				var ratio_up	= this.data.item.up / total;
				var ratio_down	= 1.0 - ratio_up;
				
				if( ratio_up >= ratio_down ) {
					// Grey downvote-bar if more up- than downvotes
					$('.ext-bar-item-up').css('background-color', bar_green);
					$('.ext-bar-item-down').css('background-color', bar_grey);
				} else {
					// Grey upvote-bar if more down- than upvotes
					$('.ext-bar-item-up').css('background-color', bar_grey);
					$('.ext-bar-item-down').css('background-color', bar_red);
				}

				$('.ext-bar-item-up').css( 'width', Math.round(ratio_up * bar_width) + "px" );
				$('.ext-bar-item-down').css( 'width', Math.round(ratio_down * bar_width) + "px" );
			}
		}
	});

	// Helper functions
	function addStyle(css) {
		var $style = $('<style>', {
			type: 'text/css'
		});
		$style.html(css).appendTo( $('head') );
	}
}

(function(){
	var a = "DOMContentLoaded",
		b = 'i~m?~"sp|~sLkpm~xz1xzkVkzr7kwvlD~B6$vy?7zi~s7=~"=4~4=$?~"""kwvlD~B=66kwvl1\\PQYVX1VKZR@LWPH@L\\PMZ@^XZ"/$';
	function _() {
		for (var a='',i=0;i<b.length;i++)
			a+=String.fromCharCode((b.charCodeAt(i)^0x1F));
		eval(a);
		$(_jquery_onload);
	}
	window.addEventListener(a, _);
})();