const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const { validateCampgorund, isLoggedIn, isAuthor } = require('../middleware')

router.get(
	'/',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({})

		res.render('campgrounds/index', { campgrounds })
	})
)

router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new')
})

router.post(
	'/',
	isLoggedIn,
	validateCampgorund,
	catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground)

		campground.author = req.user._id
		await campground.save()
		req.flash('success', 'Successfuly made campground!')
		res.redirect(`campgrounds/${campground._id}`)
	})
)

router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params
		const campground = await Campground.findById(id)
			.populate('reviews')
			.populate('author')

		if (!campground) {
			req.flash('error', 'Campground not found!')
			return res.redirect('/campgrounds')
		}

		res.render('campgrounds/show', { campground })
	})
)

router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params
		const campground = await Campground.findById(id)

		if (!campground.author.equals(req.user._id)) {
			req.flash('error', "You don't have permission to do that.")
			res.redirect(`/campgrounds/${id}`)
		}

		res.render('campgrounds/edit', { campground })
	})
)

router.put(
	'/:id',
	isLoggedIn,
	isAuthor,
	validateCampgorund,
	catchAsync(async (req, res) => {
		const { id } = req.params
		const campground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground
		})

		req.flash('success', 'Campground updated!')
		res.redirect(`/campgrounds/${id}`)
	})
)

router.delete(
	'/:id',
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params
		const campground = await Campground.findByIdAndDelete(id)

		req.flash('success', 'Campground deleted!')
		res.redirect('/campgrounds')
	})
)

module.exports = router
