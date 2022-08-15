const express = require('express');
const db = require('../db.js')


const authRouter = express.Router();


// Login

authRouter.post('/login', (request, response) => {
    const { email, password } = request.body
    db.pool.query('SELECT email, password FROM users WHERE email = $1;', [email], (error, results) => {
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
            response.cookie(request.session.authenticated);
            response.status(201).json({ msg: `Logged in with email: ${results.rows[0].email} and id: ${results.rows[0].id}` });
        }
        else{response.status(403).json({ msg: "No can do... Password is wrong!" });}
      }
      else{response.status(403).json({ msg: "No can do... No email like that." });}
    })
});


// Register

authRouter.post('/register', (request, response) => {
    const { name, email, password } = request.body
    db.pool.query('SELECT email FROM users WHERE email = $1;', [email], (error, results) => {
      if (error) {
        throw error
      }
      if (!results.rows[0]) {
        db.pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password], (error, userInserted) => {
          if (error) {
            throw error
          }
          response.status(201).json({ msg: `User added with ID: ${userInserted.rows[0].id}` })
        });
      }
      else {response.status(403).json({ msg: "No can do... Email already exists" });}
    });
});



module.exports = authRouter;