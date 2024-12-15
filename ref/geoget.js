/* geo position request procedure */
'use strict';
const getGeoData = (callBackFunction1,repeat=3,emul=false) => {
const noVerbose = false,			modulName = `getGeoData: `,
      msgSvr=(msg,type=false)=>{
      		if (noVerbose) {return;}
      		if (type) {console.error(msg);} else {console.log(msg);}
},	       emulGeoInfo={lat:55.337948, lon:86.145195};
	       let geoInfo={lat:null, lon:null}; 
	if (emul) {
		   msgSvr(`${modulName}returns emulated data:`);
		   msgSvr(emulGeoInfo);
		   callBackFunction1(emulGeoInfo);return;}
	if (repeat>20){repeat=20}; 
	const timeOut1=2000, timeOut2=timeOut1*2.5,	attemptMax=repeat,	
	      getData = function getData() {
		let once=true;			
		if ("geolocation" in navigator) {		
				navigator.geolocation.getCurrentPosition((position)=>{	
					const {coords} = position;				  			
					geoInfo.lat = coords.latitude;  /* °N */ 
					geoInfo.lon = coords.longitude; /* °E */ 
				    if (once) {once=false;
							msgSvr(`${modulName}geoData load success.`);
							msgSvr(position);
							callBackFunction1(geoInfo);}							
				});
		};	    
		setTimeout(()=>{
			if (once) {
				msgSvr(`${modulName}No GEO data available.`,true);
				if (repeat>0){repeat--;
					msgSvr(`${attemptMax-repeat}. Attempt to send request...`); 
					setTimeout(getData,timeOut1);
				} else {
					once=false;callBackFunction1(geoInfo);}							
			};
		},timeOut2);
	}();
};