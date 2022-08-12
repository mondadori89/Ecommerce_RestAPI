const Pool = require('pg').Pool
const { user, password } = require('./resources/secret')

// Set up Database conection:

const pool = new Pool({
    user: user,
    host: 'localhost',
    database: 'codecademy_design_proj',
    password: password,
    port: 5432,
});


// GET all Products        /products 

const getProducts = (request, response) => {
    pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
};

// POST a new user      /register

const createUser = (request, response) => {
  const { name, email, password } = request.body
  pool.query('SELECT email FROM users WHERE email = $1;', [email], (error, results) => {
    if (error) {
      throw error
    }
    if (!results.rows[0]) {
      pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password], (error, userInserted) => {
        if (error) {
          throw error
        }
        response.status(201).json({ msg: `User added with ID: ${userInserted.rows[0].id}` })
      });
    }
    else {response.status(403).json({ msg: "No can do... Email already exists" });}
  });
};


// POST a new user      /login

const login = (request, response) => {
  const { email, password } = request.body
  pool.query('SELECT email, password FROM users WHERE email = $1;', [email], (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows[0]) {
      if (email === results.rows[0].email && password === results.rows[0].password) {
        request.session.authenticated = true;
        request.session.user = {
          email,
          password,
        }
        console.log(request.session);
        response.status(201).json({ msg: `Logged in with email: ${results.rows[0].email}` });
      }
      else{response.status(403).json({ msg: "No can do... Password is wrong!" });}
    }
    else{response.status(403).json({ msg: "No can do... No email like that." });}
  })
};



// Exporting CRUD functions in a REST API

module.exports = {
  pool,
  getProducts,
  createUser,
  login
}