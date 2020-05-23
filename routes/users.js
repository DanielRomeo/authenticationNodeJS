const express = require('express');
const router = express.Router();


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
		res.send('pass');
	}
})

module.exports = router;