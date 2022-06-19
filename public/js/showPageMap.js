mapboxgl.accessToken = mapToken

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/outdoors-v11',
	center: campground.geometry.coordinates,
	zoom: 10
})

map.addControl(new mapboxgl.NavigationControl())

// Create a default Marker, colored black, rotated 45 degrees.
const marker1 = new mapboxgl.Marker({ color: 'black', rotation: 45 })
	.setLngLat(campground.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${campground.title}</h3>`)
	)
	.addTo(map)
