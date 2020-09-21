const express = require('express');
// const bodyParser = require('body-parser'); //OLD STYLE WITH bodyParser MIDDLEWARE
const usersRepo = require('./repositories/users');

const app = express();

// Modern version of body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email">
            <input name="password" placeholder="password">
            <input name="passworConfirmation" placeholder="confirm password">
            <button>Sign Up</button>
        </form>
    </div>
    `);
});

app.post('/', async (req, res) => {    
    
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email already in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords must match');
    }

    res.send('Account created');
});

app.listen(3000, () => {
    console.log('Listening');
})