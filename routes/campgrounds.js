const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const { validateCampgorund, isLoggedIn, isAuthor } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')

router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post(
	'/',
	isLoggedIn,
	validateCampgorund,
	catchAsync(campgrounds.createCampground)
)

router.get('/:id', catchAsync(campgrounds.showCampground))

router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.renderEditForm)
)

router.put(
	'/:id',
	isLoggedIn,
	isAuthor,
	validateCampgorund,
	catchAsync(campgrounds.editCampground)
)

router.delete(
	'/:id',
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.deleteCampground)
)

module.exports = router
