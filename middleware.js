module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl
		console.log('saved!')
		req.flash('error', 'you must be signed in')
		return res.redirect('/login')
	}
	next()
}
