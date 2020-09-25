const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

// Modern version of body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['lkhsjghdfah'] 
}));
app.use(authRouter);

app.listen(3000, () => {
    console.log('Listening');
})