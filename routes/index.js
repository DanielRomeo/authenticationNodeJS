const express = require('express');
const router = express.Router();

// ill use this on any route that i want to be authenticated
const { ensureAuthenticated } = require('../config/auth');


router.get('/', (req, res)=>{
	res.render('welcome');
});

// router.get('/dashboard', (req, res)=>{
// 	res.render('dashboard');
// });

// as u can see, i passed it in as a secondParameter
router.get('/dashboard', ensureAuthenticated, (req, res)=>{
	res.render('dashboard', {
		user: req.user
	});
});
module.exports = router;