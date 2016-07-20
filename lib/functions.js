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
	
	/*function opacity_comarca (zoom){
		return	zoom > 2 ? false:
						true;
	}*/
	
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
			
			map1987.setView([36.76,-2.67]);
			map1987._onResize();
			map2014.setView([36.76,-2.67]);
			map2014._onResize();
			
		}else if (op=='map1987'){
			show(document.getElementById(op));
			show(document.getElementById('doble_view'));
			
			$('#'+op).removeClass('left_map1987');
			$('#'+op).addClass('simple_view');
			
			$('#tab_1987').addClass('active');
			
			map1987.setView([36.76,-2.67]);
			map1987._onResize();
						
		}else if (op=='map2014'){
			show(document.getElementById(op));
			show(document.getElementById('doble_view'));
			
			$('#'+op).removeClass('right_map2014');
			$('#'+op).addClass('simple_view');
			
			$('#tab_2014').addClass('active');
			
			map2014.setView([36.76,-2.67]);
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
		layer_municipios.resetStyle(e.target);
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
			_str2 = "<p><h4>" + feature.properties.MUNICIPIO + "</h4>" + turf.area(feature).toPrecision(6) + " m2</p>";
			layer.bindPopup(_str2); 
		} 
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
	