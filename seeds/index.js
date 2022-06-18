const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose
	.connect('mongodb://localhost:27017/camp')
	.catch(err => console.err(err))

mongoose.connection.once('open', () => {
	console.log('Database connected!')
})

const sample = array => array[Math.floor(Math.random() * array.length)]

// repopulates database
const seedDB = async () => {
	await Campground.deleteMany({})
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000)
		const price = Math.floor(Math.random() * 25) + 10
		const camp = new Campground({
			author: '62ac9ebca5cfc060d42afa11', // seed file account
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					url: 'https://res.cloudinary.com/dwl4y3kmp/image/upload/v1655565595/Camp/qkviqlikx24ce9ehqxpn.jpg',
					filename: 'Camp/qkviqlikx24ce9ehqxpn'
				},
				{
					url: 'https://res.cloudinary.com/dwl4y3kmp/image/upload/v1655565598/Camp/vmgkaoy4thxf8saescdk.jpg',
					filename: 'Camp/vmgkaoy4thxf8saescdk'
				},
				{
					url: 'https://res.cloudinary.com/dwl4y3kmp/image/upload/v1655565598/Camp/dqwxyim1k9meptkykpzz.jpg',
					filename: 'Camp/dqwxyim1k9meptkykpzz'
				}
			],
			description:
				'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit placeat qui culpa facilis magni maxime, veniam repudiandae tempora ipsa iure quis eos numquam, doloremque ad.',
			price: price
		})
		await camp.save()
	}
}

seedDB().then(() => {
	mongoose.connection.close()
})
