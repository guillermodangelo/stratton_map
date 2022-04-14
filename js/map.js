var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  });
  
  var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0','mt1','mt2','mt3']
  });

  const extent = [25.8, -80.234];

	var map = L.map('map', {
		center: extent,
		zoom: 10,
    zoomControl: false,
    preferCanvas: true,
		layers: googleTerrain
	});

  var baseLayers = {
    "Roads": googleTerrain,
    "Image": Esri_WorldImagery
    };

L.control.layers(baseLayers).addTo(map);

var zoomHome = L.Control.zoomHome({
	position: 'bottomright',
	zoomHomeIcon: 'rotate-right'
	});
zoomHome.addTo(map);



function getColor(d) {
		return	d === 'Permitted' ? '#0868ac' :
            d === 'Not permitted' ? '#cb181d' :
            d === 'TBD' ? '#fee391' :
            '#252525';
	}


  function style(feature) {
   var color = getColor(feature.properties.STATUS);
   return {
     color: color,
     weight: 1,
   };
 }

 map.createPane('myPane');
 map.getPane('myPane').style.opacity = 1;
 
 
 function popUpMaker(county, name, status, url) {
    var countyHTML = `<b> County: </b> ${county} </br>`
    var nameHTML = `<b> City: </b> ${name} </br>`
    var statusHTML = `<b> STR Regulation: </b> ${status}`
      if (url) {
        var urlHTML = `</br> <a href="${url}" target="_blank">Go to web-page</a>`
        var popUpContent = countyHTML + nameHTML + statusHTML + urlHTML
      } else {
        var popUpContent = countyHTML + nameHTML + statusHTML
      }
    return popUpContent;
 }

 var county = L.geoJson(mdbw_v3, {
   pane: 'myPane',
   onEachFeature: function (feature, layer) {
    layer.bindPopup(
      popUpMaker(
        feature.properties.COUNTY,
        feature.properties.NAME,
        feature.properties.STATUS,
        feature.properties.URL
        )
      );
    },
   style: style,
  }).addTo(map);


// var county = L.geoJson(mdbw_v3, {
//    pane: 'myPane'
//  }).addTo(map);


//  county.bindPopup(
//   popUpMaker(county.COUNTY, 'a', 'a', 'a')
//    );

//   console


 const search = new GeoSearch.GeoSearchControl({
  notFoundMessage: 'Address not found. Contact us to improve this tool.',
  provider: new GeoSearch.OpenStreetMapProvider({
    params: {
      countrycodes: 'us',
      viewbox: [-80.914, 25.115, -80.002, 26.379],
      bounded: 1
    }
  }),
  showMarker: false, // optional: true|false  - default true
  showPopup: false, // optional: true|false  - default false
  searchLabel: 'Find your STR regulation', // optional: string
  //marker: {
  //  icon: new L.Icon.Default(),
  //  draggable: false,
  //},
  //popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
  //resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
  //keepResult: true, // optional: true|false  - default false
  style: 'bar'
});


map.addControl(search);

function searchEventHandler(result) {
  var coords = L.latLng(result.location.y, result.location.x)
  var markerSearch = L.marker(coords).addTo(map);
  var results = leafletPip.pointInLayer(coords, county, first=true);
    if (results.length > 0) {
      var popUpData = (results[0].feature.properties);
        popUp = popUpMaker(
          popUpData.COUNTY,
          popUpData.NAME,
          popUpData.STATUS,
          popUpData.URL
          );
    } else {
      var popUp = "<b>Short Term Rentals regulations are only available " + 
                  "for Miami-Dade and Broward counties at the moment.</b>"
    };
  markerSearch.bindPopup(popUp).openPopup();
};


map.on('geosearch/showlocation', searchEventHandler);


// map.on('moveend', function() {
// 			var layer = map.getLayerAt(200, 200);
// 			var layerName = layer ? layer.options.name : 'none';
// 			console.log(layerName)
// 		}, 1000);

// var polygons = [];

// for(var i = 0; i < mdbw_v3.features.length; i++) {
//     var obj = mdbw_v3.features[i];
//     polygons.push(obj);
// }

// var turf_polygons = turf.featureCollection(polygons);

// console.log(turf_polygons.features[0].properties)

// function searchEventHandler(result) {
//   var point = turf.featureCollection([
//     turf.point([result.location.x, result.location.y
//   ])
// ]);

//   var tagged = turf.tag(point, turf_polygons, 'NAME', 'NAME');
//   var result = L.geoJSON(tagged);
//   result.addTo(map);
//   console.log(tagged)

//   popup_text = tagged.features[0].properties.NAME

//   console.log(tagged.features[0].properties)
  
//   if (popup_text == null){
//     popup_text = 'Outside the AOI'
//   }

//   var popup = L.popup().setContent(popup_text);
//   result.bindPopup(popup).openPopup();
// }

