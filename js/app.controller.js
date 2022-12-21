import { mapService } from './services/map.service.js'
import { placeService } from './services/place.service.js'
import { utils } from './services/utils.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetPlaces = onGetPlaces
window.onGetUserPos = onGetUserPos
window.onAddPlace = onAddPlace

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
    const strHTML = places.map(place => {`
      <tr>
        <td>Place: ${place.name}</td>
        <td>Date created: ${place.time}</td>
        <td><button class="go-btn">Go</button></td>
        <td><button class="delete-btn">Delete</button></td>
      </tr>
    `})
    
    console.log('places:', places)
    document.querySelector('.places').innerHTML = strHTML.join('')
  })
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords)
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

function onAddPlace() {
  const clickedPos = mapService.getGclickedPos()
  console.log('adding place')
  console.log(clickedPos.lat(), clickedPos.lng())
  placeService.addPlace(clickedPos.lat(), clickedPos.lng())
}
