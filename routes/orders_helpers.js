const db = require('../db.js');

function updateStock(product_id, stockLeft) {
    db.pool.query(
        'UPDATE products SET quantity = $2 WHERE id = $1;',
        [product_id, stockLeft],
        (error, results) => {
            if (error) {
              throw error
            }
        }
    );
}

module.exports = {
    updateStock
}