const express = require('express');
const bodyParser = require('body-parser')
const db = require('./db')
const session = require("express-session")
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { pool } = require('./db.js')
const { ensureAuthentication } = require('./login/auth')

const store = new session.MemoryStore();
const app = express();
const PORT = 4001;

app.use(
  session({
    secret: "D53gxl41G",       
    resave: false,           
    saveUninitialized: false,          
    cookie: {                       
      maxAge: 1000*60*60*24,     
      secure: true,                
      sameSite: "none",          
      },                
    store,                                  
  })
);


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


// Route to main page:

app.get('/', (request, response) => {
    console.log(pool);
    response.json({ info: 'E-commerce RestAPI On! NodeJS, Express, and Postgres API' })
})


// Endpoints:


// User Register and login
app.post('/register', db.createUser);  // POST { name, email, password } - register a new user  
app.post('/login', db.login);          // POST { email, password } - login user 


// Products

app.get('/products', ensureAuthentication, db.getProducts);  // GET - all Products



/*
API Plan:


POST new order              to start a new order           
POST new orders_products    to include products on the order
GET order                   to get the order sumary
PUT orders_products         to change the quentity on the products
DELETE orders_products      to delete products from the order

PUT order                   to change the order status, like after payment
DELETE/PUT order            to cancel an order

*/



// set the app to listen on the port you set:

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});






/*
// Passport:
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {     
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    pool.query('SELECT id, email, password FROM users WHERE id = $1;', [id], function(err, results) {
      if (err) return done(err);
      done(null, results.rows[0]);
    });
});

passport.use(new LocalStrategy(function verify(email, password, done) {
  pool.query('SELECT email, password FROM users WHERE email = $1;', [ email ], function(err, results) {
    if (err) return done(err);
    if (!results) return done(null, false, { msg: 'Incorrect email or password.' }); 
    if (results.rows[0].password !== password) return done(null, false, { msg: 'Incorrect email or password.' });
    return done(null, results.rows[0]);
    });
}));

app.post(
  '/login',
  passport.authenticate('local', { failureRedirect : '/login' }),
  (req, res) => {
    res.status(201).json({ msg: `Logged in`});
  }
);
*/