const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// usermodel:
const User = require('../models/User');

// login routes
router.get('/login', (req, res)=>{
	res.render('login');
});

//register routes
router.get('/register', (req, res)=>{
	res.render('register');
});

// register handle:
router.post('/register', (req,res)=>{
	const {name, email, password, password2} = req.body;

	let errors = [];
	if(!name || !email || !password || !password2){
		errors.push({msg: 'Please fill in the entire form'});
	}
	if(password !== password2){
		errors.push({msg: 'Passwords do not match'});
	}

	// length of password:
	if(password < 6){
		errors.push({msg: 'Password must be 6 or more in length'});
	}

	// send the data to the cliend:
	if(errors.length > 0){
		// if there is an error we wanna re render the form and we wanna pass some stuff in:
		// we are gnna catch these in EJS:	
		res.render('register', {
			errors, name, email, password, password2
		});
	}else{
		// res.send('pass');

		// validation passed:
		/**/

		// make sure the user doesnt exist. findOne is a mongoose method
		User.findOne({email: email})
			.then(user =>{
				if(user){
					// user does exist:
					errors.push({msg: 'Email is already registered'})
					res.render('register', {
						errors, name, email, password, password2	
					})
				}else{
					// user doesnt exist, so we create a new one.
					const newUser = new User({
						name,
						email,
						password
					});

					// hash:
					bcrypt.genSalt(10, (err, salt)=> 
						bcrypt.hash(newUser.password, salt, (err, hash)=>{
							if(err){
								throw err;
							}

							newUser.password = hash;

							// save the user:
							newUser.save()
								.then(user=>{
									req.flash('success_msg', 'You are now registered. login');
									res.redirect('/users/login')
								})
								.catch(err => console.log(err))
						}))
				}
			})//end of then
	}
})


// login handle
router.post('/login', (req, res, next)=>{
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next)
});

//logout handle:
router.get('/logout', (req, res)=>{
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
})

module.exports = router;