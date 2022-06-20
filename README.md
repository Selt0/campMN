# CAMPGROUNDS

## Overview

Full-stack application where users can create a campground, upload photos, and leave reviews. Application includes authorization and authentication. Cammpgrounds can only be deleted and edited by the creator. Same applies to comments. Application includes a map (created using mapbox) that displayes the location of each campground. Database created using MongoDB and hosted with Heroku. Uploaded photos are hosted with cloudinary.

### Features

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- Create/delete/update Campgrounds
- Create/delete Reviews with star ratings
- Upload/delete campground photos
- Register new accounts
- Login
- Explore the map

**### Screenshot**

![](./Screen%20Shot%202022-06-20%20at%2012.55.50%20PM.png)

https://user-images.githubusercontent.com/23282172/174658287-ba8786ba-df1c-4193-85a8-e8a2f6f7b40c.mp4



**### Links**

- Live Site URL: [https://campmn.herokuapp.com/](https://campmn.herokuapp.com/)

**## My process**

**### Built with**

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow
- [Bootstrap](https://getbootstrap.com/)
- [MapBox](https://www.mapbox.com/) - Map/Geolocation library
- [EJS](https://ejs.co/) - JS templating
- [Cloudinary](https://cloudinary.com/) - image hosting
- [MongoDB](https://www.mongodb.com/) - database
- [Express](https://expressjs.com/)

**### What I learned**

This was a big project for me to complete. I learned about new packages including flash, helmet, and joi, to name a few. I followed the RESTful routing guidelines and used <code>router.route</code> to clean up my routes. I created a boilerplate and partials and used EJS to include them. This project was mostly about learning middleware and using the various libraries to put together the pieces I needed to complete this project.

In the beginning, as I was building the project, I created a seeds file to create campgounds to fill the database. I created a list of cities and campground names that would be randomly selected to create a campground. Once the site was live, I created some campgrounds that are located in MN.

As I continued building and adding features, I had to constantly update my models to include the new information I was adding. I learned about using mongoose virtual properties to create temporary properties to be used with MapBox and create attributes to be used in the DOM.

I also learned about mongoose <code> populate </code> to grab additional data that was stored in the database and be able to display them.

```html
<% layout('layouts/boilerplate.ejs') %> <%- include('../partials/navbar') %>
```

```js
router
	.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(
		isLoggedIn,
		isAuthor,
		upload.array('campground[images]'),
		validateCampground,
		catchAsync(campgrounds.editCampground)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

const ImageSchema = new Schema({
	url: String,
	filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
	return this.url.replace('/upload', '/upload/w_200')
})

const CampgroundSchema = new Schema(
	{
		title: String,
		images: [ImageSchema],
		geometry: {
			type: {
				type: String,
				enum: ['Point'],
				required: true
			},
			coordinates: {
				type: [Number],
				required: true
			}
		},
		price: Number,
		description: String,
		location: String,
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Review'
			}
		]
	},
	{ toJSON: { virtuals: true } }
)

CampgroundSchema.virtual('properties.popupMarkup').get(function () {
	return `<strong><a href="/campgrounds/${
		this._id
	}">${this.title}</a><strong><br/><p>${this.description.substring(0, 25)}...</p>`
})

module.exports.showCampground = async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findById(id)
		.populate({
			path: 'reviews',
			populate: {
				path: 'author'
			}
		})
		.populate('author')

	if (!campground) {
		req.flash('error', 'Campground not found!')
		return res.redirect('/campgrounds')
	}

	res.render('campgrounds/show', { campground })
}
```

**### Continued development**

There is always more features to add and a few things to improve on. As I was creating the campgrounds, I realized I need a better way to add description to a campground instead of creating a big box of text.
I also want to add a way to search or even filter campgrounds based on location or activities. I want to shorten the amount of information on the cards displayed on the show page and add the number of reviews and perhaps even an avg rating based on the stars added.

**### Useful resources**

Docs and Google

**## Author**

- Website - [Michael Martinez](https://michael-martinez.netlify.app/)
- Twitter - [@MMocomochi](https://twitter.com/MMocomochi)
