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

// Show worldwide data by default
if (typeof(loc) === "undefined") {
	loc = "Worldwide";
}

// Put the data onto the page
function fill_data(dates[], cases[], deaths[]) {	
	var ctx = document.getElementById('chart').getContext('2d');
	var chart = new Chart(ctx, {
	// The type of chart we want to create
	type: 'line',

	// The data for our dataset
	data: {
		labels: dates[],
		datasets: [{
			label: 'Cases',
			backgroundColor: 'rgb(255, 99, 132)',
			borderColor: 'rgb(255, 99, 132)',
			data: cases[]
		}, {
			label: 'Deaths',
			backgroundColor: 'rgb(255, 99, 132)',
			borderColor: 'rgb(255, 99, 132)',
			data: deaths[]
		}]
	},

	// Configuration options go here
	options: {}
	});
}
	  
// Wait for document load
$(document).ready(function(){
	
	// Set the region/location text
	document.getElementById("region").textContent = loc.toUpperCase();
	
	// Fetch country data from Rodrigo Pombo & Johns Hopkins CSSE
	fetch('https://pomber.github.io/covid19/timeseries.json')
	  .then(response => response.json())
	  .then(data => {
		  
		// List of countries
		var countries = [];
		
		for (n = 0; n < Object.keys(data).length; n++) {
			countries.push(Object.keys(data)[n]);
		}
		 
		// Handle the worldwide region
		if (loc === "Worldwide") {
			
			var dates[];
			var confirmed[];
			var deaths[];
			for (n = 0; n < Object.keys(data).length; n++) {
				var subtotal_confirmed = 0;
				var subtotal_deaths = 0;
				Object.values(data)[n].forEach(({ date, confirmed, recovered, deaths }) =>
					{
						date[n] = date;
						subtotal_confirmed += confirmed;
						subtotal_deaths += deaths;
					}
				)
				// Count up cases and deaths
				confirmed[n] = subtotal_confirmed;
				deaths[n] = subtotal_deaths;
			}
			
			//Data
			fill_data(
				dates[], 
				confirmed[],
				deaths[]
			);

		// Handle a country region
		} else if (countries.includes(loc)) {
			
			var n = 0;
			
			var dates[];
			var confirmed[];
			var deaths[];
			
			data[loc].forEach(({ date, confirmed, recovered, deaths }) =>
				{
					// Count up cases and deaths
					date[n] = date;
					confirmed[n] = confirmed;
					deaths[n] = deaths;
				})
				
			//Data
			fill_data(
				dates[], 
				confirmed[],
				deaths[]
			);
			
		// Handle state & county regions
		} else {
			
			// Flag for determined undefined region/location
			var locFlag = false;
			
			// Fetch & check county data from NY Times
			JSC.fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv')
			  .then(response => response.text())
			  .then(data => {
				  
				 let countyData = JSC.csv2Json(data, ",");
				 
				 var dates[];
				 var confirmed[]
				 var deaths[];
				  
				 countyData.forEach(({ date, county, state, fips, cases, deaths }) => 
						{
							
							var n = 0;
							
							if (loc === (county + ", " + state)) {
								locFlag = true;
								// Count up cases and deaths
								date[n] = date;
								confirmed[n] = confirmed;
								deaths[n] = deaths;
								n++;
							}
						
						})
						
					//Data
					fill_data(
						dates[], 
						confirmed[],
						deaths[]
					);
				  
			  });
			  
			// Fetch & check state data from NY Times
			JSC.fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv')
			  .then(response => response.text())
			  .then(data => {
				  
				  let stateData = JSC.csv2Json(data, ",");
				  
				  var dates[];
				  var confirmed[]
				  var deaths[];
			  
				  stateData.forEach(({ date, state, fips, cases, deaths }) => 
					{
						
						var n = 0;
					
						if (loc === state) {
							locFlag = true;
							// Count up cases and deaths
							date[n] = date;
							confirmed[n] = confirmed;
							deaths[n] = deaths;
							n++;
							
						}
					
					})
						
					//Data
					fill_data(
						dates[], 
						confirmed[],
						deaths[]
					);
						
			  });
			  
			if (!locFlag) {
				fill_data(0,0,0)
			}
			
		}
		
	});
	  
});