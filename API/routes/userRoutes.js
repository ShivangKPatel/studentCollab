/*
        This file contain the routes for the user
        /user/getUser    => Input: username                    => Output: User data
        /user/register   => Input: username, email, password   => Output: User registered successfully
        /user/register   => Input: username, password          => Output: User logged in successfully
*/

const bodyParser = require('body-parser');
const express = require('express');
const DB = require("../dbFunc/db.js");
const jwt = require('jsonwebtoken');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/register', async function(req, res) {
    const userData = req.body;
    try {
        //Check for username, email and password
        if (!userData.username || !userData.email || !userData.password) {
            return res.status(400).send({ msg: "Please pass username, email and password" })
        }

        //Check for user is not already registered
        result = await DB.searchUser(userData.email);
        if (result) {
            return res.status(400).send({ msg: "User already exists" })
        }

        //Register the user
        result = await DB.registerUser(userData);
        if (result) {
            return res.send({ msg: "User registered successfully" })
        } else {
            return res.send({ msg: "User is not registered." })
        }
    } catch (err) {
        console.log(err)
    }
});

router.post('/login', async function(req, res) {
    const userData = req.body; // Username and Password
    try {
        //Check for username, email and password
        if (!userData.username || !userData.password) {
            return res.status(400).send({ msg: "Please enter username and password" })
        }

        //Check for usercredentials
        result = await DB.Login(userData);
        if (result) {
            return res.send({ msg: "User logged in successfully" })
        } else {
            return res.status(400).send({ msg: "User is not logged in." })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ msg: "Internal Server Error" })
    }
});

router.get('/verify/:token', async function(req, res) {

    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).send({ msg: "Please pass token" })
        }

        // Verifying the JWT token  
        jwt.verify(token, 'ourSecretKey', function(err, decoded) {
            if (err) {
                console.log(err);
                res.status(400).send("Email verification failed, possibly the link is invalid or expired ");
            } else {
                console.log(decoded.data);
                res.send("Email verifified successfully");
            }
        });
    } catch (err) {
        console.log(err)
        return res.status(500).send({ msg: "Internal Server Error" })
    }
});

router.post('/forgotpassword', async function(req, res) {
    const userData = req.body;
    try {
        if (!userData.email) {
            return res.status(400).send({ msg: "Please pass email" })
        }

        Status = await DB.forgotPassword(userData.email);
        if (Status) {
            res.send({ msg: "Email sent successfully" })
        } else {
            res.send({ msg: "Email not sent" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: "Internal Server Error" })
    }
});

router.get('/forgotpasswordmail/:token', async function(req, res) {
    const { token } = req.params;
    try {
        jwt.verify(token, 'ourSecretKey', function(err, decoded) {
            if (err) {
                console.log(err);
                res.status(400).send("Email verification failed, possibly the link is invalid or expired ");
            } else {
                console.log(decoded.data);
                console.log("Password updated succesfully");
            }
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: "Internal Server Error" })
    }
});

router.post('/updatepassword', async function(req, res) {
    const userData = req.body;
    try {
        if (!userData.email || !userData.password) {
            return res.status(400).send({ msg: "Please pass email and password" })
        }

        Status = await DB.updatePassword(userData);
        if (Status) {
            res.send({ msg: "Password updated successfully" })
        } else {
            res.send({ msg: "Password not updated" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: "Internal Server Error" })
    }
});

router.get('/getUser', async function(req, res) {
    userData = req.query.username; //username
    try {
        if (!userData) {
            return res.status(400).send({ msg: "Please pass username" })
        }

        //Search user data by username from database
        result = await DB.getUser(userData);
        if (result) {
            res.send(result)
        } else {
            res.send({ msg: "User not found" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: "Internal Server Error" })
    }
});

module.exports = router