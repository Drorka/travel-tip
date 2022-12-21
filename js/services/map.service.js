export const mapService = {
  initMap,
  addMarker,
  panTo,
  getGclickedPos,
  centerMap,
  searchAddress,
  searchInput,
}

// Var that is used throughout this Module (not global)
var gMap
let gClickedPos

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap')
  return _connectGoogleApi()
    .then(() => {
      console.log('google available')
      gMap = new google.maps.Map(document.querySelector('#map'), {
        center: { lat, lng },
        zoom: 15,
      })
      console.log('Map!', gMap)
    })
    .then(() => {
      gMap.addListener('click', (mapsMouseEvent) => {
        console.log(mapsMouseEvent.latLng)
        gClickedPos = mapsMouseEvent.latLng
        console.log(gClickedPos)

        // Create a new InfoWindow.
        let infoWindow = new google.maps.InfoWindow({
          position: mapsMouseEvent.latLng,
        })
        infoWindow.setContent(
          JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        )
        infoWindow.open(gMap)
      })
      console.log('been there')
    })
}

function getGclickedPos() {
  return gClickedPos
}

function centerMap(lat, lng) {
  const elMap = document.querySelector('#map')
  // options
  let options = {
    zoom: 15,
    center: {
      lat,
      lng,
    },
  }
  // The map
  gMap = new google.maps.Map(elMap, options)
  // The marker
  const marker = new google.maps.Marker({
    position: {
      lat,
      lng,
    },
    map: gMap,
  })
  // map.addListener("dblclick", onAddPlace)
}

function searchAddress(address) {
  return axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDOtyCghM3CvYqD4DVheWeTECQ4Tki6m1s`
    )
    .then((res) => {
      console.log(res)
      res.data.results[0]
    })
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  })
  return marker
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()
  const API_KEY = 'AIzaSyDOtyCghM3CvYqD4DVheWeTECQ4Tki6m1s'
  var elGoogleApi = document.createElement('script')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject('Google script failed to load')
  })
}
