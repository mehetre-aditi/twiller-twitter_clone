const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_MAPS_API_KEY = 'AIzaSyBNvJXMY3ZWFmF0p539njVhIUL66NxWh4k';
const WEATHER_API_KEY = '56f28cfd3b2f1bed3acf23ddd50b15b7';

router.get('/get-location', async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required.' });
        }

        // Reverse Geocoding for City, State, Country
        const locationResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (!locationResponse.data || typeof locationResponse.data !== 'object') {
            console.error('Invalid response from Google Maps API:', locationResponse.data);
            return res.status(500).json({ error: 'Failed to fetch location data.' });
        }

        const addressComponents = locationResponse.data.results[0]?.address_components || [];
        const city = addressComponents.find((c) => c.types.includes('locality'))?.long_name || 'Unknown City';
        const state = addressComponents.find((c) => c.types.includes('administrative_area_level_1'))?.long_name || 'Unknown State';
        const country = addressComponents.find((c) => c.types.includes('country'))?.long_name || 'Unknown Country';

        // Weather API Integration
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
        );

        if (!weatherResponse.data || typeof weatherResponse.data !== 'object') {
            console.error('Invalid response from Weather API:', weatherResponse.data);
            return res.status(500).json({ error: 'Failed to fetch weather data.' });
        }

        const weather = weatherResponse.data;

        res.json({
            city,
            state,
            country,
            weather: {
                temperature: weather.main?.temp || 'N/A',
                condition: weather.weather?.[0]?.description || 'N/A',
            },
        });
    } catch (error) {
        if (error.response) {
            // Log non-200 responses
            console.error('API Error:', error.response.status, error.response.data);
            return res.status(500).json({ error: `API error: ${error.response.statusText}` });
        } else if (error.request) {
            // Log no response received
            console.error('No response from API:', error.request);
            return res.status(500).json({ error: 'No response from API. Check your network connection.' });
        } else {
            // Log other errors
            console.error('Error fetching location or weather data:', error.message || error);
            return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
        }
    }
});

module.exports = router;

