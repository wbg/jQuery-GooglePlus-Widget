(function($) {

    /*
     * JavaScript Pretty Date
     * Copyright (c) 2008 John Resig (jquery.com)
     * Licensed under the MIT license.
     */

    // Takes an ISO time and returns a string representing how
    // long ago the date represents.
    // slightly modified
    function prettyDate(time){
	var date = new Date(time),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
	console.log(date);
	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
	    return date.getDate() + '.'+date.getMonth()+'.'+date.getFullYear();
		
	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
	                day_diff == 1 && "Yesterday" ||
		        day_diff < 7 && day_diff + " days ago" ||
	                Math.ceil( day_diff / 7 ) + " weeks ago";
    }   

    /*
     * jQuery GooglePlus Widget
     * Copyright (c) 2011 Roman Weinberger (roman.tao.at)
     * Licensed under the MIT license.
     */
    $.fn.googleplusWidget = function(options) {
	var o = $.extend({
	    user_id : '',
	    api_key : '',
	    activities : 'public',
	    api_url : 'https://www.googleapis.com/plus/v1/people/',
	    max_results : 20,
	    refresh_interval : 15000
	}, options);

	var url = o.api_url + o.user_id + '/activities/' + o.activities + '?maxResults='+o.max_results+'&key='+o.api_key;
	
	return $(this).each(function() {
	    var target = $(this);
	    
	    var refresh_gplus = function() {
		$.get(url, function(res) {
		    if( target.trigger('gplus_data', [res]) ) {
			$.each(res.items.reverse(), function() {
			    if( !target.find('.gplus-item-'+this.id).length ) {
				target.prepend(
				    '<div class="gplus-item-'+this.id+'">'+
					'<a class="actor" href="'+this.actor.url+'"><img src="'+this.actor.image.url+'" /></a>' +
					'<span class="message"><a href="'+this.url+'">'+
					this.title+
					'</a></span>'+
					'<span class="meta">'+prettyDate(this.published)+'</span>'+
				'</div>');
				console.log(this);
			    }
			});
		    }
		});
	    };
	    target.bind('start_gplus', function() {
		if( !target.data('gplus_interval') ) {
		    target.data('gplus_interval', setInterval(function() {
			refresh_gplus();
		    }, o.refresh_interval));
		}
	    });
	    target.bind('stop_gplus', function() {
		if( target.data('gplus_interval') ) {
		    clearInterval(target.data('gplus_interval'));
		    target.data('gplus_interval', false);
		}
	    });
	    refresh_gplus();
	});
	
    };

})(jQuery);