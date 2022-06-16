const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const engine = require('ejs-mate')

const Campground = require('./models/campground')
const Review = require('./models/review')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const app = express()

const campgrounds = require('./routes/campgrounds')

mongoose
	.connect('mongodb://localhost:27017/camp')
	.catch(err => console.err(err))

mongoose.connection.once('open', () => {
	console.log('Database connected!')
})

app.set('view engine', 'ejs')
app.engine('ejs', engine)
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use('/campgrounds', campgrounds)

app.get('/', (req, res) => {
	res.render('home')
})

app.post(
	'/campgrounds/:id/reviews',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id)
		const review = new Review(req.body.review)
		campground.reviews.push(review)
		await review.save()
		await campground.save()
		res.redirect(`/campgrounds/${campground._id}`)
	})
)

app.delete(
	'/campgrounds/:id/reviews/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
		await Review.findByIdAndDelete(reviewId)
		res.redirect(`/campgrounds/${id}`)
	})
)

// error handling
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err
	if (!err.message) err.message = 'Something went wrong.'
	res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
	console.log('serving on port 3000')
})
