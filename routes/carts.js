const express = require('express');
const productsRepo = require('../repositories/carts');

const router = express.Router();

// receive a post request to add item to cart
router.post('/cart/products', (req, res) => {
    console.log(req.body.productId);
    res.send(`Product ${req.body.productId} added to cart`);
})

//receive get request to show all items in cart

//receive a post request to delete item from cart

module.exports = router;