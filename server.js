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



// set the app to listen on the port you set:

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});