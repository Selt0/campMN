const express = require('express')
const router = express.Router({ mergeParams: true })
const { isLoggedIn, isReviewAuthor } = require('../middleware')
const Campground = require('../models/campground')
const Review = require('../models/review')
const catchAsync = require('../utils/catchAsync')

router.post(
	'/',
	isLoggedIn,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id)
		const review = new Review(req.body.review)
		review.author = req.user._id
		campground.reviews.push(review)
		await review.save()
		await campground.save()
		req.flash('success', 'Review posted!')
		res.redirect(`/campgrounds/${campground._id}`)
	})
)

router.delete(
	'/:reviewId',
	isLoggedIn,
	isReviewAuthor,
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
		await Review.findByIdAndDelete(reviewId)
		req.flash('success', 'Review deleted!')
		res.redirect(`/campgrounds/${id}`)
	})
)

module.exports = router
