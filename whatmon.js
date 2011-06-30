var intervalId = null;

function rate() {

	var seconds = parseInt(safari.extension.settings.getItem("wrefresh"));

	if (seconds < 20) {
		seconds = 20;
	}
	return (seconds);
}

function settingsChanged(event) {
        if (event.key == 'wurl' || event.key == 'wrefresh') {
		// var u = safari.extension.settings.getItem("wurl");
		// var refresh = safari.extension.settings.getItem("wrefresh");

		clearInterval(intervalId);
		intervalId = setInterval("getFeed()", 1000 * rate());
		getFeed();

	}
}

function getFeed() {
	var wurl = safari.extension.settings.getItem("wurl");

	$.getJSON(wurl, function(data) {
		
		if (0) { // if (data.query.results == null) {
                        
                        var link = $("<span></span>");
                        link.text("Invalid URL");
                        link.css({
                                "top": "7px",
                                "position": "relative",
                                "left": "12px"
                        });
                        $("#whatmoninfo").append(link);
                }
                else {
                        // data = data.query.results;
			var status = parseInt(data.status);
			var color = 'yellow';

			switch (status) {
				case 0: color = 'green'; break;
				case 1: color = 'yellow'; break;
				case 2: color = 'red'; break;
			}
			$("#whatmonstatus").css('color', color);
			$("#whatmonstatus").html("&#9608;");

			// Clear HTML
			$("#whatmoninfo").html("");

			if (data.url) {
				var link = $("<a></a>");
				link.attr("href", data.url);
				if (data.tooltip) {
					link.attr("title", data.tooltip);
				}
				link.click(function() {
					var tab = safari.self.browserWindow.openTab();
					tab.url = this.attr("href");
				});
				link.text(data.text);
				$("#whatmoninfo").append(link);
			} else {
				$("#whatmoninfo").html(data.text);
			}
		}
        });
}


$(document).ready(function() {
	getFeed();

	intervalId = setInterval("getFeed()", 1000 * rate());

	safari.extension.settings.addEventListener("change", settingsChanged, false);
});
