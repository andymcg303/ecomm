const express = require('express');
const { check,
        validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

router.post('/signup', [
    check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .custom( async email => {
            const existingUser = await usersRepo.getOneBy({ email });
            if(existingUser) {
                throw new Error('Email already in use');
            }
        }),
    check('password')
        .trim()
        .isLength({ min: 4, max: 20 }),
    check('passwordConfirmation')
        .trim()
        .isLength({ min: 4, max: 20 })
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error('Passwords must match');
            }
            return true;        
        })
    ],
    async (req, res) => {    
    
    const errors = validationResult(req);
    console.log(errors);

    const { email, password, passwordConfirmation } = req.body;

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