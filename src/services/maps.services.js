const axios = require('axios')
const Captain = require('../models/captain.model.js')

const getAddressCoordinate = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    address
  )}&format=json&limit=1`;

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Uber" // REQUIRED
    }
  });

  if (response.data.length === 0) {
    throw new Error("Address not found");
  }

  return {
    lat: response.data[0].lat,
    lng: response.data[0].lon
  };
};

const calculateDistanceTime = async (source,destination) => {
    const geocode = async (place) => {
    const url = "https://nominatim.openstreetmap.org/search";

    const { data } = await axios.get(url, {
        params: {
        q: place,
        format: "json",
        limit: 1,
        },
        headers: {
        "User-Agent": "Uber" // REQUIRED by Nominatim
        }
    });

    if (!data.length) throw new Error("Location not found");

    return {
        lat: data[0].lat,
        lon: data[0].lon,
    };
    };

    try {
    // 1. Convert source & destination to coordinates
    const src = await geocode(source);
    const dest = await geocode(destination);

    // 2. Call OSRM routing API
    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${src.lon},${src.lat};${dest.lon},${dest.lat}?overview=false`;

    const { data } = await axios.get(routeUrl);

    const route = data.routes[0];

    return {
      distance_km: (route.distance / 1000).toFixed(2),
      duration_min: (route.duration / 60).toFixed(2),
    };

  } catch (error) {
    console.error(error.message);
    throw error;
  }

    
}

const getAutoCompleteSuggestionsService = async (input) => {
  
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&limit=5`;
    const response = await axios.get(url, 
      {
        headers: {
            "User-Agent": "Uber" // REQUIRED by Nominatim
        }
      }
    )
    
    if(response.data.length > 0) {
        const suggestions = response.data.map(item => {
          displayName = item.display_name;
          lat = parseFloat(item.lat);
          lng = parseFloat(item.lon);
          
        })
        return response.json(suggestions)
    }
    else {
        throw new Error("No suggestions found");
    }


}
    

module.exports = {
    calculateDistanceTime,
    getAddressCoordinate,
    getAutoCompleteSuggestionsService

}