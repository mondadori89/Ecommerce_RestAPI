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
    const { email, password } = request.body
  
    pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, password], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
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
                response.status(201).send(`Logged in with email: ${results.rows[0].email}`);
            }
            else{response.send('No can do... Password is wrong!')}
        }
        else {response.send('No can do... No email like that.')}
    })
};



// Exporting CRUD functions in a REST API

module.exports = {
    getProducts,
    createUser,
    login
}