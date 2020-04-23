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

// Put the data onto the page
function fill_data(series) {
	
	// Set date of latest info
	var date_options = { year: 'numeric', month: 'short', day: 'numeric' };
	var latest = new Date(g_dates[g_dates.length - 1]).toLocaleDateString("en-US", date_options);
	document.getElementById("date").textContent = latest.toUpperCase();
	
	// Create the chart
	const chart = new JSC.Chart('chart', {
		
		// The type of chart
		type: "line",
		
		legend_visible: true,
		
		legend: {
			position: 'bottom',
			template: '%icon,%name',
		},
		
		xAxis: {
			crosshair_enabled: true,
			scale: { type: 'time' }
		},
		
		defaultSeries: {
			defaultPoint_marker: {
				type: 'circle',
				size: 2,
				outline: {  width: 1,  color: 'currentColor'}
			}
		},

		// The data for the dataset
		series: series,

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
			
			var dates_arr = [];
			var confirmed_arr = [];
			var deaths_arr = [];
			
			var confirmed_list = {};
			var deaths_list = {};
			
			// Loop through each country
			for (n = 0; n < Object.keys(data).length; n++) {
				var date_counter = 0;
				// Loop through each date in country
				Object.values(data)[n].forEach(({ date, confirmed, recovered, deaths }) =>
					{
						if (n <= 0) {
							dates_arr.push(date);
							confirmed_arr.push([date, confirmed]);
							deaths_arr.push([date, deaths]);
						} else {
							confirmed_arr[date_counter] = [date, confirmed_arr[date_counter][1] + (confirmed)];
							deaths_arr[date_counter] = [date, deaths_arr[date_counter][1] + (deaths)];
							date_counter++;
						}
					}
				)
			}
			
			//Data
			g_dates = dates_arr.slice(0);
			
			var series = [
			   {name: 'Cases', points: confirmed_arr},
			   {name: 'Deaths', points: deaths_arr}
			];
			
			fill_data(series);

		// Handle a country region
		} else if (countries.includes(loc)) {
			
			var n = 0;
			
			var dates_arr = [];
			var confirmed_arr = [];
			var deaths_arr = [];
			
			data[loc].forEach(({ date, confirmed, recovered, deaths }) =>
				{
					// Count up cases and deaths
					dates_arr.push(date);
					confirmed_arr.push([date, confirmed]);
					deaths_arr.push([date, deaths]);
				}
			)
				
			//Data
			g_dates = dates_arr.slice(0);
			
			var series = [
			   {name: 'Cases', points: confirmed_arr},
			   {name: 'Deaths', points: deaths_arr}
			];
			
			fill_data(series);
			
		// Handle state & county regions
		} else {
			
			// Check if location already found
			var loc_flag = false;
			
			// Fetch & check county data from NY Times
			JSC.fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv')
			  .then(response => response.text())
			  .then(data => {
				  
				 let countyData = JSC.csv2Json(data, ",");
				 
				 var dates_arr = [];
				 var confirmed_arr = [];
				 var deaths_arr = [];
				  
				 countyData.forEach(({ date, county, state, fips, cases, deaths }) => 
						{
							if (loc === (county + ", " + state)) {
								loc_flag = true;
								// Count up cases and deaths
								dates_arr.push(date);
								confirmed_arr.push([date, cases]);
								deaths_arr.push([date, deaths]);
							}
						}
				 )
				
				if (loc_flag) {
					//Data
					g_dates = dates_arr.slice(0);
					
					var series = [
					   {name: 'Cases', points: confirmed_arr},
					   {name: 'Deaths', points: deaths_arr}
					];
					
					fill_data(series);
				}
				  
			  });
			  
			// Fetch & check state data from NY Times
			JSC.fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv')
			  .then(response => response.text())
			  .then(data => {
				  
				  let stateData = JSC.csv2Json(data, ",");
				  
				  var dates_arr = [];
				  var confirmed_arr = [];
				  var deaths_arr = [];
			  
				  stateData.forEach(({ date, state, fips, cases, deaths }) => 
					{
						if (loc === state) {
							// Count up cases and deaths
							dates_arr.push(date);
							confirmed_arr.push([date, cases]);
							deaths_arr.push([date, deaths]);
						}
					})
							
					if (!loc_flag) {
						//Data
						g_dates = dates_arr.slice(0);
						
						var series = [
						   {name: 'Cases', points: confirmed_arr},
						   {name: 'Deaths', points: deaths_arr}
						];
						
						fill_data(series);
					}
						
			  });
			
		}
		
	});
	  
});