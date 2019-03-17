const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../../config');
const UIDGenerator = require('uid-generator');
const uid = new UIDGenerator(256);

const Session = require('../models/session.model');
const User = require('../models/user.model');


function randomize() {
    // It will slide sessions 50% of the time
    return Math.random() < 0.5;
}

router.get('/', async (req, res, next) => {

    const session = req.cookies.SESSION;

        if (session) {

            try {
                
            // Search for a valid session
            const validSession = await Session.findOne({ session: session });
        
            // Search for the user logged to make the new payload 
            const user = await User.findOne({ email: validSession.email });

                if (validSession !== null && user !== null) {
                    const newToken = jwt.sign({ role: user.role }, config.JWT_SECRET, { expiresIn: '5m' });
                        
                    // Sending the cookie with the refreshed token
                    res.cookie('TOKEN', newToken, { 
                        maxAge: 24 * 60 * 60 * 1000, 
                        httpOnly: true,
                        // Put this during prodution
                        // secure: true
                    });
                }

            } catch(err) {
                res.sendStatus(401);
                return next('Invalid session');
            }
            
            // Sliding session ID randomly
            if (randomize()) {
                try {
                    // Generates new random string
                    const newSession = await uid.generate();
                    // Update session ID on DB
                    const updateSession = await Session.findOneAndUpdate({ session: session }, { session: newSession });
                    // Sending the cookie back with the new session
                    res.cookie('SESSION', newSession, { 
                        maxAge: 24 * 60 * 60 * 1000,
                        httpOnly: true,
                        // Put this during production
                        // secure: true
                    });
                } catch(err) {
                    res.sendStatus(401);
                    return next('Problems refreshing your session. Login again');
                }
            } 
        next();
        } else {
            res.sendStatus(401);
        }
    res.sendStatus(200)
    next('Session refreshed');
});

module.exports = router;