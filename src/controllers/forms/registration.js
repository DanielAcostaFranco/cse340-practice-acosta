import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';

const router = Router();

/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50})
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Name can only contain letters, spaces, hyphens and apostrophes'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address')
        .isLength({ max: 255 })
        .withMessage('Email address is too long'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
        .withMessage('Password must contain at least one special character'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];

/**
 * Display the registration form page.
 */
const showRegistrationForm = (req, res) => {
    // TODO: Render the registration form view (forms/registration/form)
    res.render('forms/registration/form', {
    // TODO: Pass title: 'User Registration' in the data object
            title: 'User Registration'
        });
};

/**
 * Handle user registration with validation and password hashing.
 */
const processRegistration = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // TODO: Log validation errors to console for debugging
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        // TODO: Redirect back to /register
        return res.redirect('/register');
    }

    // Extract validated data from request body
    // TODO: Destructure name, email, password from req.body
    const { name, email, password } = req.body;

    try {
        // Check if email already exists in database
        await emailExists(email);
        // TODO: Call emailExists(email) and store the result in a variable
        const emailUsed = await emailExists(email);

        if (emailUsed) {
            // TODO: Log message: 'Email already registered'
            
            req.flash('error', 'User with this email already exists');
            req.flash('error', 'Please use a different email address or log in instead');
            return res.redirect('/register');
        }

        // Hash the password before saving to database
        // TODO: Use bcrypt.hash(password, 10) to hash the password
        // TODO: Store the result in a variable called hashedPassword
        const hashedPassword = await bcrypt.hash(password, 10);
        // Save user to database with hashed password
        // TODO: Call saveUser(name, email, hashedPassword)
        await saveUser(name, email, hashedPassword);

        // TODO: Log success message to console
        req.flash('success', 'Registration successful! You can now log in.');
        res.redirect('/login');
        // TODO: Redirect to /register/list to show successful registration
        // NOTE: Later when we add authentication, we'll change this to require login first
    } catch (error) {
        // TODO: Log the error to console
        errors.array().forEach(error => {
            req.flash('error', error);
        });
        // TODO: Redirect back to /register
        res.redirect('/register');
    }
};

/**
 * Display all registered users.
 */
const showAllUsers = async (req, res) => {
    // Initialize users as empty array
    let users = [];

    try {
        // TODO: Call getAllUsers(<db>) and assign to users variable
        users = await getAllUsers();
    } catch (error) {
        // TODO: Log the error to console
        console.error('Error:', error);
        // users remains empty array on error
    }

    // TODO: Render the users list view (forms/registration/list)
    res.render('forms/registration/list', {
    // TODO: Pass title: 'Registered Users' and the users variable in the data object
        title: 'Registered Users',
        users
    });
};

/**
 * GET /register - Display the registration form
 */
router.get('/', showRegistrationForm);

/**
 * POST /register - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration);

/**
 * GET /register/list - Display all registered users
 */
router.get('/list', showAllUsers);

export default router;