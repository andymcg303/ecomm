const express = require('express');
// const bodyParser = require('body-parser'); //OLD STYLE WITH bodyParser MIDDLEWARE

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
            <input name="passwordconf" placeholder="confirm password">
            <button>Sign Up</button>
        </form>
    </div>
    `);
});

app.post('/', (req, res) => {    
    console.log(req.body);
    res.send('Account created');
});

app.listen(3000, () => {
    console.log('Listening');
})