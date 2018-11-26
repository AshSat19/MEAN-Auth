// Description: User Authorization route
// Author: AshwinSathian

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//Sign Up Route
router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email.trim().toLowerCase(),
            password: hash
        });
        user.save()
        .then(result => {
            res.status(201).json({
                message: 'New User Created',
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Invalid Authemtication credentials'
            });
        });
    });
});

//  Login Route
router.post('/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email.trim().toLowerCase() })
    .then(user => {
        if(!user) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        fetchedUser = user;
        console.log(fetchedUser);
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        if (!result) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          "JWT_Auth_Token_Secret",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          email: fetchedUser.email,
          expiresIn: 3600
        });
      })
      .catch(err => {
        return res.status(401).json({
            message: 'Invalid Authemtication credentials'
        });
      });
  });

module.exports = router;