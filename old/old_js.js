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


  const search = new GeoSearch.GeoSearchControl({
    notFoundMessage: 'Address not found. Contact us to improve this tool.',
    provider: new GeoSearch.GoogleProvider({
      params: {
        key: '__API_KEY__',
        language: 'en',
        country: 'us',
        region: 'us',
        administrative_area_level_1: 'FL',
        administrative_area_level_2: 'Miami-Dade, Broward'
      }
    }),
    showMarker: false, // optional: true|false  - default true
    showPopup: false, // optional: true|false  - default false
    searchLabel: 'Find your STR regulation', // optional: string
    style: 'bar'
  });