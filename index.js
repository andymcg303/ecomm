const express = require('express');
// const bodyParser = require('body-parser'); //OLD STYLE WITH bodyParser MIDDLEWARE
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();

// Modern version of body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['lkhsjghdfah'] 
}));

app.get('/signup', (req, res) => {
    res.send(`
    <div>
        Your id is ${req.session.userId} 
        <form method="POST">
            <input name="email" placeholder="email">
            <input name="password" placeholder="password">
            <input name="passwordConfirmation" placeholder="confirm password">
            <button>Sign Up</button>
        </form>
    </div>
    `);
});

app.post('/signup', async (req, res) => {    
    
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email already in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords must match');
    }

    // Create a user in out user repo
    const user = await usersRepo.create({ email, password });

    // Store the id of the user inside the users cookie
    req.session.userId = user.id;

    res.send('Account created for user ' + req.session.userId);
});

app.get('/signout', (req, res) => {
    req.session = null;
    res.send('You have logged out');
})

app.get('/signin', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email">
            <input name="password" placeholder="password">
            <button>Sign In</button>
        </form>
    </div>
    `);
})

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });
    if (!user) {
        return res.send('User not found');   
    }

    const isValidPassword = await usersRepo.comparePasswords(user.password, password); 
    if (!isValidPassword) {
        return res.send('Password is incorrect');
    }

    req.session.userId = user.id;

    res.send(`You are logged in as ${req.session.userId}`);

})

app.listen(3000, () => {
    console.log('Listening');
})