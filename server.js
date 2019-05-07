
let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let port = 8080;
let book = require('./app/routes/book');
let config = require('config'); //we load the db location from the JSON files
//db options
let options = {useNewUrlParser: true};
//db connection      
mongoose.connect(config.DBHost , options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
	//use morgan to log at command line
	app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text                                        
app.use(express.json());                                     
app.use(express.urlencoded({extended: true}));               
app.use(express.json({ type: 'application/json'}));  

app.get("/", (req, res) => res.json({message: "Welcome to our Bookstore!"}));

app.route("/book")
	.get(book.getBooks)
	.post(book.postBook);
app.route("/book/:id")
	.get(book.getBook)
	.delete(book.deleteBook)
	.put(book.updateBook);


app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing