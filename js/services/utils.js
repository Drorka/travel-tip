export const utils = {
  makeId,
  getHumanDate,
}

function makeId(length = 3) {
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
  var txt = ''

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return txt
}



function getHumanDate(timestamp) {
  const date = new Date(timestamp)
  var humanDate = date.toDateString()
  return humanDate
}
// function randomPastTime() {
//   const HOUR = 1000 * 60 * 60
//   const DAY = 1000 * 60 * 60 * 24
//   const WEEK = 1000 * 60 * 60 * 24 * 7

//   const pastTime = getRandomIntInclusive(HOUR, WEEK)
//   return Date.now() - pastTime
// }
