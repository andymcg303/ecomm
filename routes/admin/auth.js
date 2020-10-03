const express = require('express');
const { validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail,
        requirePassword,
        requirePasswordConfirmation } = require('./validators');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

router.post('/signup', [
        requireEmail,
        requirePassword,
        requirePasswordConfirmation
    ],
    async (req, res) => {    
    
        const errors = validationResult(req);
        
        if (!errors.isEmpty()){
            return res.send(signupTemplate({ req, errors }));
        }

        const { email, password, passwordConfirmation } = req.body;
        const user = await usersRepo.create({ email, password });

        // Store the id of the user inside the users cookie
        req.session.userId = user.id;

        res.send('Account created for user ' + req.session.userId);
    }
);

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You have logged out');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate());
});

router.post('/signin',
    async (req, res) => {

        const errors = validationResult(req);

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

    }
);

module.exports = router;