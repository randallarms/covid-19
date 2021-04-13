// Wait for document load
$(document).ready(function(){
	
	// Fetch country data from Rodrigo Pombo & Johns Hopkins CSSE
	fetch('https://pomber.github.io/covid19/timeseries.json')
	  .then(response => response.json())
	  .then(data => {
		  
			var countries;
			var list = document.getElementById("list");
			
			for (n = 0; n < Object.keys(data).length; n++) {
				
				var country = Object.keys(data)[n];
				var text1 = document.createTextNode("case \"" + country + "\":");
				var text2 = document.createTextNode("return \"...\";");
				var text3 = document.createTextNode("break;");
				
				list.append(text1);
				list.append(document.createElement("br"));
				list.append(text2);
				list.append(document.createElement("br"));
				list.append(text3);
				list.append(document.createElement("br"));
				
			}
		
	});
	  
});