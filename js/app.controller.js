import { mapService } from './services/map.service.js'
import { placeService } from './services/place.service.js'


window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetPlaces = onGetPlaces
window.onGetUserPos = onGetUserPos
window.onAddPlace = onAddPlace
window.onRemovePlace = onRemovePlace
window.onGoToPlace = onGoToPlace
window.onSearch = onSearch


function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready')
    })
    .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos')
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}


function onAddMarker() {
  console.log('Adding a marker')
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}


function onGetPlaces() {
  placeService.getPlaces().then((places) => {
    const strHTML = places.map(
      (place) => `
      <tr>
        <td>${place.name}</td>
        <td>${place.time}</td>
        <td><button onclick="onGoToPlace(${place.lat}, ${place.lng})" class="go-btn">Go</button></td>
        <td><button onclick="onRemovePlace('${place.id}')" class="remove-btn">Remove</button></td>
      </tr>
    `
    )

    console.log('places:', places)
    document.querySelector('.places-table').classList.remove('hide')
    document.querySelector('.places').innerHTML = strHTML.join('')
  })
}


function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log(pos)
      onGoToPlace(pos.coords.latitude, pos.coords.longitude)
      return pos
    })
    .then((pos) => {
      console.log('User position is:', pos.coords)
      document.querySelector('.user-pos-container').classList.remove('hide')
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
    })
    .catch((err) => {
      console.log('err!!!', err)
    })
}

function onPanTo() {
  console.log('Panning the Map')
  mapService.panTo(35.6895, 139.6917)
}

// * our new funcs
function onAddPlace() {
  const clickedPos = mapService.getGclickedPos()
  console.log('adding place')
  console.log(clickedPos.lat(), clickedPos.lng())
  placeService.addPlace(clickedPos.lat(), clickedPos.lng())
  onGetPlaces()
}

function onRemovePlace(placeId) {
  console.log(placeId)
  placeService.removePlace(placeId)
  onGetPlaces()
}

function onGoToPlace(lat, lng) {
  console.log(lat, lng)
  mapService.centerMap(lat, lng)
}

function onSearch(ev) {
  if (ev) ev.preventDefault()
  console.log(ev)
  const elInputSearch = document.querySelector('input[name=search]')
  console.log(elInputSearch.value)
  const prmAns = mapService.searchAddress(elInputSearch.value)
  console.log(prmAns)

  prmAns.then((res) => {
    console.log(res.formatted_address)
    var lat = res.geometry.location.lat
    var lng = res.geometry.location.lng
    onGoToPlace(lat, lng)
  })
}