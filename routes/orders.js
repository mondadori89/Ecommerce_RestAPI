const express = require('express');
const db = require('../db.js')


const ordersRouter = express.Router();


// GET order                   to get the order sumary
ordersRouter.get('/:id', (request, response) => {
    const id = request.params.id;
    db.pool.query(
        'SELECT p.id, p.name, p.price, op.product_quantity, o.status FROM orders AS o JOIN orders_products AS op ON o.id = op.order_id JOIN products AS p ON op.product_id = p.id WHERE o.id = $1;', 
        [id], 
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        }
    )
});


// POST new order              to start a new order / get user id, set status "pending"
ordersRouter.post('/new-order', (request, response) => {
    const user_id = request.body.user_id;
    const status = 'Pending';
    db.pool.query(
        'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *;',
        [user_id, status],
        (error, orderInserted) => {
            if (error) {
              throw error
            }
            response.status(201).json(orderInserted.rows[0])
        }
    );
});


// POST new orders_products    to include products on the order / get product id, order id, set quantity
ordersRouter.post('/add-product', (request, response) => {
    const { order_id, product_id, product_quantity } = request.body;
    db.pool.query(
        'INSERT INTO orders_products (order_id, product_id, product_quantity) VALUES ($1, $2, $3) RETURNING *;',
        [order_id, product_id, product_quantity],
        (error, productInserted) => {
            if (error) {
              throw error
            }
            response.status(201).json(productInserted.rows[0])
        }
    );
});



/*
API Plan:

PUT orders_products         to change the quantity on the products
DELETE orders_products      to delete products from the order

PUT order                   to change the order status, like after payment
DELETE/PUT order            to cancel an order

*/



module.exports = ordersRouter;