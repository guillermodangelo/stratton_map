  var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0','mt1','mt2','mt3']
  });

  const extent = [25.8, -80.234];

	var map = L.map('map', {
		center: extent,
		zoom: 9,
    zoomControl: false,
    preferCanvas: true,
		layers: googleTerrain
	});

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


  // const search = new GeoSearch.GeoSearchControl({
  //   notFoundMessage: 'Address not found. Contact us to improve this tool.',
  //   provider: new GeoSearch.OpenStreetMapProvider({
  //     params: {
  //       countrycodes: 'us',
  //       viewbox: [-80.914, 25.115, -80.002, 26.379],
  //       bounded: 1
  //     }
  //   }),
  //   showMarker: false, // optional: true|false  - default true
  //   showPopup: false, // optional: true|false  - default false
  //   searchLabel: 'Find your STR regulation', // optional: string
  //   //marker: {
  //   //  icon: new L.Icon.Default(),
  //   //  draggable: false,
  //   //},
  //   //popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
  //   //resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
  //   //keepResult: true, // optional: true|false  - default false
  //   style: 'bar'
  // });

const search = new GeoSearch.GeoSearchControl({
    notFoundMessage: 'Address not found. Contact us to improve this tool.',
    provider: new GeoSearch.OpenStreetMapProvider({
    params: {
      countrycodes: 'us',
      viewbox: [-80.914, 25.115, -80.002, 26.379],
      bounded: 1
    }
    }),
    showMarker: false,
    showPopup: false,
    searchLabel: 'Find your STR regulation', 
    style: 'bar'
  });



// 407 NW 64th St Miami
  // const search = new GeoSearch.GeoSearchControl({
  //   notFoundMessage: 'Address not found. Contact us to improve this tool.',
  //   provider: new GeoSearch.GoogleProvider({
  //     params: {
  //       key: '__API_KEY__',
  //       language: 'en',
  //       country: 'us',
  //       region: 'us',
  //       administrative_area_level_1: 'FL',
  //       administrative_area_level_2: 'Miami-Dade, Broward'
  //     }
  //   }),
  //   showMarker: false, // optional: true|false  - default true
  //   showPopup: false, // optional: true|false  - default false
  //   searchLabel: 'Find your STR regulation', // optional: string
  //   style: 'bar'
  // });


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