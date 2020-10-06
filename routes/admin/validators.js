const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email eddress')
        .custom( async email => {
            const existingUser = await usersRepo.getOneBy({ email });
            if(existingUser) {
                throw new Error('Email already in use');
            }
        }),
    requirePassword: check('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be between 4 and 20 characters'),
    requirePasswordConfirmation: check('passwordConfirmation')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be between 4 and 20 characters')
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error('Passwords must match');
            }
            return true;       
        }),
    requireSigninEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email eddress')
        .custom( async email => {
            const user = await usersRepo.getOneBy({ email });
            if (!user) {
                throw new Error('User not found');   
            }
        }),
    requireSigninPassword: check('password')
        .trim()
        .custom( async ( password, { req }) => {
            const user = await usersRepo.getOneBy({ email: req.body.email });
            if (!user) {
                throw new Error('Password is incorrect'); // as shows up on password input  
            }
            const isValidPassword = await usersRepo.comparePasswords(
                user.password, 
                password
            ); 
            if (!isValidPassword) {
                throw new Error('Password is incorrect');
            }
        })
};