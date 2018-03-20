const yargs = require('yargs');
const axios = require('axios');

const argv = yargs.options({
  a: {
    demand: true,
    alias: 'address',
    describe: 'Address to fetch weather for',
    string: true
  }
})
.help()
.alias('help', 'h')
.argv;


const GEO_API_KEY = 'YOUR_GOOGLE_GEOCODE_API_KEY';
const WEATHER_API_KEY = 'YOUR_DARKSKY_API_KEY';
const ADDRESS = encodeURIComponent(argv.address);

const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${ADDRESS}&key=${GEO_API_KEY}`

axios.get(geocodeUrl)
  .then((res) => {
    if(res.data.status === 'ZERO_RESULTS'){
      throw new Error('Unable to get that address.')
    } else {
      const lat = res.data.results[0].geometry.location.lat;
      const lng = res.data.results[0].geometry.location.lng;
      const address = res.data.results[0].formatted_address;
      const weatherUrl = `https://api.darksky.net/forecast/${WEATHER_API_KEY}/${lat},${lng}`
      axios.get(weatherUrl)
        .then((res) => {
          console.log(`It is currently ${res.data.currently.temperature}. It feels like ${res.data.currently.apparentTemperature} in ${address}.`);

        })
        .catch((e) => {
          if(e.code === 'ENOTFOUND') {
            console.log('Unable to reach weather Service')
          } else {
            console.log(e);
          }
        })
    }

  })
  .catch((e) =>  {
    if(e.code === 'ECONNREFUSED'){
      console.log('Unable to connect to API Servers');
    } else {
        console.log(e.message)

    }
  }
  )
