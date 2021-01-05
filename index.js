const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts'); 

const app = express();
app.use(express.static(`${__dirname}/public`));

// Modern version of body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['lkhsjghdfah'] 
}));
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);
app.listen(3000, () => {
    console.log('Listening');
})