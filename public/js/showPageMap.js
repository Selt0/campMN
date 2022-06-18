mapboxgl.accessToken =
	'pk.eyJ1IjoibW9jb21vY2hpIiwiYSI6ImNsNGs1NHU2bzBxMmgzaXJ3c25rMDgyd3kifQ.9S5mJRWgN8GpboW0S_9zCw'
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/outdoors-v11',
	center: campground.geometry.coordinates,
	zoom: 10
})

// Create a default Marker, colored black, rotated 45 degrees.
const marker1 = new mapboxgl.Marker({ color: 'black', rotation: 45 })
	.setLngLat(campground.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${campground.title}</h3>`)
	)
	.addTo(map)
