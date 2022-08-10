const express = require('express');
const bodyParser = require('body-parser')
const db = require('./db')


const app = express();
const PORT = 4001;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


// Route to main page:

app.get('/', (request, response) => {
    response.json({ info: 'E-commerce RestAPI On! NodeJS, Express, and Postgres API' })
})


// Endpoints:

app.get('/products', db.getProducts);

app.post('/register', db.createUser);

app.post("/login", db.login);


/*
API Plan:

POST /register - to register user
POST /login - to login


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