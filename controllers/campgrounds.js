const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({})

	res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
	res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
	const campground = new Campground(req.body.campground)

	campground.images = req.files.map(file => ({
		url: file.path,
		filename: file.filename
	}))
	campground.author = req.user._id
	await campground.save()
	req.flash('success', 'Successfuly made campground!')
	res.redirect(`campgrounds/${campground._id}`)
}

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

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findById(id)

	if (!campground.author.equals(req.user._id)) {
		req.flash('error', "You don't have permission to do that.")
		res.redirect(`/campgrounds/${id}`)
	}

	res.render('campgrounds/edit', { campground })
}

module.exports.editCampground = async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findByIdAndUpdate(id, {
		...req.body.campground
	})

	req.flash('success', 'Campground updated!')
	res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findByIdAndDelete(id)

	req.flash('success', 'Campground deleted!')
	res.redirect('/campgrounds')
}
