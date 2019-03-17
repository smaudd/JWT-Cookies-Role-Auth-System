const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config');
const UIDGenerator = require('uid-generator');
const uid = new UIDGenerator(256);

const checkRole = require('../permissions');
const User = require('../models/user.model');
const Session = require('../models/session.model');

router.post('/', async (req, res, next) => {

    const { email, password } = req.body;

    try {
        // Finding the user registered with the request body email
        const user = await User.findOne({ email: email });
    
        // Verifying 
        if (user.password === password) {
     
            // Sign the token with the user's role as payload
            const token = jwt.sign({ role: user.role }, config.JWT_SECRET, {
                expiresIn: '5m'
            })

            // Attach a set-cookie to the response with the token using httpOnly
            res.cookie('TOKEN', token, {
                // One day expiration (This is just for the cookie, the token will expire every five minutes)
                maxAge: 3600 * 5,
                httpOnly: true
                // Use this on production
                // secure: true,
            });
  
        } else {
            res.status(422);
            // Wrong password
            return next('Authentication failed');
        }
    } catch(err) {

        res.sendStatus(404)
        // Wrong email
        return next('Authentication failed');
    }


    try {
        // Create a radom hash for a new session
        const session = await uid.generate();
        // Saves the session on DB
        const newSession = new Session({
            email: email,
            session: session
        });

        const createSession = await newSession.save();
       
        res.cookie('SESSION', newSession.session, {
            // One day expiration
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            // Use this during production
            // secure: true,
        });
      

    } catch(err) {

        res.sendStatus(500);
        return next('Unable to create a session');
    }

    res.sendStatus(200);
    next('User correctly logged in');
});

module.exports = router;



