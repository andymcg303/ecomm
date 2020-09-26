const express = require('express');
const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

router.post('/signup', [
    check('email').isEmail(),
    check('password'),
    check('passwordConfirmation')
], async (req, res) => {    
    
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

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You have logged out');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
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

});

module.exports = router;