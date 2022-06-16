const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const session = require('express-session')

const ExpressError = require('./utils/ExpressError')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

mongoose
	.connect('mongodb://localhost:27017/camp')
	.catch(err => console.err(err))

mongoose.connection.once('open', () => {
	console.log('Database connected!')
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', engine)

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
	session({
		secret: 'keyboard',
		resave: false,
		saveUninitialized: true,
		cookie: {
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7
		}
	})
)

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

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

app.listen(3000, () => {
	console.log('serving on port 3000')
})
