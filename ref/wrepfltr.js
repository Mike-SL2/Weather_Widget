/* weather report data filter-converter */

/*	wRepDataFilter(<weather report data object>,[<callback function for output>],<custom names/order parameters Array>); */

/* weather report data object sample:
	d = JSON.parse(`
		{"coord":{"lon":86.1446,"lat":55.3378,"special_object":{"sp1":1,"sp2":2,"sp3":{"spp1":55,"spp2":56}}},
		"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],
		"base":"stations","main":{"temp":287.63,"feels_like":264.26,"temp_min":267.63,"temp_max":267.63,"pressure":1027,
		"humidity":93,"sea_level":1027,"grnd_level":1003},"visibility":5000,"wind":{"speed":2,"deg":359},"snow":{"1h":0.22},
		"clouds":{"all":100},"dt":1733587414,"sys":{"type":1,"id":8950,"country":"RU","sunrise":1733538453,
		"sunset":1733564797},"timezone":25200,"id":1503901,"name":"Kemerovo","cod":200}`
	)
   custom names/order parameters Array of objects sample:
	{<name in filtered data object>: <Friendly name>, "postfix": [<postfix for friendly name>] }
	postfix value also define data object value convert operation, i.e. convert hPa to mmHg, or add a plus sign to temperature
	paraArr = [
		{"name":"City Name", "postfix":""},  
	   	{"main_temp":"Temperature", "postfix":"°C"}, 
	   	{"main_pressure":"Atmosphere Pressure", "postfix":"mmHg"}, 
	   	{"main_humidity":"Relative Humidity", "postfix":"%"},
	   	{"wind_speed":"Wind Speed", "postfix":"м/с"},
	   	{"wind_deg":"Wind Direction", "postfix":"Direction"}
	]
   output is an ARRAY of type:
	out = [
		{<friendly name1>:<weather report value1>},  
		{<friendly name2>:<weather report value2>}, 
		{<friendly name3>:<weather report value3>}, 
		{<friendly name4>:<weather report value4>}, 
		{<friendly name5>:<weather report value5>}, 
		{<friendly name6>:<weather report value6>}, 
	]
*/
'use strict';
const wRepDataFilter = (data,cbFunc=(a)=>{console.log(a);},custArr) => {

let out={}, outKeyName='', run=false, intervalID=0;
const modulName = `wRepDataFilter: `, checkInterval = 500, obje = 'object',
// sample "data" var if no input
dataEmu = JSON.parse(`{"coord":{"lon":86.1446,"lat":55.3378,"special_object":{"sp1":1,"sp2":2,"sp3":{"spp1":55,"spp2":56}}},
"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],
"base":"stations","main":{"temp":287.63,"feels_like":264.26,"temp_min":267.63,"temp_max":267.63,"pressure":1027,
"humidity":93,"sea_level":1027,"grnd_level":1003},"visibility":5000,"wind":{"speed":2,"deg":250},"snow":{"1h":0.22},
"clouds":{"all":100},"dt":1733587414,"sys":{"type":1,"id":8950,"country":"RU","sunrise":1733538453,
"sunset":1733564797},"timezone":25200,"id":1503901,"name":"Kemerovo","cod":200}`),
// sample custom names array if no input
custArrEmu = [	{"weather_0_icon":"iconNumber"},
		{"name":"Метеостанция"},
	   	{"main_temp":"Температура", "postfix":"°C"}, 
	   	{"main_pressure":"Атм. давление", "postfix":"mmHg"}, 
	   	{"main_humidity":"Отн. влажность", "postfix":"%"},
	   	{"wind_speed":"Скорость ветра", "postfix":"м/с"},
	   	{"wind_deg":"Направление", "postfix":"Direction"} ],
noVerbose = false,			
      	msgSvr=(msg,type=false)=>{
      		if (noVerbose) {return;}
      		if (type) {console.error(msg);} else {console.log(msg);}
	};
if (!data) {data=dataEmu;}	if (!custArr) {custArr=custArrEmu;}

//Translating parameter''s names function declaration...
const wNamesTranslate = (customNamesArray,srcDatObj) =>{

const  modulName1=`wNamesTranslate: `, 
psName = 'postfix', tmpPstfx = "°C", prsPstfx = "mmHg", humPstfx = "%", dirPstfx = "Direction",
V = 'Восточный', Z = 'Западный', Y = 'Южный', S = 'Север',
flug=[`${S}ный`,`${S}о-${V}`,V,`Юго-${V}`,Y,`Юго-${Z}`,Z,`${S}о-${Z}`,`${S}ный`];

let natArr=[], auxObject={}, natName='', custValue, celsTemp = 0, celsTempSign='', windDir=0, winDirCount = 0;

msgSvr(`${modulName}${modulName1}loaded.`);
	msgSvr(`${modulName1} custom Names Array:`);	msgSvr(customNamesArray);
	msgSvr(`${modulName1} source Data:`);		msgSvr(srcDatObj);
	msgSvr(`${modulName1} Translating parameter''s names...`);

	customNamesArray.forEach((itm)=>{
		if (typeof itm==='object'){
		    for (let natName in itm){
			custValue=itm[natName];
			if (srcDatObj[natName]!==undefined) { 
				msgSvr(`${modulName1} "${natName}" translated to {"${custValue}": "${srcDatObj[natName]}"}`);
				// parameters adaptation 
				switch (itm[psName]) {
					case tmpPstfx:	
					   celsTemp = Math.trunc(Number(srcDatObj[natName])-273.15);
				           if (celsTemp>0) {celsTempSign='+';} else {celsTempSign='';}
					   auxObject[custValue]=`${celsTempSign}${celsTemp} ${tmpPstfx}`;break;
					case prsPstfx:	
					   auxObject[custValue]=`${Math.trunc(Number(srcDatObj[natName])*.7527803137)} ${prsPstfx}`;break;
					case humPstfx:	
					   auxObject[custValue]=`${srcDatObj[natName]} ${humPstfx}`;	break;
					case dirPstfx:	
						windDir=Number(srcDatObj[natName]);
						winDirCount=0;
						for (let d=22.5;d<338;d+=45){					
							if (windDir>d){winDirCount++;}					
						};	auxObject[custValue]=flug[winDirCount];		break;
					case undefined:	auxObject[custValue]=srcDatObj[natName];	break;				   
				 default: auxObject[custValue]=`${srcDatObj[natName]} ${itm[psName]}`;
				};
			   natArr.push(auxObject);	auxObject={};		   		
			};
		    };		    
		};
	});	msgSvr(`${modulName1} Output data:`);	msgSvr(natArr);
return natArr;
},
//parsing function declaration 
pars = function (){let count=0, arrName=''; const p='_',	modulName2=`${modulName}parsing function `;
msgSvr(`${modulName2}loaded.`);
		function pars2(d1,name=''){
		    if (name) {   name=name+p; };
			if (typeof d1===obje) {
				for (let key in d1) {
					if (Array.isArray(d1[key]))      {arrName=key+p;}
					if (typeof d1[key]===obje){

						count++;											
						   pars(d1[key],key);
						count--;	          arrName='';

					} else {            outKeyName=`${arrName}${name}${key}`;
						        out[outKeyName]=d1[key];
						  msgSvr(`${outKeyName}: ${d1[key]}`); 
						}
				};
			};
		    run=true;
		};
return pars2;
}();		/* start parsing input data object */	
			    pars(data);
		 /* waiting for parsing complete  */
intervalID=setInterval(()=>{if (run) {run=false;
			    } else { 
				clearInterval(intervalID);
				msgSvr(`${modulName}*** callback Function input data ready ***`);
				//Translating parameter''s names for callback Function input...
				cbFunc(wNamesTranslate(custArr,out));
			    };
},checkInterval);
};