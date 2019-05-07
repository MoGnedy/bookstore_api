
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const port = 8080;
const book = require('./app/routes/book');
const config = require('config'); //we load the db location from the JSON files
const cors = require('cors')

var corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
  }
//db options
const options = {useNewUrlParser: true};
//db connection      
mongoose.connect(config.DBHost , options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
	//use morgan to log at command line
	app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

app.use(cors(corsOptions))

//parse application/json and look for raw text                                        
app.use(express.json());                                     
app.use(express.urlencoded({extended: true}));               
app.use(express.json({ type: 'application/json'}));  

app.get("/", (req, res) => res.json({message: "Welcome to our Bookstore!"}));

app.route("/api/v1/book")
	.get(book.getBooks)
	.post(book.postBook);
app.route("/api/v1/book/:id")
	.get(book.getBook)
	.delete(book.deleteBook)
	.put(book.updateBook);


app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing