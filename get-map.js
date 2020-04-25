var g_dates = new Array();

// Put the data onto the page
function fill_data(series) {
	
	// Set date of latest info
	var date_options = { year: 'numeric', month: 'short', day: 'numeric' };
	var latest = new Date(g_dates[g_dates.length - 1]).toLocaleDateString("en-US", date_options);
	document.getElementById("date").textContent = latest.toUpperCase();
	
	// Create the chart
	const chart = new JSC.Chart('map', {
		
			// The type of chart
			type: "map",
			
			legend_visible: false,
	  
			mapping: {
				referenceLayers: 'World',
				projection: false
			},
			
			defaultPoint: {
				tooltip: '<b>%name</b><br/>Cases: %zValue'
			},
			
			defaultPoint_outline_width: 1,
			
			defaultPoint_outline_color: 'rgba(204, 0, 0, 0.5)',
			
			axisToZoom: "xy",

			// The data for the dataset
			series: series
		
		}
	);
	
} 

function color_code(cases, max) {
	
	var color = "rgba(204, 0, 0, 1)";
	
	var percent_max = cases / max;
	
	if (cases == 0) {
		color = "rgba(255, 255, 255, 1)";
	} else if (percent_max < 0.0001) {
		color = "rgba(204, 150, 150, 0.1)";
	} else if (percent_max < 0.001) {
		color = "rgba(204, 0, 0, 0.1)";
	} else if (percent_max < 0.01) {
		color = "rgba(204, 0, 0, 0.3)";
	} else if (percent_max < 0.1) {
		color = "rgba(204, 0, 0, 0.5)";
	} else if (percent_max < 0.5) {
		color = "rgba(204, 0, 0, 0.7)";
	} else if (percent_max < 0.9) {
		color = "rgba(204, 0, 0, 0.9)";
	} else {
		color = "rgba(204, 0, 0, 1)";
	}
	
	return color;
	
}

var unreported = [
	
	"Bermuda",
	"Comoros",
	"Curaçao",
	"Cayman Is.",
	"Greenland",
	"Guam",
	"Hong Kong",
	"Isle of Man",
	"Jersey",
	"Lesotho",
	"Macao",
	"St-Martin",
	"Montserrat",
	"Niue",
	"Nauru",
	"Puerto Rico",
	"Dem. Rep. Korea",
	"Tajikistan",
	"Turkmenistan"
	
];
	  
// Wait for document load
$(document).ready(function(){
	
	// Fetch country data from Rodrigo Pombo & Johns Hopkins CSSE
	fetch('https://pomber.github.io/covid19/timeseries.json')
	  .then(response => response.json())
	  .then(data => {
			
			var max_cases = 0;
			var max_deaths = 0;
			
			var dates_arr = [];
			var country_data = [];
			var points = [];
			
			// Loop through each country for total data
			for (n = 0; n < Object.keys(data).length; n++) {
				// Loop through each date in country
				var subtotal_cases = 0;
				var subtotal_deaths = 0;
				Object.values(data)[n].forEach(({ date, confirmed, recovered, deaths }) =>
					{
						subtotal_cases = confirmed;
						subtotal_deaths = deaths;
					}
				)
				if (subtotal_cases > max_cases) {
					max_cases = subtotal_cases;
				}
				if (subtotal_deaths > max_deaths) {
					max_deaths = subtotal_deaths;
				}
			}
			
			// Loop through each country for individual data
			for (n = 0; n < Object.keys(data).length; n++) {
				
				// Loop through each date in country
				var subtotal_confirmed = 0;
				var subtotal_deaths = 0;
				
				Object.values(data)[n].forEach(({ date, confirmed, recovered, deaths }) =>
					{
						dates_arr.push(date);
						subtotal_confirmed = confirmed;
						subtotal_deaths = deaths;
					}
				)
				
				var country = Object.keys(data)[n];
				var code = country_code(country);
				var color = color_code(subtotal_confirmed, max_cases);
				
				if (code != "...") {
					points.push( { map: code, color: color, z: subtotal_confirmed } );
				}
				
			}
			
			// Push unreported countries
			for (i = 0; i < unreported.length; i++) {
				
				var country = unreported[i];
				var code = country_code(country);
				var color = color_code(0, max_cases);
				
				points.push( { map: code, color: color, z: 0 } );
				
			}
			
			console.log(points);
			
			country_data.push( { points: points } );
			
			//Data
			g_dates = dates_arr.slice(0);
			
			fill_data(country_data);
		
	});
	  
});

function country_code(country) {
	
	switch(country) {

	// Reported
		case "Afghanistan":
		return "af";
		break;
		case "Albania":
		return "al";
		break;
		case "Algeria":
		return "dz";
		break;
		case "Andorra":
		return "ad";
		break;
		case "Angola":
		return "ao";
		break;
		case "Antigua and Barbuda":
		return "ag";
		break;
		case "Argentina":
		return "ar";
		break;
		case "Armenia":
		return "am";
		break;
		case "Australia":
		return "au";
		break;
		case "Austria":
		return "at";
		break;
		case "Azerbaijan":
		return "az";
		break;
		case "Bahamas":
		return "bs";
		break;
		case "Bahrain":
		return "bh";
		break;
		case "Bangladesh":
		return "bd";
		break;
		case "Barbados":
		return "bb";
		break;
		case "Belarus":
		return "by";
		break;
		case "Belgium":
		return "be";
		break;
		case "Benin":
		return "bj";
		break;
		case "Bhutan":
		return "bt";
		break;
		case "Bolivia":
		return "bo";
		break;
		case "Bosnia and Herzegovina":
		return "ba";
		break;
		case "Brazil":
		return "br";
		break;
		case "Brunei":
		return "bn";
		break;
		case "Bulgaria":
		return "bg";
		break;
		case "Burkina Faso":
		return "bf";
		break;
		case "Cabo Verde":
		return "cv";
		break;
		case "Cambodia":
		return "kh";
		break;
		case "Cameroon":
		return "cm";
		break;
		case "Canada":
		return "ca";
		break;
		case "Central African Republic":
		return "cf";
		break;
		case "Chad":
		return "td";
		break;
		case "Chile":
		return "cl";
		break;
		case "China":
		return "cn";
		break;
		case "Colombia":
		return "co";
		break;
		case "Congo (Brazzaville)":
		return "cg";
		break;
		case "Congo (Kinshasa)":
		return "cd";
		break;
		case "Costa Rica":
		return "cr";
		break;
		case "Cote d'Ivoire":
		return "ci";
		break;
		case "Croatia":
		return "hr";
		break;
		case "Diamond Princess":
		return "...";
		break;
		case "Cuba":
		return "cu";
		break;
		case "Cyprus":
		return "cy";
		break;
		case "Czechia":
		return "cz";
		break;
		case "Denmark":
		return "dk";
		break;
		case "Djibouti":
		return "dj";
		break;
		case "Dominican Republic":
		return "do";
		break;
		case "Ecuador":
		return "ec";
		break;
		case "Egypt":
		return "eg";
		break;
		case "El Salvador":
		return "sv";
		break;
		case "Equatorial Guinea":
		return "gq";
		break;
		case "Eritrea":
		return "er";
		break;
		case "Estonia":
		return "ee";
		break;
		case "Eswatini":
		return "sz";
		break;
		case "Ethiopia":
		return "et";
		break;
		case "Fiji":
		return "fj";
		break;
		case "Finland":
		return "fi";
		break;
		case "France":
		return "fr";
		break;
		case "Gabon":
		return "ga";
		break;
		case "Gambia":
		return "gm";
		break;
		case "Georgia":
		return "ge";
		break;
		case "Germany":
		return "de";
		break;
		case "Ghana":
		return "gh";
		break;
		case "Greece":
		return "gr";
		break;
		case "Guatemala":
		return "gt";
		break;
		case "Guinea":
		return "gn";
		break;
		case "Guyana":
		return "gy";
		break;
		case "Haiti":
		return "ht";
		break;
		case "Holy See":
		return "...";
		break;
		case "Honduras":
		return "hn";
		break;
		case "Hungary":
		return "hu";
		break;
		case "Iceland":
		return "is";
		break;
		case "India":
		return "in";
		break;
		case "Indonesia":
		return "id";
		break;
		case "Iran":
		return "ir";
		break;
		case "Iraq":
		return "iq";
		break;
		case "Ireland":
		return "ie";
		break;
		case "Israel":
		return "il";
		break;
		case "Italy":
		return "it";
		break;
		case "Jamaica":
		return "jm";
		break;
		case "Japan":
		return "jp";
		break;
		case "Jordan":
		return "jo";
		break;
		case "Kazakhstan":
		return "kz";
		break;
		case "Kenya":
		return "ke";
		break;
		case "Korea, South":
		return "kr";
		break;
		case "Kuwait":
		return "kw";
		break;
		case "Kyrgyzstan":
		return "kg";
		break;
		case "Latvia":
		return "lv";
		break;
		case "Lebanon":
		return "lb";
		break;
		case "Liberia":
		return "lr";
		break;
		case "Liechtenstein":
		return "li";
		break;
		case "Lithuania":
		return "lt";
		break;
		case "Luxembourg":
		return "lu";
		break;
		case "Madagascar":
		return "mg";
		break;
		case "Malaysia":
		return "my";
		break;
		case "Maldives":
		return "...";
		break;
		case "Malta":
		return "mt";
		break;
		case "Mauritania":
		return "mr";
		break;
		case "Mauritius":
		return "...";
		break;
		case "Mexico":
		return "mx";
		break;
		case "Moldova":
		return "md";
		break;
		case "Monaco":
		return "mc";
		break;
		case "Mongolia":
		return "mn";
		break;
		case "Montenegro":
		return "me";
		break;
		case "Morocco":
		return "ma";
		break;
		case "Namibia":
		return "na";
		break;
		case "Nepal":
		return "np";
		break;
		case "Netherlands":
		return "nl";
		break;
		case "New Zealand":
		return "nz";
		break;
		case "Nicaragua":
		return "ni";
		break;
		case "Niger":
		return "ne";
		break;
		case "Nigeria":
		return "ng";
		break;
		case "North Macedonia":
		return "mk";
		break;
		case "Norway":
		return "no";
		break;
		case "Oman":
		return "om";
		break;
		case "Pakistan":
		return "pk";
		break;
		case "Panama":
		return "pa";
		break;
		case "Papua New Guinea":
		return "pg";
		break;
		case "Paraguay":
		return "py";
		break;
		case "Peru":
		return "pe";
		break;
		case "Philippines":
		return "ph";
		break;
		case "Poland":
		return "pl";
		break;
		case "Portugal":
		return "pt";
		break;
		case "Qatar":
		return "qa";
		break;
		case "Romania":
		return "ro";
		break;
		case "Russia":
		return "ru";
		break;
		case "Rwanda":
		return "rw";
		break;
		case "Saint Lucia":
		return "lc";
		break;
		case "Saint Vincent and the Grenadines":
		return "vc";
		break;
		case "San Marino":
		return "sm";
		break;
		case "Saudi Arabia":
		return "sa";
		break;
		case "Senegal":
		return "sn";
		break;
		case "Serbia":
		return "rs";
		break;
		case "Seychelles":
		return "...";
		break;
		case "Singapore":
		return "sg";
		break;
		case "Slovakia":
		return "sk";
		break;
		case "Slovenia":
		return "si";
		break;
		case "Somalia":
		return "so";
		break;
		case "South Africa":
		return "za";
		break;
		case "Spain":
		return "es";
		break;
		case "Sri Lanka":
		return "lk";
		break;
		case "Sudan":
		return "sd";
		break;
		case "Suriname":
		return "sr";
		break;
		case "Sweden":
		return "se";
		break;
		case "Switzerland":
		return "ch";
		break;
		case "Taiwan*":
		return "tw";
		break;
		case "Tanzania":
		return "tz";
		break;
		case "Thailand":
		return "th";
		break;
		case "Togo":
		return "tg";
		break;
		case "Trinidad and Tobago":
		return "tt";
		break;
		case "Tunisia":
		return "tn";
		break;
		case "Turkey":
		return "tr";
		break;
		case "Uganda":
		return "ug";
		break;
		case "Ukraine":
		return "ua";
		break;
		case "United Arab Emirates":
		return "ae";
		break;
		case "United Kingdom":
		return "gb";
		break;
		case "Uruguay":
		return "uy";
		break;
		case "US":
		return "us";
		break;
		case "Uzbekistan":
		return "uz";
		break;
		case "Venezuela":
		return "ve";
		break;
		case "Vietnam":
		return "vn";
		break;
		case "Zambia":
		return "zm";
		break;
		case "Zimbabwe":
		return "zw";
		break;
		case "Dominica":
		return "dm";
		break;
		case "Grenada":
		return "gd";
		break;
		case "Mozambique":
		return "mz";
		break;
		case "Syria":
		return "sy";
		break;
		case "Timor-Leste":
		return "tp";
		break;
		case "Belize":
		return "bz";
		break;
		case "Laos":
		return "la";
		break;
		case "Libya":
		return "ly";
		break;
		case "West Bank and Gaza":
		return "ps";
		break;
		case "Guinea-Bissau":
		return "gw";
		break;
		case "Mali":
		return "ml";
		break;
		case "Saint Kitts and Nevis":
		return "kn";
		break;
		case "Kosovo":
		return "xk";
		break;
		case "Burma":
		return "mm";
		break;
		case "MS Zaandam":
		return "...";
		break;
		case "Botswana":
		return "bw";
		break;
		case "Burundi":
		return "bi";
		break;
		case "Sierra Leone":
		return "sl";
		break;
		case "Malawi":
		return "mw";
		break;
		case "South Sudan":
		return "ss";
		break;
		case "Western Sahara":
		return "eh";
		break;
		case "Sao Tome and Principe":
		return "st";
		break;
		case "Yemen":
		return "ye";
		break;
		
	// Unreported
		case "Bermuda":
		return "bm";
		break;
		case "Comoros":
		return "km";
		break;
		case "Curaçao":
		return "cw";
		break;
		case "Cayman Is.":
		return "ky";
		break;
		case "Greenland":
		return "gl";
		break;
		case "Guam":
		return "gu";
		break;
		case "Hong Kong":
		return "hk";
		break;
		case "Heard I. and McDonald Is.":
		return "hm";
		break;
		case "Isle of Man":
		return "im";
		break;
		case "Jersey":
		return "je";
		break;
		case "Lesotho":
		return "ls";
		break;
		case "Macao":
		return "mo";
		break;
		case "St-Martin":
		return "mf";
		break;
		case "Montserrat":
		return "ms";
		break;
		case "Niue":
		return "nu";
		break;
		case "Nauru":
		return "nr";
		break;
		case "Puerto Rico":
		return "pr";
		break;
		case "Dem. Rep. Korea":
		return "kp";
		break;
		case "Solomon Is.":
		return "sb";
		break;
		case "St. Pierre and Miquelon":
		return "pm";
		break;
		case "Sint Maarten":
		return "sx";
		break;
		case "Turks and Caicos Is.":
		return "tc";
		break;
		case "Tajikistan":
		return "tj";
		break;
		case "Turkmenistan":
		return "tm";
		break;
		case "Tonga":
		return "to";
		break;
		case "British Virgin Is.":
		return "vg";
		break;
		case "U.S. Virgin Is.":
		return "vi";
		break;
		case "Vanuatu":
		return "vu";
		break;
		case "Samoa":
		return "ws";
		break;
		case "New Caledonia":
		return "nc";
		break;
		case "Somaliland":
		return "sq";
		break;
		
	// Default
		default:
			return "none";
			break;

	}
	
}