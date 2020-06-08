const express = require('express');

const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();


require('./config/passport')(passport);


// connect to mongoose:
mongoose.connect('mongodb://localhost:27017/authenticationCrash', {
	useNewUrlParser : true
})
.then(()=> console.log("MongoBD connected"))
.catch(err => console.log("error connecting to the database..."));

//ejs:
app.use(expressLayouts);
app.set('view engine', 'ejs');

// body parser: this enables us to get data from ourt form with request.body
app.use(express.urlencoded({extended: false}));



// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// express flash middleware:
app.use(flash());

// global vars
/* now after instatiating flash, i new have access to res.locals*/
app.use( (req, res, next)=>{
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});



//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));