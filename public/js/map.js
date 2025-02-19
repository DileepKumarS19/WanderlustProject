mapboxgl.accessToken = mapToken;

console.log(mapToken);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center:  listing.geometry.coordinates , // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});



const marker1 = new mapboxgl.Marker({ color: 'red'})
    .setLngLat( listing.geometry.coordinates )
    .setPopup(new mapboxgl.Popup({ closeOnClick: false })
    .setHTML(`<h1> ${listing.title }</h1> <p> exact location will be shared after booking</p>`))
    .addTo(map);