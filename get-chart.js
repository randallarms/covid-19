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

var g_dates = new Array();
var g_cases = new Array();
var g_deaths = new Array();

// Put the data onto the page
function fill_data() {
	
	// Set date of latest info
	var latest = g_dates[g_dates.length - 1];
	document.getElementById("date").textContent = latest.toUpperCase();
	
	// Create the chart
	var ctx = document.getElementById('chart').getContext('2d');
	var chart = new Chart(ctx, {
		
		// The type of chart we want to create
		type: 'line',

		// The data for the dataset
		data: {
			labels: g_dates,
			datasets: [{
				label: 'Cases',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
				data: g_cases
			}, {
				label: 'Deaths',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
				data: g_deaths
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
			
			var dates = new Array();
			var confirmed = new Array();
			var deaths = new Array();
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
			g_dates = dates.slice(0);
			g_confirmed = confirmed.slice(0);
			g_deaths = deaths.slice(0);
			fill_data();

		// Handle a country region
		} else if (countries.includes(loc)) {
			
			var n = 0;
			
			var dates = new Array();
			var confirmed = new Array();
			var deaths = new Array();
			
			data[loc].forEach(({ date, confirmed, recovered, deaths }) =>
				{
					// Count up cases and deaths
					date[n] = date;
					confirmed[n] = confirmed;
					deaths[n] = deaths;
				})
				
			//Data
			g_dates = dates.slice(0);
			g_confirmed = confirmed.slice(0);
			g_deaths = deaths.slice(0);
			fill_data();
			
		// Handle state & county regions
		} else {
			
			// Flag for determined undefined region/location
			var locFlag = false;
			
			// Fetch & check county data from NY Times
			JSC.fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv')
			  .then(response => response.text())
			  .then(data => {
				  
				 let countyData = JSC.csv2Json(data, ",");
				 
				 var dates = new Array();
				 var confirmed = new Array();
				 var deaths = new Array();
				  
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
					g_dates = dates.slice(0);
					g_confirmed = confirmed.slice(0);
					g_deaths = deaths.slice(0);
					fill_data();
				  
			  });
			  
			// Fetch & check state data from NY Times
			JSC.fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv')
			  .then(response => response.text())
			  .then(data => {
				  
				  let stateData = JSC.csv2Json(data, ",");
				  
				  var dates = new Array();
				  var confirmed = new Array();
				  var deaths = new Array();
			  
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
					g_dates = dates.slice(0);
					g_confirmed = confirmed.slice(0);
					g_deaths = deaths.slice(0);
					fill_data();
						
			  });
			  
			// Handling for location not set/found
			if (!locFlag) {
				fill_data();
			}
			
		}
		
	});
	  
});