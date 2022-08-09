const express = require('express');
const app = express();

const PORT = 4001;


// Routes:

app.get('/', (request, response) => {
    response.json({ info: 'E-commerce RestAPI On! Node.js, Express, and Postgres API' })
})




app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});