// defines GPS coordinates by town name
'use strict';
const townGeoData = (callBackFunction3,cityName,emul=false) =>{
const noVerbose = false,	modulName = `townGeoData: `,	
      msgSvr=(msg,type=false)=>{
      		if (noVerbose) {return;}
      		if (type) {console.error(msg);} else {console.log(msg);}
},	key2 = 'd370a402479c5aacdfa4713c5ffdd200',
	emulGeoInfo={lat:55.337948, lon:86.145195}, nullGeoInfo = {lat:null, lon:null},
	requestLine = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${key2}`;

if (emul){msgSvr(`${modulName}Emulated geoData return:`); 
	  msgSvr(emulGeoInfo);
	  callBackFunction3(emulGeoInfo);return;}
if (cityName) {
//fetch call
msgSvr(`${modulName}Fetch request activated. RequestLine: ${requestLine}`);
fetch(requestLine)
	.then((result)=>{return result.json();})	
	.then((data)=>{
			// if townGeoData load success	
			if (data[0]) {		
				msgSvr(`${modulName}townGeoData load success.`);
				msgSvr(`Country: ${data[0].country}`);			
				msgSvr(`Town: ${data[0].name}, lat:${data[0].lat}, lon:${data[0].lon}`);
				callBackFunction3({lat:data[0].lat, lon:data[0].lon});
			} else {
				msgSvr(`${modulName}townGeoData load fail.(For city name: "${cityName}")`,true);
				msgSvr(data);
				callBackFunction3(nullGeoInfo);}				
	})
	.catch((e)=>{   
			// townGeoData load fail
			msgSvr(`${modulName}error during fetch request. ${e}`,true);
			callBackFunction3(nullGeoInfo);	
	});
} else {msgSvr(`${modulName}no townName specified.`,true);callBackFunction3(nullGeoInfo);}
};