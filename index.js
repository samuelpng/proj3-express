const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
var helpers = require('handlebars-helpers')({
  handlebars: hbs.handlebars
});
require("dotenv").config();
const cors = require('cors')
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf')

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require('./middlewares');

// create an instance of express app
let app = express();
// set the view engine
app.set("view engine", "hbs");
// static folder
app.use(express.static("public"));
// setup partials
hbs.registerPartials('./views/partials')
// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");
// use cors
app.use(cors())
// enable forms
app.use(
    express.urlencoded({
      extended: false
    })
  );

// set up sessions
app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}))

// Share user data with hbs files
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  next();
})

app.use(flash())

// Register Flash middleware
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});

//custom handlebar helpers
hbs.registerHelper('convertCentsToDollars', (cents) => {
  return (parseInt(cents) / 100).toFixed(2)
})
hbs.registerHelper('total', (quantity, cost) => {
  return (quantity * cost / 100).toFixed(2)
})

// enable CSRF
// app.use(csrf());

const csrfInstance = csrf();
app.use(function (req, res, next) {
  // exclude /checkout/process_payment for CSRF
  if (req.url === '/checkout/process_payment' || req.url.slice(0,5)=="/api/") {
      return next()
  }
  csrfInstance(req, res, next)
})

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
      req.flash('error_messages', 'The form has expired. Please try again');
      res.redirect('back');
  } else {
      next()
  }
});



// Share CSRF with hbs files
app.use(function (req, res, next) {
  // Check if req.csrfToken is available
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
});

app.get('/', (req,res) => {
    res.redirect("/users/login")
  })

//import in routes
const productRoutes = require('./routes/pim/products')
const specificationsRoute = require('./routes/pim/specifications')
const userRoutes = require('./routes/pim/users')
const customerRoutes = require('./routes/pim/customers')
const cloudinaryRoutes = require('./routes/pim/cloudinary')
const cartRoutes = require('./routes/api/carts')
const checkoutRoutes = require('./routes/api/checkout')
const orderRoutes = require('./routes/pim/orders')
const api = {
  products: require('./routes/api/products'),
  customers: require('./routes/api/customers')
}

//=== PIM Routes ===
app.use('/products', checkIfAuthenticated, productRoutes)
app.use('/specifications', checkIfAuthenticated, specificationsRoute)
app.use('/users', userRoutes)
app.use('/customers', customerRoutes)
app.use('/cloudinary', cloudinaryRoutes)
app.use('/orders', checkIfAuthenticated, orderRoutes)
app.use('/cart', checkIfAuthenticated, cartRoutes)
app.use('/checkout', checkoutRoutes)

//=== API Routes ===
app.use('/api/products', express.json(), api.products)
app.use('/api/customers', express.json(), api.customers)


async function main() {
  
}

main();

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});