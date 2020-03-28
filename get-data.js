// Get the URL parameter (i.e. region)
var $_GET = {};

if (document.location.toString().indexOf('?') !== -1) {
	var query = document.location
				   .toString()
				   // Get the query string
				   .replace(/^.*?\?/, '')
				   // Remove any existing hash string
				   .replace(/#.*$/, '')
				   .split('&');
	for(var i=0, l=query.length; i<l; i++) {
	   var aux = decodeURIComponent(query[i]).split('=');
	   $_GET[aux[0]] = aux[1];
	}
}

var loc = $_GET['in'];

if (typeof(loc) === "undefined" || loc === "World") {
	loc = "US";
}
	  
// Wait for document load
$(document).ready(function(){
	
	// Fetch data
	fetch('https://pomber.github.io/covid19/timeseries.json')
	  .then(response => response.json())
	  .then(data => {
		if (loc === "World") {
			var date;
			var confirmed = 0;
			var deaths = 0;
			for (n = 0; n < Object.keys(data).length; n++) {
				console.log(n); // Debug
				Object.values(data)[n].forEach(({ date, confirmed, recovered, deaths }) =>
					{
						// Count up cases and deaths
						date = date;
						confirmed += confirmed;
						deaths += deaths;
					}
				)
			}
			document.getElementById("region").textContent = loc;
			document.getElementById("date").textContent = date;
			document.getElementById("confirmed").textContent = confirmed;
			document.getElementById("deaths").textContent = deaths;
		} else {
			data[loc].forEach(({ date, confirmed, recovered, deaths }) =>
				{
					// Display data
					document.getElementById("region").textContent = loc;
					if (loc === "US") {
						document.getElementById("region").textContent = "United States";
					}
					document.getElementById("date").textContent = date;
					document.getElementById("confirmed").textContent = confirmed;
					document.getElementById("deaths").textContent = deaths;
				}
			)
		}
	});
	  
});