/*
	Custom library for Map Template, by Elena Salido 2016
	@license
	Ocupacion del suelo en el Poniente Almeriense
	This software is allowed to use under GPL or you need to obtain Commercial License 
	to use it in non-GPL project. Please contact e.salido.castro@gmail.com for details
	(c) 2016, Elena Salido
*/
	
	function getUrbanoLatLng(i) {
		return new L.LatLng(
			urbano.features[i].properties.Y,
			urbano.features[i].properties.X
		);
	}
	
	function getRiosLatLng(i) {
		return new L.LatLng(
			rios.features[i].properties.Y,
			rios.features[i].properties.X
		);
	}
	
	function getVialesLatLng(i) {
		return new L.LatLng(
			viales.features[i].properties.Y,
			viales.features[i].properties.X
		);
	}
	
	function populate(zoom) {
		$.each(urbano.features, function( index, value ) {				
			if((zoom>=13)||(zoom>=11&&(value.properties.Nombre==="El Ejido" || value.properties.Nombre==="Roquetas de Mar"))||(zoom>=12&&(value.properties.Nombre==="El Ejido" || value.properties.Nombre==="Roquetas de Mar" || value.properties.Nombre==="Adra" || value.properties.Nombre==="Dalías" || value.properties.Nombre==="Félix" || value.properties.Nombre==="Enix" || value.properties.Nombre==="Berja" || value.properties.Nombre==="La Mojonera"))){
				if(value.properties.Nombre==="El Ejido" || value.properties.Nombre==="Roquetas de Mar"){
					var ico = new LargeIcon({ labelText: value.properties.Nombre });
				}else{
					var ico = new SweetIcon({ labelText: value.properties.Nombre });
				}
				markers1987.addLayer(
					new L.Marker(
						getUrbanoLatLng(index),
						{ icon: ico }
					)
				);
				markers2014.addLayer(
					new L.Marker(
						getUrbanoLatLng(index),
						{ icon: ico }
					)
				);
			}	
		});

		return false;
	}
	
	function rivers(zoom) {
		$.each(rios.features, function( index, value ) {				
			if((zoom>=12)||(zoom>=11&&(value.properties.NOM_CAUCE==="Río Adra"))||(zoom>=11&&(value.properties.NOM_CAUCE==="Río Adra" || value.properties.NOM_CAUCE==="Rambla Chico" ))){
				if(value.properties.NOM_CAUCE==="Río Adra"){
					var icoRios = new LargeIconRios({ labelText: value.properties.NOM_CAUCE });
				}else{
					var icoRios = new SweetIconRios({ labelText: value.properties.NOM_CAUCE });
				}
				markers1987.addLayer(
					new L.Marker(
						getRiosLatLng(index),
						{ icon: icoRios }
					)
				);
				markers2014.addLayer(
					new L.Marker(
						getRiosLatLng(index),
						{ icon: icoRios }
					)
				);
			}	
		});

		return false;
	}	
	
	function roads(zoom) {
		$.each(viales.features, function( index, value ) {				
			if(zoom>=13&& value.properties.NOM_VIA==="A-7"){
				var icoViales = new IconViales({ labelText: value.properties.NOM_VIA });
				markers1987.addLayer(
					new L.Marker(
						getVialesLatLng(index),
						{ icon: icoViales }
					)
				);
				markers2014.addLayer(
					new L.Marker(
						getVialesLatLng(index),
						{ icon: icoViales }
					)
				);
			}	
		});

		return false;
	}
		
	function getColor(Usos_suelo) { 
		return  Usos_suelo === "Vegetación escasa" ? '#DEB887' : 
				Usos_suelo === "Salinas" ? '#AFEEEE' : 
				Usos_suelo === "Pastizal" ? '#90EE90' : 
				Usos_suelo === "Masas de agua" ? '#87CEFA' : 
				Usos_suelo === "Huerta" ? '#FFDA89' : 
				Usos_suelo === "Frutal" ? '#FF8C00' : 
				Usos_suelo === "Cultivos forzados" ? '#E6E6FA' : 
				Usos_suelo === "Arbolado forestal" ? '#006400':
								'#7A6612'; 
	}
	
	function getLineViales(vial) { 
		return  vial === "CCONV3O" ? '#F7D75E' : 
				vial === "CCONV2O" ? '#92B863' : 
				vial === "AVIA" ? '#FFFAFD' :
				vial === "NAC" ? '#E76557' : 				
							'#7A6612'; 
	}
	
	function getLineVialesBorder(vial){
		return  vial === "CCONV3O" ? '#323335' : 
				vial === "CCONV2O" ? '#5D502D' : 
				vial === "AVIA" ? '#E76557' : 
				vial === "NAC" ? '#5D502D' : 	
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
		$('#home').hide();
		$('#doble_view').hide();
		$('#map1987').hide();
		$('#map2014').hide();
		$('#etiq_sync').hide();
		
		$('#tab_home').removeClass('active');
		$('#tab_1987').removeClass('active');
		$('#tab_2014').removeClass('active');
		$('#tab_doble').removeClass('active');
		$('#tab_sync').removeClass('active');
		syncMaps(true);
		$('.label_izq, .label_der').hide();
		if (op=='home'){
			$('#'+op).show();
			$('#tab_home').addClass('active');
			
		}else if (op=='doble_view'){
			$(".label_izq, .label_der").show();
			$('#etiq_sync').show();
			$('#map1987').show();
			$('#map2014').show();
			$('#'+op).show();
			
			$('#map1987').removeClass('simple_view');
			$('#map1987').addClass('left_map1987');
			
			$('#map2014').removeClass('simple_view');
			$('#map2014').addClass('right_map2014');
			
			$('#tab_doble').addClass('active');
			resetViews();
			map1987.setView([36.81,-2.81]);
			map2014.setView([36.81,-2.81]);
			
		}else if (op=='map1987'){
			$('#'+op).show();
			$('#doble_view').show();
			
			$('#'+op).removeClass('left_map1987');
			$('#'+op).addClass('simple_view');
			
			$('#tab_1987').addClass('active');
			resetViews();
			map1987.setView([36.81,-2.81]);
						
		}else if (op=='map2014'){
			$('#'+op).show();
			$('#doble_view').show();
			
			$('#'+op).removeClass('right_map2014');
			$('#'+op).addClass('simple_view');
			
			$('#tab_2014').addClass('active');
			resetViews();
			map2014.setView([36.81,-2.81]);
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
				maxZoom:2
				}; 
	}
	
	function style_municipios(feature) { 
		return {weight: 1, 
				fillOpacity: 0,
				dashArray:"3, 5",
				color:'#696969'					
				}; 
	}
	
	function style_comarca(feature) { 
		return {weight: 2, 
				fillOpacity: 0,
				color:'#696969'					
				}; 
	}
	
	function style_urbano(feature) { 
		return {weight: 0.5, 
				fillOpacity: 0.7,
				color:'#DD0005',					
				fillColor:'#EF8E84'
				}; 
	}
	
	function style_viales(feature) { 
		var tipoVia=feature.properties.TIP_VIA_IN;
		if (tipoVia !=='AVIA'){
			return{weight:2, 
					opacity:1,				
					color: getLineViales(feature.properties.TIP_VIA_IN)}
		}
		else {
			return{weight:1, 
					opacity:1,				
					color: getLineViales(feature.properties.TIP_VIA_IN)}
		}					
	}; 	
	
	function style_borderviales(feature){
		return{weight:3, 
			   opacity:1,
			   color: getLineVialesBorder(feature.properties.TIP_VIA_IN)
			   };
	}
	
	function style_rios(feature) { 
		return {weight: 1, 
				opacity:1,		
				color:'#87CEFA'
				}; 
	}
	
	function style_boderrios(feature) { 
		return {weight: 2, 
				opacity:1,		
				color:'#3A6198'
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
	
	function getAreaUsos(area){
		return [(area[0]/1000000).toFixed(2),(area[1]/1000000).toFixed(2),(area[2]/1000000).toFixed(2),(area[3]/1000000).toFixed(2),(area[4]/1000000).toFixed(2),(area[5]/1000000).toFixed(2),(area[6]/1000000).toFixed(2),(area[7]/1000000).toFixed(2)];		
	}
	
	function PopupArea1987(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});
				
		if (feature.properties && feature.properties.MUNICIPIO) {
			var _str2;
			_area = (turf.area(feature)/1000000).toFixed(2);//area en km2						
			_str2 = "<div class='row'><div class='col-xs-4'><img class='img-circle' src='res/"+info_municipios[feature.properties.MUNICIPIO].image_name+"' alt='image' height='105' width='105' style='margin-left: -5px;'></div><div class='col-xs-8'><b><font size='4'>"+ info_municipios[feature.properties.MUNICIPIO].name + "</font></b><br />" + _area + " km<sup>2</sup><canvas id='myPopupChart1987' width='210' height='75'></canvas><br></div></div><div align='justify' style='font-size: 12px;'>"+info_municipios[feature.properties.MUNICIPIO].descrip+"</div>";
			layer.bindPopup(_str2);
		} 
	}
	
	function PopupArea2014(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});
				
		if (feature.properties && feature.properties.MUNICIPIO) {
			var _str2;
			_area = (turf.area(feature)/1000000).toFixed(2);//area en km2						
			_str2 = "<div class='row'><div class='col-xs-4'><img class='img-circle' src='res/"+info_municipios[feature.properties.MUNICIPIO].image_name+"' alt='image' height='105' width='105' style='margin-left: -5px;'></div><div class='col-xs-8'><b><font size='4'>"+ info_municipios[feature.properties.MUNICIPIO].name + "</font></b><br />" + _area + " km<sup>2</sup><canvas id='myPopupChart2014' width='210' height='75'></canvas><br></div></div><div align='justify' style='font-size: 12px;'>"+info_municipios[feature.properties.MUNICIPIO].descrip+"</div>";
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
					case "Vegetación escasa":
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
	
	function getUsosComarca1987(){
		
		var area = [1534405.0261893386, 167425103.44445452, 93311603.69159798, 64192090.031693265, 130397473.96556792, 417351403.3479667, 96019612.86987019, 5144793.641279345];
		char_data = getAreaUsos(area);
		
		if (map1987.isSynced()) {	//Si el map1987 está sincronizado						
			area = [3904793.9307883903, 162969676.5167371, 120750538.58486266, 167550449.79072148, 138063717.81172565, 371371978.33914477, 11458788.484546002, 3700713.008235066];
			char_data2014 = getAreaUsos(area);
		}
		//Se crea pop up
		$("#info_modal").click();
		$("#info_prov").html('El total de la superficie de la comarca en 1987 es: <b>'+(turf.area(Municipios)/1000000).toFixed(2)+'</b> km<sup>2</sup>');
	}
	
	function getUsosComarca2014(){
		
		var area = [3904793.9307883903, 162969676.5167371, 120750538.58486266, 167550449.79072148, 138063717.81172565, 371371978.33914477, 11458788.484546002, 3700713.008235066];
		char_data = getAreaUsos(area);
		
		if (map1987.isSynced()) {	//Si el map1987 está sincronizado						
			area = [1534405.0261893386, 167425103.44445452, 93311603.69159798, 64192090.031693265, 130397473.96556792, 417351403.3479667, 96019612.86987019, 5144793.641279345];
			char_data = getAreaUsos(area);					
			area = [3904793.9307883903, 162969676.5167371, 120750538.58486266, 167550449.79072148, 138063717.81172565, 371371978.33914477, 11458788.484546002, 3700713.008235066];
			char_data2014 = getAreaUsos(area);
		}
		//Se crea pop up
		$("#info_modal").click();
		$("#info_prov").html('El total de la superficie de la comarca en 2014 es: <b>'+(turf.area(Municipios)/1000000).toFixed(2)+'</b> km<sup>2</sup>');
	}
	
	function geoprocesos1987(e){
		var type = e.layerType,//layerType es el tipo de objeto. En este caso puede ser: poligon, rectangulo, círculo o marker.
			layer = e.layer; //'e' es el objecto que dispara la función. En este caso es un poligono de Draw
		poly = false;
		if (type === 'marker') {
			var utm = mouse_control._geo2utm(layer._latlng);
			if(getMunicipio(layer)=="Fuera del ámbito"){
				var str="<div class='row'> 	<div class='col-xs-12'>	<b><font size='4'>"+ getMunicipio(layer) +"</font> 		</b></div>  </div> <div class='row elems_popup'> 	<div class='col-xs-2'> 		<img class='img' src='res/marker-icon.png' alt='image' height='15' width='10' style='margin-left: 5px;'> 	</div> 	<div class='col-xs-10' style='font-size: 13px;'> 		"+ utm.x +" E,"+ utm.y +" N 	</div> </div> <div class='row elems_popup'> 	<div class='col-xs-2'> 		<div class='polig' ></div> 	</div> 	<div id='uso_popup_1987' class='col-xs-10' style='font-size: 14px;'>"+getUso1987(layer)+"</div> </div>";
				layer.bindPopup(str);
			}else{
				var str="<div class='row'> 	<div class='col-xs-12'>	<b><font size='4'>"+ info_municipios[getMunicipio(layer)].name +"</font> 		</b></div>  </div> <div class='row elems_popup'> 	<div class='col-xs-2'> 		<img class='img' src='res/marker-icon.png' alt='image' height='15' width='10' style='margin-left: 5px;'> 	</div> 	<div class='col-xs-10' style='font-size: 13px;'> 		"+ utm.x +" E,"+ utm.y +" N 	</div> </div> <div class='row elems_popup'> 	<div class='col-xs-2'> 		<div class='polig' ></div> 	</div> 	<div id='uso_popup_1987' class='col-xs-10' style='font-size: 14px;'>"+getUso1987(layer)+"</div> </div>";
				layer.bindPopup(str);

				if (map1987.isSynced()) {	//Si el map1987 está sincronizado				
					var marker2014= new L.marker(layer._latlng).addTo(drawnItems2014_edit);
					str="<div class='row'> 	<div class='col-xs-12'>	<b><font size='4'>"+ info_municipios[getMunicipio(layer)].name +"</font> 		</b></div>  </div> <div class='row elems_popup'> 	<div class='col-xs-2'> 		<img class='img' src='res/marker-icon.png' alt='image' height='15' width='10' style='margin-left: 5px;'> 	</div> 	<div class='col-xs-10' style='font-size: 13px;'> 		"+ utm.x +" E,"+ utm.y +" N 	</div> </div> <div class='row elems_popup'> 	<div class='col-xs-2'> 		<div class='polig' ></div> 	</div> 	<div id='uso_popup_2014' class='col-xs-10' style='font-size: 14px;'>"+getUso2014(layer)+"</div> </div>";
					marker2014.bindPopup(str);
				}
			}
		}else if (type === 'rectangle'||type === 'polygon'){
			
			var polygon_aux=new L.Polygon(layer._latlngs, layer.options );//convertimos layer en un poligono para poder hacer turf.intersect
			var area = area_interseca_usos(Usos_suelo_1987,polygon_aux.toGeoJSON());
			char_data = getAreaUsos(area);
			
			if (map1987.isSynced()) {	//Si el map1987 está sincronizado						
				polygon_aux.addTo(drawnItems2014_edit); //Dibuja 'e' en map2014				
				area = area_interseca_usos(Usos_suelo_2014,polygon_aux.toGeoJSON());
				char_data2014 = getAreaUsos(area);
			}
			//Se crea pop up
			$("#info_modal").click();
			$("#info_prov").html('La superficie del poligono seleccionado es: <b>'+(turf.area(layer.toGeoJSON())/1000000).toFixed(2)+'</b> km<sup>2</sup>');
			
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
			var area = area_interseca_usos(Usos_suelo_1987,polyCircle);
			char_data =  getAreaUsos(area);
			
			if (map1987.isSynced()) {	//Si el map1987 está sincronizado				
				L.circle(e.layer._latlng,layer._mRadius).addTo(drawnItems2014_edit); //Dibuja 'e' en map2014				
				area = area_interseca_usos(Usos_suelo_2014,polyCircle);
				char_data2014 =  getAreaUsos(area);
			}
			//Se crea pop up
			$("#info_modal").click();
			$("#info_prov").html('La superficie del circulo seleccionado es: <b>'+(turf.area(polyCircle)/1000000).toFixed(2)+'</b> km<sup>2</sup>');
		}else if (type==='polyline'){//En caso de que sea una polilinea se mide la distancia de ésta, no se hace interseccion con las capas			
			var dist_polyline=layer.measuredDistance();
			//Se crea popup
			$("#info_modal").click();
			$("#info_prov").html('La distancia es <b>'+dist_polyline+'</b> km<sup>2</sup>');
			poly = true;
		}
		
		drawnItems1987.addLayer(layer);
				
	}
	
	function geoprocesos2014(e){
		var type = e.layerType,//layerType es el tipo de objeto. En este caso puede ser: poligon, rectangulo, círculo o marker.
			layer = e.layer; //'e' es el objecto que dispara la función. En este caso es un poligono de Draw
		poly = false;
		if (type === 'marker') {
			var utm = mouse_control2014._geo2utm(layer._latlng);
			if(getMunicipio(layer)=="Fuera del ámbito"){
				var str="<div class='row'> 	<div class='col-xs-12'>	<b><font size='4'>"+ getMunicipio(layer) +"</font> 		</b></div>  </div> <div class='row elems_popup'> 	<div class='col-xs-2'> 		<img class='img' src='res/marker-icon.png' alt='image' height='15' width='10' style='margin-left: 5px;'> 	</div> 	<div class='col-xs-10' style='font-size: 13px;'> 		"+ utm.x +" E,"+ utm.y +" N 	</div> </div> <div class='row elems_popup'> 	<div class='col-xs-2'> 		<div class='polig' ></div> 	</div> 	<div id='uso_popup_2014' class='col-xs-10' style='font-size: 14px;'>"+getUso2014(layer)+"</div> </div>";
				layer.bindPopup(str);
			}else{
				var str="<div class='row'> 	<div class='col-xs-12'>	<b><font size='4'>"+ info_municipios[getMunicipio(layer)].name +"</font> 		</b></div>  </div> <div class='row elems_popup'> 	<div class='col-xs-2'> 		<img class='img' src='res/marker-icon.png' alt='image' height='15' width='10' style='margin-left: 5px;'> 	</div> 	<div class='col-xs-10' style='font-size: 13px;'> 		"+ utm.x +" E,"+ utm.y +" N 	</div> </div> <div class='row elems_popup'> 	<div class='col-xs-2'> 		<div class='polig' ></div> 	</div> 	<div id='uso_popup_2014' class='col-xs-10' style='font-size: 14px;'>"+getUso2014(layer)+"</div> </div>";
				layer.bindPopup(str);
				if (map2014.isSynced()) {	//Si el map2014 está sincronizado
					var marker1987= new L.marker(layer._latlng).addTo(drawnItems1987_edit);
					str="<div class='row'> 	<div class='col-xs-12'>	<b><font size='4'>"+ info_municipios[getMunicipio(layer)].name +"</font> 		</b></div>  </div> <div class='row elems_popup'> 	<div class='col-xs-2'> 		<img class='img' src='res/marker-icon.png' alt='image' height='15' width='10' style='margin-left: 5px;'> 	</div> 	<div class='col-xs-10' style='font-size: 13px;'> 		"+ utm.x +" E,"+ utm.y +" N 	</div> </div> <div class='row elems_popup'> 	<div class='col-xs-2'> 		<div class='polig' ></div> 	</div> 	<div id='uso_popup_1987' class='col-xs-10' style='font-size: 14px;'>"+getUso1987(layer)+"</div> </div>";
					marker1987.bindPopup(str);
				}
			}
		}else if (type === 'rectangle'||type === 'polygon'){
			var polygon_aux=new L.Polygon(layer._latlngs, layer.options );//convertimos layer en un poligono para poder hacer turf.intersect
			var area = area_interseca_usos(Usos_suelo_2014,polygon_aux.toGeoJSON());
			char_data2014 =  getAreaUsos(area);
			
			if (map2014.isSynced()) {	//Si el map1987 está sincronizado
				polygon_aux.addTo(drawnItems1987_edit);
				area = area_interseca_usos(Usos_suelo_1987,polygon_aux.toGeoJSON());
				char_data =  getAreaUsos(area);
			}
			//Se crea pop up
			$("#info_modal").click();
			$("#info_prov").html('La superficie del poligono seleccionado es: <b>'+(turf.area(layer.toGeoJSON())/1000000).toFixed(2)+'</b> km<sup>2</sup>');
			
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
			var area = area_interseca_usos(Usos_suelo_2014,polyCircle);
			char_data2014 =  getAreaUsos(area);
			
			if (map2014.isSynced()) {	//Si el map1987 está sincronizado				
				L.circle(e.layer._latlng,layer._mRadius).addTo(drawnItems1987_edit);				
				area = area_interseca_usos(Usos_suelo_1987,polyCircle);
				char_data =  getAreaUsos(area);
			}
			//Se crea pop up
			$("#info_modal").click();
			$("#info_prov").html('La superficie del circulo seleccionado es: <b>'+(turf.area(polyCircle)/1000000).toFixed(2)+'</b> km<sup>2</sup>');
		}else if (type==='polyline'){//En caso de que sea una polilinea se mide la distancia de ésta, no se hace interseccion con las capas			
			var dist_polyline=layer.measuredDistance();
			//Se crea popup
			$("#info_modal").click();
			$("#info_prov").html('La distancia es <b>'+dist_polyline+'</b> km<sup>2</sup>');
			poly = true;
		}
		drawnItems2014.addLayer(layer);
	}
	
	function getUso1987(layer){
		var point_aux=new turf.point([layer._latlng.lng,layer._latlng.lat]);			
		var within;
		var str_uso='Uso fuera del ámbito';			
					
		for( i=0; i<Usos_suelo_1987.features.length; i++ ){
			within = turf.inside(point_aux, Usos_suelo_1987.features[i]);				
			if (within){//Si within es true, entra
				str_uso = Usos_suelo_1987.features[i].properties.Usos_suelo;
			}
		}
		return(str_uso);
	}
	
	function getUso2014(layer){
		var point_aux=new turf.point([layer._latlng.lng,layer._latlng.lat]);			
		var within;
		var str_uso='Uso fuera del ámbito';			
					
		for( i=0; i<Usos_suelo_2014.features.length; i++ ){
			within = turf.inside(point_aux, Usos_suelo_2014.features[i]);				
			if (within){//Si within es true, entra
				str_uso = Usos_suelo_2014.features[i].properties.Usos_suelo;
			}
		}
		return(str_uso);
	}
	
	function getMunicipio(layer){
		var point_aux=new turf.point([layer._latlng.lng,layer._latlng.lat]);
		var within;
		var str_municipio='Fuera del ámbito';
		for( i=0; i<9; i++ ){
			within = turf.inside(point_aux, Municipios.features[i]);				
			if (within){//Si within es true, entra
				str_municipio=Municipios.features[i].properties.MUNICIPIO;
			}
		}
		return(str_municipio);
	}
	
	function resetCanvas(sem){
		$('#myChart').remove(); // this is my <canvas> element
		$('#myRadarChart').remove();
		if(sem){
			$('.modal-body').append('<canvas id="myRadarChart" width="400" height="400"></canvas>');
		}else{
			$('.modal-body').append('<canvas id="myChart" width="400" height="400"></canvas>');
		}
	}
	
	function resetViews(){
		$("#map1987").height($(window).height() - 90 - $(".masthead").height());
		$("#map2014").height($(window).height() - 90 - $(".masthead").height());
		if($("#tab_doble").attr("class")==="active"){
			$("#map1987").height($(window).height() - 90 - $(".masthead").height() - $(".label_izq").height());
			$("#map2014").height($(window).height() - 90 - $(".masthead").height() - $(".label_der").height());
		}
		map1987.invalidateSize();
		map2014.invalidateSize();
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
	
	function export_chart(){		
		var canvas = document.getElementById("myChart");
		if (map2014.isSynced()||map1987.isSynced()) {
			canvas = document.getElementById("myRadarChart");
		}
		var img = document.getElementById("laimagen");
		img.src = canvas.toDataURL("image/png");
		window.open(img.src);
	}
	

	