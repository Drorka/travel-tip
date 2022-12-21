import { storageService } from './storage.service.js'
import { utils } from './utils.js'

export const placeService = {
  addPlace,
  getPlaces,
}

const STORAGE_KEY_PLACE_DB = 'placeDB'
const gSavedPlaces =
  storageService.loadFromStorage(STORAGE_KEY_PLACE_DB) || _createPlaces()

// * from loc.service
const locs = [
  { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
  { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
]

function getPlaces() {
  return Promise.resolve(gSavedPlaces)
}

function addPlace({ lat, lng }) {
  gSavedPlaces.unshift(
    _createPlace({
      lat,
      lng,
    })
  )
  storageService.saveToStorage(STORAGE_KEY_PLACE_DB, gSavedPlaces)
}

function _createPlace({ lat, lng }) {
  return {
    id: utils.makeId(),
    lat,
    lng,
    name: 'New place',
    time: new Date(),
    updatedAt: null,
  }
}

// * place keeper functions

function removePlace(placeId) {
  const placeIdx = gSavedPlaces.findIndex((place) => place.id === placeId)
  gSavedPlaces.splice(placeIdx, 1)
  if (gSavedPlaces.length === 0) {
    saveToStorage(STORAGE_KEY_PLACE_DB, null)
    return
  }
  saveToStorage(STORAGE_KEY_PLACE_DB, gSavedPlaces)
}

function _createPlaces() {
  return [
    {
      id: utils.makeId(),
      lat: 32,
      lng: 15,
      name: 'Home',
      time: '16/10/22, 13:01',
    },
    {
      id: utils.makeId(),
      lat: 12,
      lng: 34,
      name: 'Safari',
      time: '16/10/22, 13:01',
    },
    {
      id: utils.makeId(),
      lat: 65,
      lng: 67,
      name: 'School',
      time: '16/10/22, 13:01',
    },
  ]
}

function createFormatedDate(date) {
  const formatedDate = new Intl.DateTimeFormat('en').format(date)
  const options = {
    hour: '2-digit',
    minute: '2-digit',
  }
  const formatedTime = new Intl.DateTimeFormat('he', options).format(date)
  return formatedDate + ', ' + formatedTime
}

// * get User's location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition)
  } else {
    x.innerHTML = 'Geolocation is not supported by this browser.'
  }
}

function showPosition(position) {
  x.innerHTML =
    'Latitude: ' +
    position.coords.latitude +
    '<br>Longitude: ' +
    position.coords.longitude
}

// * funcitons for thr CSV bouns
function getPlaceAsCSV() {
  let csvStr = `Id,Latitude,Longitude,Name`
  if (gPlaces.length) {
    gPlaces.forEach((place) => {
      const csvLine = `\n${place.id}, ${place.pos.lat}, ${place.pos.lng}, ${place.name}`
      csvStr += '\n' + csvLine
    })
    return csvStr
  }
}

function downloadCSV() {
  const csvContent = getPlaceAsCSV()
  if (!csvContent) return
  window.open('data:text/csv;charset=utf-8,' + csvContent)
}
