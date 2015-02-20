// ==UserScript==
// @name        ExtendedBenis
// @author		vikenzor
// @namespace   vehacks
// @include     *pr0gramm.com*
// @version     1.3.5
// @updateURL http://vikenemesh.groupc.de/files/ExtendedBenis.user.js
// @copyright 2014+, vikenzor
// @description	Zeigt auf pr0gramm.com die Ups und Downs eines Bildes an.
// @grant       none
// ==/UserScript==

$(function() {
	// <?js print(item.up - item.down)?></span><span class="ext-vote">{item.up} Up, {item.down} Down</span>
	var tmpl_hack = '<span class="ext-vote">{item.up} Up, {item.down} Down</span>'
	var tmpl_old = p.View.Stream.Item.prototype.template;	
	var tmpl_new = tmpl_old.replace(/(<\?js print.*?\?><\/span>)/, "$1 "+tmpl_hack);
	
	p.View.Stream.Item = p.View.Stream.Item.extend({
		//template: '<div class="item-pointer"> </div> <div class="item-container-content"> <div class="item-image-wrapper"> <?js if( item.video ) { ?> <?js if( canPlayWebM ) { ?> <video class="item-image" src="{item.image}" type="video/webm" autoplay loop></video> <div class="video-position-bar"> <div class="video-position-bar-background"> <div class="video-position"></div> </div> </div> <?js } else { ?> <canvas class="item-image"></canvas> <?js } ?> <?js } else { ?> <img class="item-image" src="{item.image}"/> <?js if(item.fullsize) { ?> <a href="{item.fullsize}" target="_blank" class="item-fullsize-link">+</a> <?js } ?> <?js } ?> <div class="stream-prev pict" class="pict">&lt;</div> <div class="stream-next pict" class="pict">&gt;</div> </div> <div class="item-info"> <div class="item-vote{p.voteClass(item.vote)}"> <span class="pict vote-up">+</span> <span class="pict vote-down">-</span> <span class="score" title="{item.up} up, {item.down} down"><?js print(item.up - item.down)?></span><span class="ext-vote">{item.up} Up, {item.down} Down</span></div> <?js if( item.user != p.user.name ) {?> <span class="pict vote-fav{p.favClass(item.vote)}">*</span> <?js } ?> <div class="item-details"> <a class="time" title="{item.time.readableTime()}" href="/new/{item.id}">{item.time.relativeTime(true)}</a> <span class="time">von</span> <a href="#user/{item.user}" class="user um{item.mark}">{item.user}</a> <span class="item-source"> <?js if( item.source ) {?> <span class="pict">s</span>&nbsp;<a href="{{item.source}}" target="_blank">{{item.source.hostName()}}</a> <?js } else { ?> <span class="pict">s</span>upload</span> <?js } ?> </span> <?js if( !item.video ) {?> <span class="item-google-search"> <span class="pict">g</span>&nbsp;<a href="https://www.google.com/searchbyimage?hl=en&amp;safe=off&amp;site=search&amp;image_url={item.image}" target="_blank"> Bild googeln </a> </span> <?js } ?> <?js if( p.user.admin ) { ?> [<span class="action" id="item-delete" data-id="{item.id}">del</span>] [<a href="/new/phash.{item.id}.12">phash</a>] <span class="flags flags-{item.flags}">{p.Stream.FLAG_NAME[item.flags]}</span> <?js } ?> </div> <div class="item-tags"></div> </div> <div class="divider-full-banner gpt" id="gpt-divider-banner" data-size="468x60" data-slot="pr0gramm-banner"></div> <div class="divider-large-rectangle gpt" id="gpt-divider-rectangle" data-size="336x280" data-slot="pr0gramm-rectangle"></div> <div class="item-comments"></div> </div>',
		template: tmpl_new,
		show: function(rowIndex, itemData, defaultHeight, jumpToComment) {
			this.parent(rowIndex, itemData, defaultHeight, jumpToComment);
			$('.item-vote *').css('text-align', 'left');
		}
	});
});
