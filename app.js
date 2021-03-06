if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const session = require('express-session')
const mongoSanitize = require('express-mongo-sanitize')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const MongoDBStore = require('connect-mongo')
const helmet = require('helmet')
const ExpressError = require('./utils/ExpressError')
const User = require('./models/user')

const usersRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/camp'

mongoose.connect(dbUrl).catch(err => console.err(err))

mongoose.connection.once('open', () => {
	console.log('Database connected!')
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine)
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(mongoSanitize())

const secret = process.env.SECRET || 'keyboard'

const store = new MongoDBStore({
	mongoUrl: dbUrl,
	secret,
	touchAfter: 24 * 60 * 60
})

store.on('error', e => {
	console.log('SESSION STORE ERROR', e)
})

app.use(
	session({
		store,
		name: 'session',
		secret,
		resave: false,
		saveUninitialized: true,
		cookie: {
			// secure: true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7
		}
	})
)
app.use(
	helmet({
		crossOriginEmbedderPolicy: false
	})
)

const scriptSrcUrls = [
	'https://stackpath.bootstrapcdn.com/',
	'https://api.tiles.mapbox.com/',
	'https://api.mapbox.com/',
	'https://kit.fontawesome.com/',
	'https://cdnjs.cloudflare.com/',
	'https://cdn.jsdelivr.net'
]
const styleSrcUrls = [
	'https://kit-free.fontawesome.com/',
	'https://stackpath.bootstrapcdn.com/',
	'https://api.mapbox.com/',
	'https://api.tiles.mapbox.com/',
	'https://fonts.googleapis.com/',
	'https://use.fontawesome.com/',
	'https://cdn.jsdelivr.net'
]
const connectSrcUrls = [
	'https://api.mapbox.com/',
	'https://a.tiles.mapbox.com/',
	'https://b.tiles.mapbox.com/',
	'https://events.mapbox.com/'
]
const fontSrcUrls = []
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", 'blob:'],
			objectSrc: [],
			imgSrc: [
				"'self'",
				'blob:',
				'data:',
				'https://res.cloudinary.com/dwl4y3kmp/',
				'https://images.unsplash.com/'
			],
			fontSrc: ["'self'", ...fontSrcUrls]
		}
	})
)

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
	res.locals.currentUser = req.user
	res.locals.success = req.flash('success')
	res.locals.error = req.flash('error')
	next()
})

app.use('/', usersRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.get('/', (req, res) => {
	res.render('home')
})

// error handling
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err
	if (!err.message) err.message = 'Something went wrong.'
	res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`serving on port ${port}`)
})
