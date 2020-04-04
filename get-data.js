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

if (typeof(loc) === "undefined") {
	loc = "Worldwide";
}
	  
// Wait for document load
$(document).ready(function(){
	
	// Date format options
	var date_options = { year: 'numeric', month: 'short', day: 'numeric' };
	
	// Fetch data
	fetch('https://pomber.github.io/covid19/timeseries.json')
	  .then(response => response.json())
	  .then(data => {
		  
		if (loc === "Worldwide") {
			
			var total_date;
			var total_confirmed = 0;
			var total_deaths = 0;
			for (n = 0; n < Object.keys(data).length; n++) {
				var subtotal_confirmed = 0;
				var subtotal_deaths = 0;
				Object.values(data)[n].forEach(({ date, confirmed, recovered, deaths }) =>
					{
						total_date = date;
						subtotal_confirmed = confirmed;
						subtotal_deaths = deaths;
					}
				)
				// Count up cases and deaths
				total_confirmed += subtotal_confirmed;
				total_deaths += subtotal_deaths;
			}
			
			//Data
			document.getElementById("region").textContent = loc;
			document.getElementById("date").textContent = new Date(total_date).toLocaleDateString("en-US", date_options);
			document.getElementById("confirmed").textContent = total_confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			document.getElementById("deaths").textContent = total_deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			
		} else if (data[loc] === undefined) {
			
			document.getElementById("region").textContent = loc;
			document.getElementById("date").textContent = "Unreported";
			document.getElementById("confirmed").textContent = 0;
			document.getElementById("deaths").textContent = 0;
			
		} else {
			
			data[loc].forEach(({ date, confirmed, recovered, deaths }) =>
				{
					// Display data
					document.getElementById("region").textContent = loc;
					if (loc === "US") {
						document.getElementById("region").textContent = "United States";
						
					}
	
					// Data
					document.getElementById("date").textContent = new Date(date).toLocaleDateString("en-US", date_options);
					document.getElementById("confirmed").textContent = confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					document.getElementById("deaths").textContent = deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				}
			)
			
		}
		
	});
	  
});