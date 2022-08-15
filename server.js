const express = require('express');
const bodyParser = require('body-parser')
const db = require('./db')
const session = require("express-session")
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { ensureAuthentication } = require('./routes/auth_helper')

const authRouter = require('./routes/auth.js');
const ordersRouter = require('./routes/orders.js');


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


// Routes:

// User Register and login
app.use('/auth', authRouter);

// Orders
app.use('/orders', ordersRouter);

// Users
//app.use('/user', userRouter);  // GET user by ID, PUT Address

// Products
app.get('/products', /*ensureAuthentication,*/ db.getProducts);  // GET - all Products



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