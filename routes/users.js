const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/user')

router.get('/register', users.renderRegisterForm)

router.post('/register', catchAsync(users.createUser))

router.get('/login', users.renderLoginForm)

router.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login',
		keepSessionInfo: true
	}),
	users.login
)

router.post('/logout', users.logout)

module.exports = router
