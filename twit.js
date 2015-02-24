var Twit = require('twit');

var T = new Twit({
    consumer_key:         'ixBI4fNBu4MVw5rUsVeSgdAyy'
  , consumer_secret:      'G45lJhJsEPJFstB23mDlDioBnkCaUowkehC62sUOLVZPRUR42d'
  , access_token:         '604006937-6w6WuoJJQnoLFi59eRSUDCOzYwJ45h5PmxJMpiv5t'
  , access_token_secret:  'I4Njr8unkRqM9ABdYIgY8UYfDYeIAolDH0CGMEEMvl0q2'
})

T.get('followers/ids', { screen_name: 'heykarthikhere' },  function (err, data, response) {
  console.log(data)
})