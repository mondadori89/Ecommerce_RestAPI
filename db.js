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



// Exporting CRUD functions in a REST API

module.exports = {
  pool,
  getProducts,
}