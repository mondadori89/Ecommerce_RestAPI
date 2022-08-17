const express = require('express');
const db = require('../db.js');
const { updateStock }= require('./orders_helpers.js');


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
ordersRouter.post('/add-product', async (request, response) => {
    const { order_id, product_id, product_quantity } = request.body;

    await db.pool.query(
        'SELECT name, quantity FROM products WHERE id = $1;',
        [product_id],
        (error, results) => {
            if (error) {
              throw error
            }
            const productName = results.rows[0].name;

            const productStock = results.rows[0].quantity;

            if (product_quantity <= productStock) {
                db.pool.query(
                    'INSERT INTO orders_products (order_id, product_id, product_quantity) VALUES ($1, $2, $3) RETURNING *;',
                    [order_id, product_id, product_quantity],
                    (error, productInserted) => { if (error) { throw error } }
                );
                
                const stockLeft = productStock - product_quantity;

                updateStock(product_id, stockLeft);

                response.status(201).json({ msg: `${product_quantity} ${productName}(s) added to your cart and ${stockLeft} left on stock.`})

            } else { response.status(201).json({ msg: `Not enought on stock.`}) }
        }
    );   
});


// PUT orders_products         to change the quantity on the products
ordersRouter.put('/:id/change-product', (request, response) => {
    const order_id = request.params.id;
    const { product_id, product_quantity_added } = request.body;

    db.pool.query(
        'SELECT order_id, product_id, product_quantity FROM orders_products WHERE order_id = $1 AND product_id = $2;',
        [order_id, product_id],
        (error, results) => {
            if (error) { throw error }
            const productQuantityOnOrder = results.rows[0].product_quantity;
            const newProductQuantityOnOrder = productQuantityOnOrder + product_quantity_added

            db.pool.query(
                'UPDATE orders_products SET product_quantity = $3 WHERE order_id = $1 AND product_id = $2;',
                [order_id, product_id, newProductQuantityOnOrder],
                (error, results) => {
                    if (error) { throw error }
                    response.status(201).json({ msg: `Order with Id ${order_id} updated.`})
                }
            );
        }
    );
});


// DELETE orders_products      to delete products from the order
ordersRouter.delete('/:id/:product_id', (request, response) => {
    const order_id = request.params.id;
    const product_id = request.params.product_id;
    db.pool.query(
        'DELETE FROM orders_products WHERE order_id = $1 AND product_id = $2;',
        [order_id, product_id],
        (error, results) => {
            if (error) { throw error }
            response.status(201).json({ msg: `Item with Id ${product_id} deleted from Order ${order_id}.`})
        }
    );
});


// PUT order             to change the order status (Paid, Canceled, Delivered), like after payment or if you cancel the order.
ordersRouter.put('/:id', (request, response) => {
    const id = request.params.id;
    const { status } = request.body;
    db.pool.query(
        'UPDATE orders SET status = $2 WHERE id = $1;', 
        [id, status], 
        (error, results) => {
            if (error) { throw error }
            response.status(200).json({ msg: `Order ${id} updated with status: ${status}.`})
        }
    )
});




module.exports = ordersRouter;