const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

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

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));