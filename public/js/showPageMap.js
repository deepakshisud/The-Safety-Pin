mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: pin.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});
new mapboxgl.Marker()
    .setLngLat(pin.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${pin.location}</h3><p>${pin.address}</p>`
        )
    )
    .addTo(map)