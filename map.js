// Put your zillow.com API key here
var zwsid = "X1-ZWz1g132xfkgsr_55f1z";

var request = new XMLHttpRequest();
var out="";

function initialize () {
	
	var myLatLng = {lat: 32.75, lng: -97.13};
	var geocoder = new google.maps.Geocoder();
  
  var mapProp= {
    center:new google.maps.LatLng(32.75,-97.13),
    zoom:17,
};
	var map=new google.maps.Map(document.getElementById("map"),mapProp);
    var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: ''+myLatLng.lat+','+myLatLng.lng
  }); 
  
}

function displayResult () {
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
		var latitude = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("latitude")[0].innerHTML;
		var longitude = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("longitude")[0].innerHTML;
		var street = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("street")[0].innerHTML
		var city = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("city")[0].innerHTML
		var state = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("state")[0].innerHTML
		var zipcode = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("zipcode")[0].innerHTML
		var address = street+" "+city+" "+state+" "+zipcode
		changeMarker(latitude,longitude,address,value);
		
    }
}


//Method to clear text input field on click of Clear button.
function clearRequest(){
	document.getElementById("address").value = "";
}

function sendRequest () {
    request.onreadystatechange = displayResult;
    var addressInput = document.getElementById("address").value;
	var addressWithoutComma = addressInput.split(",");
	var addressString = addressWithoutComma[0]+addressWithoutComma[1]+addressWithoutComma[2];
	var addressArray = addressString.split(" ");
	var addressOnly = ""
	for(var i=0;i<addressArray.length-3;i++){
		addressOnly+=addressArray[i]+" ";
	}
	console.log(addressOnly)
    var citystatezip = addressArray[addressArray.length-3]+" "+addressArray[addressArray.length-2]+" "+addressArray[addressArray.length-1];
	console.log(citystatezip)
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+addressOnly+"&citystatezip="+citystatezip);
    request.withCredentials = "true";
    request.send(null);
}


//Method that implements geocoding and reverse geocoding. 
function changeMarker(latitude,longitude,address,value){
	var geocoder;
	var map;
	var infowindow;
	var value1;
	
	
	geocoder = new google.maps.Geocoder();
	infowindow = new google.maps.InfoWindow;
    var latlng = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
      zoom: 17,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);


  var marker = new google.maps.Marker({
    position: latlng,
    map: map,
    title: ''+address+' | Zestimate Value:$'+value
  });
  
  out+= "Address: " +address+"   Zestimate Value: $"+value+"\n"
  document.getElementById("show").innerHTML = out;
  
  //Event listener for onclick of map. New request for web service sent in this method to fetch Zestimate value.
  google.maps.event.addListener(map, 'click', function(event) {
  geocoder.geocode({
    'latLng': event.latLng
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
		  if(marker && marker.setMap){
		  marker.setMap(null);
	  }
			var req = new XMLHttpRequest();
			var address1 = results[0].formatted_address;
			var temp = address1.split(',');
			address1 = temp[0]+","+temp[1]+","+temp[2];
			console.log(address1)
			req.onreadystatechange = function(){
			if(this.readyState==4){
				var xml = req.responseXML.documentElement;
				value1 = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
				marker = new google.maps.Marker({
					position: event.latLng,
					map: map,
					title: ''+results[0].formatted_address+' | Zestimate Value: $'+value1
				});
				map.panTo(event.latLng)
				out+= "Address: " +address1+"   Zestimate Value: $"+value1+"\n"
				document.getElementById("show").innerHTML = out;
				//console.log(n);	
			}
		};
			req.open("GET","proxy.php?zws-id="+zwsid+"&address="+temp[0]+"&citystatezip="+temp[1]+" "+temp[2]);
			req.withCredentials = "true";
			req.send(null);	
			
      }
    }
  });
});
  
}











