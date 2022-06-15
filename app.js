const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const engine = require('ejs-mate')

const { campgroundSchema } = require('./schemas')
const Campground = require('./models/campground')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const app = express()

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

const validateCampgorund = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body)
	if (error) {
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next()
	}
}

app.get('/', (req, res) => {
	res.render('home')
})

app.get(
	'/campgrounds',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({})
		res.render('campgrounds/index', { campgrounds })
	})
)

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new')
})

app.post(
	'/campgrounds',
	validateCampgorund,
	catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground)
		await campground.save()
		res.redirect(`campgrounds/${campground._id}`)
	})
)

app.get(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params
		const campground = await Campground.findById(id)
		res.render('campgrounds/show', { campground })
	})
)

app.get(
	'/campgrounds/:id/edit',
	catchAsync(async (req, res) => {
		const { id } = req.params
		const campground = await Campground.findById(id)
		res.render('campgrounds/edit', { campground })
	})
)

app.put(
	'/campgrounds/:id',
	validateCampgorund,
	catchAsync(async (req, res) => {
		const { id } = req.params
		const campground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground
		})
		res.redirect(`/campgrounds/${id}`)
	})
)

app.delete(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params
		const campground = await Campground.findByIdAndDelete(id)
		res.redirect('/campgrounds')
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
