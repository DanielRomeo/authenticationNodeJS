const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const passport = require('passport');

// load User Model
const User = require("../models/User");

module.exports = function (passport) {
	passport.use(
		new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
			// math the user:
			User.findOne({ email: email }).then((user) => {
				if (!user) {
					// done takes 3 params(error, user and options)
					return done(null, false, {
						message: "Email doesnt exits!",
					});
				}

				// lets look at the password noew...
				/*here we pass in the hash password and the password given by the user*/
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if (err) throw err;

					if (isMatch) {
						// here onSuccess we will pass in params
						return done(null, user);
					} else {
						return done(null, false, {
							message: "Password is incorrect!",
						});
					}
				});
			});

			


		})
	);
	

	passport.serializeUser( (user, done)=> {
		done(null, user.id);
	});

	passport.deserializeUser( (id, done)=> {
		User.findById(id, (err, user)=> {
			done(err, user);
		});
	});


}; /* end of module.exports*/
