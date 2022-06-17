const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/user')

router
	.route('/register')
	.get(users.renderRegisterForm)
	.post(catchAsync(users.createUser))

router
	.route('/login')
	.get(users.renderLoginForm)
	.post(
		passport.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/login',
			keepSessionInfo: true
		}),
		users.login
	)

router.post('/logout', users.logout)

module.exports = router
