const express = require('express');
const db = require('../db.js')


const ordersRouter = express.Router();





/*
API Plan:


GET order                   to get the order sumary


POST new order              to start a new order / get user id, set status "pending"


POST new orders_products    to include products on the order / get product id, order id, set quantity


PUT orders_products         to change the quantity on the products
DELETE orders_products      to delete products from the order

PUT order                   to change the order status, like after payment
DELETE/PUT order            to cancel an order

*/





module.exports = ordersRouter;