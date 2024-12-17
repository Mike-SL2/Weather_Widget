/* weather report aqcuisition */
'use strict';
const weatherReport = (callBackFunction2,geoData,emul=false) =>{
const noVerbose = false,		modulName = 'weatherReport: ',
      msgSvr=(msg,type=false)=>{
      		if (noVerbose) {return;}
      		if (type) {console.error(msg);} else {console.log(msg);}
},
      auxString2 = 'emulated data ',
      inputData = JSON.stringify(geoData),
      emulData = JSON.parse(`{"coord":{"lon":86.1446,"lat":55.3378},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],
"base":"stations","main":{"temp":267.63,"feels_like":264.26,"temp_min":267.63,"temp_max":267.63,"pressure":1027,
"humidity":93,"sea_level":1027,"grnd_level":1003},"visibility":5000,"wind":{"speed":2,"deg":220},"snow":{"1h":0.22},
"clouds":{"all":100},"dt":1733587414,"sys":{"type":1,"id":8950,"country":"RU","sunrise":1733538453,
"sunset":1733564797},"timezone":25200,"id":1503901,"name":"Kemerovo","cod":200}`);

if (inputData.match(/null/)) {
				msgSvr(`${modulName}inconsistent input: ${inputData}, ${auxString2}will be used instead.`,true);
			      	emul=true};
if (emul) {
		msgSvr(`${modulName}${auxString2}return: `); msgSvr(emulData);
		callBackFunction2(emulData);return;}
const   key1 = '3c5932d55547d9b7f4a0cdeaefe74389',
	key2 = 'd370a402479c5aacdfa4713c5ffdd200',
	requestLine = `https://api.openweathermap.org/data/2.5/weather?lat=${geoData.lat}&lon=${geoData.lon}&appid=${key2}`;
//fetch call
msgSvr(`${modulName}Fetch request activated. RequestLine: ${requestLine}`);
fetch(requestLine)
	.then((result)=>{return result.json();})	
	.then((data)=>{
			// weather Report load success
			msgSvr(`${modulName}load success. Data: \n${JSON.stringify({...data, town:geoData.town})}`);
			callBackFunction2({...data, town:geoData.town});
	})
	.catch((e)=>{   
			// weather Report load fail
			msgSvr(`${modulName}error during fetch request. ${e}`,true); 	
	});
};