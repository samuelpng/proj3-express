const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
    express.urlencoded({
      extended: false
    })
  );

// set up sessions
app.use(session({
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.get('/', (req,res) => {
    res.send("It's alive!")
  })

//import in routes
const bootRoutes = require('./routes/pim/products')

app.use('/products', bootRoutes)


async function main() {
  
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});