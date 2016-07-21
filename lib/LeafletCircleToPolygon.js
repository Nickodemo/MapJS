
	function createGeodesicPolygon(origin, radius, sides, rotation, projection) {
		//http://stackoverflow.com/questions/24145205/writing-a-function-to-convert-a-circle-to-a-polygon-using-leaflet-js

		var latlon = origin, //leaflet equivalent
			angle,
			new_lonlat, geom_point,
			points = [];

		var destinationVincenty = function(lonlat, brng, dist) {
			//rewritten to work with leaflet
		    var VincentyConstants = {
				    a: 6378137,
				    b: 6356752.3142,
				    f: 1/298.257223563  
				},
		    	a = VincentyConstants.a,
		    	b = VincentyConstants.b,
		    	f = VincentyConstants.f,
		    	lon1 = lonlat.lng,
		    	lat1 = lonlat.lat,
		    	s = dist,
		    	pi = Math.PI,
		    	alpha1 = brng * pi/180,
		    	sinAlpha1 = Math.sin(alpha1),
		    	cosAlpha1 = Math.cos(alpha1),
		    	tanU1 = (1-f) * Math.tan( lat1 * pi/180),
		    	cosU1 = 1 / Math.sqrt((1 + tanU1*tanU1)), sinU1 = tanU1*cosU1,
		    	sigma1 = Math.atan2(tanU1, cosAlpha1),
		    	sinAlpha = cosU1 * sinAlpha1,
		    	cosSqAlpha = 1 - sinAlpha*sinAlpha,
		    	uSq = cosSqAlpha * (a*a - b*b) / (b*b),
		    	A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq))),
		    	B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq))),
		    	sigma = s / (b*A), sigmaP = 2*Math.PI;

		    while (Math.abs(sigma-sigmaP) > 1e-12) {
		        var cos2SigmaM = Math.cos(2*sigma1 + sigma),
		        	sinSigma = Math.sin(sigma),
		        	cosSigma = Math.cos(sigma),
		        	deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
		            			 B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
		        sigmaP = sigma;
		        sigma = s / (b*A) + deltaSigma;
		    }
		    var tmp = sinU1*sinSigma - cosU1*cosSigma*cosAlpha1,
		    	lat2 = Math.atan2(sinU1*cosSigma + cosU1*sinSigma*cosAlpha1,
		        (1-f)*Math.sqrt(sinAlpha*sinAlpha + tmp*tmp)),
		    	lambda = Math.atan2(sinSigma*sinAlpha1, cosU1*cosSigma - sinU1*sinSigma*cosAlpha1),
		    	C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha)),
		    	lam = lambda - (1-C) * f * sinAlpha * 
		    		  (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM))),
		    	revAz = Math.atan2(sinAlpha, -tmp),
		    	lamFunc = lon1 + (lam * 180/pi),
		    	lat2a = lat2 * 180/pi;

		    return L.latLng(lamFunc, lat2a);
		}

		for (var i = 0; i < sides; i++) {
		    angle = (i * 360 / sides) + rotation;
		    new_lonlat = destinationVincenty(latlon, angle, radius); 
		    geom_point = L.latLng(new_lonlat.lng, new_lonlat.lat); 

		    points.push(geom_point); 
		}   

		return points; 
	}

	function toWKT(layer) {
	    
	    var lng, lat, coords = [];

	    if (layer instanceof L.Polygon || layer instanceof L.Polyline)
	    {
	        var latlngs = layer.getLatLngs();

	        for (var i = 0; i < latlngs.length; i++) {
			    	coords.push(latlngs[i].lng + " " + latlngs[i].lat);
			        if (i === 0) {
			        	lng = latlngs[i].lng;
			        	lat = latlngs[i].lat;
			        }
			};

	        if (layer instanceof L.Polygon) {
	            return "POLYGON((" + coords.join(",") + "," + lng + " " + lat + "))";

	        } else if (layer instanceof L.Polyline) {
	            return "LINESTRING(" + coords.join(",") + ")";
	        }
	    }
	    else if (layer instanceof L.Marker) {
	        return "POINT(" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")";
	    }
	}
	
				