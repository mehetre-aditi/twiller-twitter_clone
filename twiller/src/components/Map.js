import React from 'react';

const Map = ({ latitude, longitude, weather }) => {
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBNvJXMY3ZWFmF0p539njVhIUL66NxWh4k&q=${latitude},${longitude}`;

    return (
        <div>
            <iframe
                title="Google Map"
                width="600"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={mapUrl}
            ></iframe>
            <p>Current Weather: {`${weather.temperature}°C, ${weather.condition}`}</p>
        </div>
    );
};

export default Map;
