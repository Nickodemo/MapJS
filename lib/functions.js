/*
	Custom library for Map Template, by Elena Salido 2016
 (c) 2016, Elena Salido
*/

	function getColor(Usos_suelo) { 
		return  Usos_suelo === "Terrenos con escasa o nula vegetacion" ? '#EFE4BE' : 
				Usos_suelo === "Salinas" ? '#D2EBFF' : 
				Usos_suelo === "Pastizal" ? '#B3FCB3' : 
				Usos_suelo === "Masas de agua" ? '#97DBF2' : 
				Usos_suelo === "Huerta" ? '#EEF1F2' : 
				Usos_suelo === "Frutal" ? '#D68589' : 
				Usos_suelo === "Cultivos forzados" ? '#F0F0F0' : 
				Usos_suelo === "Arbolado forestal" ? '#73B273':
								'#7A6612'; 
	}
	
	function show (elements, specifiedDisplay) {
	  elements = elements.length ? elements : [elements];
	  for (var index = 0; index < elements.length; index++) {
		elements[index].style.display = specifiedDisplay || 'block';
	  }
	}
	
	function hide (elements) {
	  elements = elements.length ? elements : [elements];
	  for (var index = 0; index < elements.length; index++) {
		elements[index].style.display = 'none';
	  }
	}

	//Ocultar o mostrar vistas
	function views_type(op){
		hide(document.getElementById('home'));
		hide(document.getElementById('doble_view'));
		hide(document.getElementById('map1987'));
		hide(document.getElementById('map2014'));
		
		$('#tab_home').removeClass('active');
		$('#tab_1987').removeClass('active');
		$('#tab_2014').removeClass('active');
		$('#tab_doble').removeClass('active');
		$('#tab_sync').removeClass('active');
		syncMaps(true);
		
		if (op=='home'){
			show(document.getElementById(op));	

			$('#tab_home').addClass('active');
			
		}else if (op=='doble_view'){
			show(document.getElementById(op));
			show(document.getElementById('map1987'));
			show(document.getElementById('map2014'));
			
			$('#map1987').removeClass('simple_view');
			$('#map1987').addClass('left_map1987');
			
			$('#map2014').removeClass('simple_view');
			$('#map2014').addClass('right_map2014');
			
			$('#tab_doble').addClass('active');
			
			map1987.setView([36.81,-2.81]);
			map1987._onResize();
			map2014.setView([36.81,-2.81]);
			map2014._onResize();
			
		}else if (op=='map1987'){
			show(document.getElementById(op));
			show(document.getElementById('doble_view'));
			
			$('#'+op).removeClass('left_map1987');
			$('#'+op).addClass('simple_view');
			
			$('#tab_1987').addClass('active');
			
			map1987.setView([36.81,-2.81]);
			map1987._onResize();
						
		}else if (op=='map2014'){
			show(document.getElementById(op));
			show(document.getElementById('doble_view'));
			
			$('#'+op).removeClass('right_map2014');
			$('#'+op).addClass('simple_view');
			
			$('#tab_2014').addClass('active');
			
			map2014.setView([36.81,-2.81]);
			map2014._onResize();
		}		
	}
	
	
	function style(feature) { 
		return {fillColor: getColor(feature.properties.Usos_suelo), 
				weight: 0, 
				opacity: 1,
				fillOpacity: 0.7 
			}; 
	}	
	
	function style_comarca(feature) { 
		return {weight: 3, 
				opacity: 1,
				/*color:'#FFFACD',
				opacity: opacity_comarca,*/
				maxZoom:2
				}; 
	}
	
	function style_municipios(feature) { 
		return {weight: 2, 
				fillOpacity: 0,
				color:'#FFFACD'					
				}; 
	}
	
	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 3,
			color: '#666',
			dashArray: '',
			fillOpacity: 0
		});

	}
	function resetHighlight(e) {
		layer_municipios1987.resetStyle(e.target);
		layer_municipios2014.resetStyle(e.target);
	}
	
	function resalta_municipio(layer){
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});
	}
	
	function PopupArea(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});
		if (feature.properties && feature.properties.MUNICIPIO) {
			_area = turf.area(feature)/1000;//area en km2
			_str2 = "<p><h4>" + feature.properties.MUNICIPIO + "</h4><b>" + _area.toFixed(3) + "</b> km2</p>";
			layer.bindPopup(_str2); 
		} 
	}

	//Funcion que introduciendole un featureCollection y un poligono recorre todo las capas para devolver el área de la interseccion
	function area_interseca_usos(_geojson,_polygon_aux){
		var area = [0,0,0,0,0,0,0,0];
		for( i=0; i<_geojson.features.length; i++ ){
			var interseccion = turf.intersect(_polygon_aux.geometry, _geojson.features[i].geometry);
			if(interseccion !== undefined){			
				
				switch(_geojson.features[i].properties.Usos_suelo){
					case "Masas de agua":
						area[0]=area[0]+turf.area(interseccion);
						break;
					case "Arbolado forestal":
						area[1]=area[1]+turf.area(interseccion);
						break;
					case "Frutal":
						area[2]=area[2]+turf.area(interseccion);
						break;
					case "Cultivos forzados":
						area[3]=area[3]+turf.area(interseccion);
						break;
					case "Huerta":
						area[4]=area[4]+turf.area(interseccion);
						break;
					case "Pastizal":
						area[5]=area[5]+turf.area(interseccion);
						break;
					case "Terrenos con escasa o nula vegetacion":
						area[6]=area[6]+turf.area(interseccion);
						break;
					case "Salinas":
						area[7]=area[7]+turf.area(interseccion);
						break;
					default:				
				}			
				
			}				
		}
	return area;
	}
	
	
	function geoprocesos1987(e){
		var type = e.layerType,//layerType es el tipo de objeto. En este caso puede ser: poligon, rectangulo, círculo o marker.
		layer = e.layer; //'e' es el objecto que dispara la función. En este caso es un poligono de Draw
		
		/*if (map1987.isSynced()) {	//Si el map1987 está sincronizado, que dibuje 'e' en map2014						
			var poligono2014=[];
			for(i=0; i<e.layer._latlngs.length; i++){
				poligono2014[i]=e.layer._latlngs[i];
			}
			L.polygon(poligono2014).addTo(map2014);
		}*/	

		if (type === 'marker') {
			var point_aux=new turf.point([layer._latlng.lng,layer._latlng.lat]);			
			var within;
			var str_municipio='Fuera del ámbito';			
			
			for( i=0; i<9; i++ ){
				within = turf.inside(point_aux, Municipios.features[i]);				
				if (within){//Si within es true, entra
					str_municipio=Municipios.features[i].properties.MUNICIPIO;
				}
			}				
			for( i=0; i<Usos_suelo_1987.features.length; i++ ){
				within = turf.inside(point_aux, Usos_suelo_1987.features[i]);				
				if (within){//Si within es true, entra
					layer.bindPopup('Cobertura: '+ Usos_suelo_1987.features[i].properties.Usos_suelo+' <br>Coordenadas: ('+point_aux.geometry.coordinates[1].toFixed(2)+','+point_aux.geometry.coordinates[0].toFixed(2)+') <br>Municipio: '+str_municipio);
				}
			}

			if (map1987.isSynced()) {	//Si el map1987 está sincronizado
				
				//var punto = map1987.latLngToLayerPoint(layer._latlng);
				var marker2014= new L.marker(layer._latlng).addTo(map2014);
				for( i=0; i<Usos_suelo_2014.features.length; i++ ){
					within = turf.inside(point_aux, Usos_suelo_2014.features[i]);				
					if (within){//Si within es true, entra
						marker2014.bindPopup('Cobertura: '+ Usos_suelo_2014.features[i].properties.Usos_suelo+' <br>Coordenadas: ('+point_aux.geometry.coordinates[1].toFixed(2)+','+point_aux.geometry.coordinates[0].toFixed(2)+') <br>Municipio: '+str_municipio);
					}
				}
			}
			
		}else if (type === 'rectangle'||type === 'polygon'){
			
			var polygon_aux=new L.Polygon(layer._latlngs, layer.options ).toGeoJSON();//convertimos layer en un poligono para poder hacer turf.intersect
			var area = area_interseca_usos(Usos_suelo_1987,polygon_aux);
			char_data = [(area[0]/1000000).toFixed(2),(area[1]/1000000).toFixed(2),(area[2]/1000000).toFixed(2),(area[3]/1000000).toFixed(2),(area[4]/1000000).toFixed(2),(area[5]/1000000).toFixed(2),(area[6]/1000000).toFixed(2),(area[7]/1000000).toFixed(2)];
			
			if (map1987.isSynced()) {	//Si el map1987 está sincronizado						
				
				var poligono2014=[]; //Crea el poligono que almacenará las coordenadas de e
				for(i=0; i<e.layer._latlngs.length; i++){
					poligono2014[i]=e.layer._latlngs[i];
				}
				L.polygon(poligono2014).addTo(map2014); //Dibuja 'e' en map2014
				
				area = area_interseca_usos(Usos_suelo_2014,polygon_aux);
				char_data2 = [(area[0]/1000000).toFixed(2),(area[1]/1000000).toFixed(2),(area[2]/1000000).toFixed(2),(area[3]/1000000).toFixed(2),(area[4]/1000000).toFixed(2),(area[5]/1000000).toFixed(2),(area[6]/1000000).toFixed(2),(area[7]/1000000).toFixed(2)];
			}
			
			$("#info_modal").click();
			//$("#info_prov").text('La superficie de las areas es '+ area[0]+'m2, '+ area[1]+'m2, '+ area[2]+'m2, '+ area[3]+'m2, '+ area[4]+'m2, '+ area[5]+'m2, '+ area[6]+'m2, '+ area[7]+'m2');
			$("#info_prov").text('La superficie de las areas es '+char_data+' '+char_data2);
		}else if (type==='circle'){
			var projection = L.CRS.EPSG4326;
			var polys=createGeodesicPolygon(layer._latlng,layer._mRadius,60, 0,projection);
			var coords = []; // store the geometry
			for (var i = 0; i < polys.length; i++) {
				var geometry = [
					parseFloat(polys[i].lat.toFixed(3)),
					parseFloat(polys[i].lng.toFixed(3))
				]; 
				coords.push(geometry);
			}
			var polyCircle = L.polygon(coords).toGeoJSON();
			console.log('El area del poligono resultante del circulo es: '+turf.area(polyCircle));
			var area = area_interseca_usos(Usos_suelo_1987,polyCircle);
			char_data = [(area[0]/1000000).toFixed(2),(area[1]/1000000).toFixed(2),(area[2]/1000000).toFixed(2),(area[3]/1000000).toFixed(2),(area[4]/1000000).toFixed(2),(area[5]/1000000).toFixed(2),(area[6]/1000000).toFixed(2),(area[7]/1000000).toFixed(2)];
			
			if (map1987.isSynced()) {	//Si el map1987 está sincronizado				
				L.circle(e.layer._latlng,layer._mRadius).addTo(map2014); //Dibuja 'e' en map2014
				
				area = area_interseca_usos(Usos_suelo_2014,polyCircle);
				char_data2 = [(area[0]/1000000).toFixed(2),(area[1]/1000000).toFixed(2),(area[2]/1000000).toFixed(2),(area[3]/1000000).toFixed(2),(area[4]/1000000).toFixed(2),(area[5]/1000000).toFixed(2),(area[6]/1000000).toFixed(2),(area[7]/1000000).toFixed(2)];
			}
			
			//Se crea pop up
			
			$("#info_modal").click();
			//$("#info_prov").text('La superficie de las areas es '+ area[0]+'m2, '+ area[1]+'m2, '+ area[2]+'m2, '+ area[3]+'m2, '+ area[4]+'m2, '+ area[5]+'m2, '+ area[6]+'m2, '+ area[7]+'m2');
			$("#info_prov").text('La superficie de las areas es '+char_data+' '+char_data2);
		}else if (type==='polyline'){//En caso de que sea una polilinea se mide la distancia de ésta, no se hace interseccion con las capas			
			var dist_polyline=layer.measuredDistance();
			$("#info_modal").click();
			$("#info_prov").text('La distancia de la línea es '+dist_polyline);
			//Se crea popup
		}
		
		drawnItems1987.addLayer(layer);
				
	}
	
	function geoprocesos2014(e){
		var type = e.layerType,//layerType es el tipo de objeto. En este caso puede ser: poligon, rectangulo, círculo o marker.
			layer = e.layer; //'e' es el objecto que dispara la función. En este caso es un poligono de Draw

		if (map2014.isSynced()) {	//Si el map2014 está sincronizado, que dibuje 'e' en map1987						
			var poligono1987=[];
			for(i=0; i<e.layer._latlngs.length; i++){
				poligono1987[i]=e.layer._latlngs[i];
			}
			L.polygon(poligono1987).addTo(map1987);						
		}		
		
		if (type === 'marker') {
			var point_aux=new turf.point([layer._latlng.lng,layer._latlng.lat]);			
			var within;
			var str_municipio='Fuera del ámbito';			
			
			for( i=0; i<9; i++ ){
				within = turf.inside(point_aux, Municipios.features[i]);				
				if (within){//Si within es true, entra
					str_municipio=Municipios.features[i].properties.MUNICIPIO;
				}
			}				
			for( i=0; i<Usos_suelo_2014.features.length; i++ ){
				within = turf.inside(point_aux, Usos_suelo_2014.features[i]);				
				if (within){//Si within es true, entra
					layer.bindPopup('Cobertura: '+ Usos_suelo_2014.features[i].properties.Usos_suelo+' <br>Coordenadas: ('+point_aux.geometry.coordinates[1]+','+point_aux.geometry.coordinates[0]+') <br>Municipio: '+str_municipio);
				}
			}			
		}else if (type === 'rectangle'||type === 'polygon'){
			var polygon_aux=new L.Polygon(layer._latlngs, layer.options ).toGeoJSON();//convertimos layer en un poligono para poder hacer turf.intersect
			var area = area_interseca_usos(Usos_suelo_2014,polygon_aux);
			char_data = [(area[0]/1000000).toFixed(2),(area[1]/1000000).toFixed(2),(area[2]/1000000).toFixed(2),(area[3]/1000000).toFixed(2),(area[4]/1000000).toFixed(2),(area[5]/1000000).toFixed(2),(area[6]/1000000).toFixed(2),(area[7]/1000000).toFixed(2)];
			$("#info_modal").click();
			$("#info_prov").text('La superficie de las areas es:  <br>'+ area[0]+'m2, '+ area[1]+'m2, '+ area[2]+'m2, '+ area[3]+'m2, '+ area[4]+'m2, '+ area[5]+'m2, '+ area[6]+'m2, '+ area[7]+'m2');
		}else if (type==='circle'){
			var projection = L.CRS.EPSG4326;
			var polys=createGeodesicPolygon(layer._latlng,layer._mRadius,60, 0,projection);
			var coords = []; // store the geometry
			for (var i = 0; i < polys.length; i++) {
				var geometry = [
					parseFloat(polys[i].lat.toFixed(3)),
					parseFloat(polys[i].lng.toFixed(3))
				]; 
				coords.push(geometry);
			}
			var polyCircle = L.polygon(coords).toGeoJSON();
			console.log('El area del poligono resultante del circulo es: '+turf.area(polyCircle));
			var area = area_interseca_usos(Usos_suelo_2014,polyCircle);
			//Se crea pop up
			char_data = [(area[0]/1000000).toFixed(2),(area[1]/1000000).toFixed(2),(area[2]/1000000).toFixed(2),(area[3]/1000000).toFixed(2),(area[4]/1000000).toFixed(2),(area[5]/1000000).toFixed(2),(area[6]/1000000).toFixed(2),(area[7]/1000000).toFixed(2)];
			$("#info_modal").click();
			$("#info_prov").text('La superficie de las areas es '+ area[0]+'m2, '+ area[1]+'m2, '+ area[2]+'m2, '+ area[3]+'m2, '+ area[4]+'m2, '+ area[5]+'m2, '+ area[6]+'m2, '+ area[7]+'m2');
		}else if (type==='polyline'){//En caso de que sea una polilinea se mide la distancia de ésta, no se hace interseccion con las capas			
			var dist_polyline=layer.measuredDistance();
			$("#info_modal").click();
			$("#info_prov").text('La distancia de la línea es '+dist_polyline);
			//Se crea popup
		}
		
		drawnItems2014.addLayer(layer);

	}
	
	function resetCanvas(){
	  $('#myChart').remove(); // this is my <canvas> element
	  $('.modal-body').append('<canvas id="myChart" width="400" height="400"></canvas>');
	}
	
	//Sincronizar los mapas de 2014 y 1987 con leaflet.sync
	function syncMaps(sem){
		if(sem == false){			
			console.log('LOG: starting sync map: ' + window.performance.now()/10000 + ' sec.');
			map2014.sync(map1987);
			map1987.sync(map2014);
			document.getElementById("etiq_sync").innerHTML = "Desincronizar";
			$('#tab_sync').addClass('active');
			console.log('LOG: ending sync map: ' + window.performance.now()/10000 + ' sec.');
		}else{
			map1987.unsync(map2014);
			map2014.unsync(map1987);
			document.getElementById("etiq_sync").innerHTML = "Sincronizar";
			$('#tab_sync').removeClass('active');
		}
	}
	