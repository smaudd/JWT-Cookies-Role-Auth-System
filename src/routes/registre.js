const express = require('express')
const router = express.Router();

const User = require('../models/user.model');

router.post('/', async (req, res, next) => {

    // Creating variables using the request body
    const { email, password, role } = req.body;
    // New instance of User Schema
    const user = new User({
        email: email,
        // Use encyption to do this....
        password: password,
        role: role
    })

    try {
        // Saving the user on DB
        const newUser = await user.save();
        res.sendStatus(201);
        next('User correctly created');

    } catch(err) {

        res.sendStatus(500);
        return next(`Unable to create your user ${err}`);
    }

});

module.exports = router;