const pins = JSON.parse(pin);
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: pins.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});
new mapboxgl.Marker()
    .setLngLat(pins.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${pins.location}</h3><p>${pins.address}</p>`
        )
    )
    .addTo(map)