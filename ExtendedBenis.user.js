// ==UserScript==
// @name		ExtendedBenis
// @author		vikenzor, holzmaster
// @namespace	vehacks
// @include		*pr0gramm.com*
// @version		1.5.1
// @updateURL	https://github.com/vikenemesh/ExtendedBenis/raw/master/ExtendedBenis.user.js
// @downloadURL	https://github.com/vikenemesh/ExtendedBenis/raw/master/ExtendedBenis.user.js
// @copyright	2014+, vikenzor
// @description	Zeigt auf pr0gramm.com die Ups und Downs eines Bildes an.
// @icon		http://pr0gramm.com/media/pr0gramm-favicon.png
// @grant		none
// ==/UserScript==

$(function() {
	// Define the elements we're going to hack in
	var tmpl_hack =
		'<span class="ext-vote">{item.up} Up, {item.down} Down</span>' +
		'<div class="ext-bar"><div class="ext-bar-item-up">&nbsp;</div><div class="ext-bar-item-down">&nbsp;</div></div>';
	
	// Build some custom CSS-Rules
	var tmpl_css =
		'.ext-vote { color: #BBB; } ' +
		'.ext-bar { overflow: hidden; } ' +
		'.ext-bar div { height: 2px; float: left; transition: width 0.1s ease-out; } ' +
		'.ext-bar-item-up { background-color: #A7D713; } ' +
		'.ext-bar-item-down { background-color: #6C432B; } ' +
		'.item-vote * { text-align: left !important; } ';

	// Inject the new stuff into the "p.View.Stream.Item" template
	var tmpl_old = p.View.Stream.Item.prototype.template;
	var tmpl_new = tmpl_old.replace( /(<\?js print.*?\?><\/span>)/, "$1 " + tmpl_hack );

	// Add our CSS to the document
	addStyle( tmpl_css );

	// Overwrite the "Class" with an extension of itself
	p.View.Stream.Item = p.View.Stream.Item.extend({
		template: tmpl_new,
		show: function(rowIndex, itemData, defaultHeight, jumpToComment) {
			this.parent(rowIndex, itemData, defaultHeight, jumpToComment);
			this._updateBar(itemData.up, itemData.down);
		},
		_updateBenis: function(up, down) {
			$('.ext-vote').text( up + ' Up, ' + down + ' Down' );
			this._updateBar( up, down );
		},
		_updateBar: function(up, down) {
			var totalVotes = up + down;
			if( !totalVotes ) {
				$('.ext-bar').css( 'opacity', 0 );
			} else {
				$('.ext-bar').css( 'opacity', 1 );

				var upWidth = up / totalVotes * 100;
				var downWidth = 100.0 - upWidth;

				$('.ext-bar-item-up').css( 'width', upWidth + "%" );
				$('.ext-bar-item-down').css( 'width', downWidth + "%" );
			}
		},
		vote: function(ev, vote) {
			this.parent(ev, vote);
			var cachedItem = this.stream.items[this.data.item.id];
			this._updateBenis( cachedItem.up, cachedItem.down );
			return false;
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

