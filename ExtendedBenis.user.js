// ==UserScript==
// @name		ExtendedBenis
// @author		vikenzor, holzmaster, Chromegear
// @namespace	vehacks
// @include		*pr0gramm.com*
// @version		1.6.1
// @updateURL	https://github.com/vikenemesh/ExtendedBenis/raw/master/ExtendedBenis.user.js
// @downloadURL	https://github.com/vikenemesh/ExtendedBenis/raw/master/ExtendedBenis.user.js
// @copyright	2014+, vikenzor
// @description	Zeigt auf pr0gramm.com die Ups und Downs eines Bildes an.
// @icon		http://pr0gramm.com/media/pr0gramm-favicon.png
// @grant		none
// ==/UserScript==

$(function() {
	var bar_width = 100;
	var bar_green = '#A7D713';
	var bar_red   = '#EE4D2E';
	var bar_grey  = '#55585A';
	
	// Define the elements we're going to hack in
	var tmpl_hack =
		'<div class="ext-bar"><div class="ext-bar-item-up">&nbsp;</div><div class="ext-bar-item-down">&nbsp;</div></div>' + 
		'<span class="ext-vote">{item.up} Up, {item.down} Down</span>';
	
	// Build some custom CSS-Rules
	var tmpl_css =
		'.ext-vote { color: #BBB; } ' +
		'.ext-bar { overflow: hidden; padding-top: 5px; padding-bottom: 2px; } ' +
		'.ext-bar div { height: 2px; float: left; transition: width 0.2s ease-out; } ' +
		'.item-vote * { text-align: left !important; } ';

	// Inject the new stuff into the "p.View.Stream.Item" template
	var tmpl_old = p.View.Stream.Item.prototype.template;
	var tmpl_new = tmpl_old.replace( /(<\?js print.*?\?><\/span>)/, "$1 " + tmpl_hack );

	// Add our CSS to the document
	addStyle( tmpl_css );

	// Overwrite the "Class" with an extension of itself
	p.View.Stream.Item = p.View.Stream.Item.extend({
		template: tmpl_new,
		// Extend show()
		show: function(rowIndex, itemData, defaultHeight, jumpToComment) {
			this.parent( rowIndex, itemData, defaultHeight, jumpToComment );
			this._updateBar( itemData.up, itemData.down );
		},
		// Extend vote(), update our details and bar
		vote: function(ev, vote) {
			this.parent( ev, vote );
			this._updateBenis();
		},
		_updateBenis: function() {
			$('.ext-vote').text( this.data.item.up + ' [+] // ' + this.data.item.down + ' [-]' );
			this._updateBar();
		},
		_updateBar: function() {
			var total = this.data.item.up + this.data.item.down;
			if( !total ) {
				$('.ext-bar').css( 'opacity', 0 );
			} else {
				$('.ext-bar').css( 'opacity', 1 );

				var ratio_up = this.data.item.up / total;
				var ratio_down = 1.0 - ratio_up;
				
				// Grey downvote-bar if more up- than downvotes
				if(ratio_up>=ratio_down) { 
					$('.ext-bar-item-up').css('background-color', bar_green);
					$('.ext-bar-item-down').css('background-color', bar_grey);
				} else { // Grey upvote-bar if more down- than upvotes
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
});

