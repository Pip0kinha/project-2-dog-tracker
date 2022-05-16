const router = require("express").Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Pet = require("../models/Pet.model");
const User = require('../models/User.model');
const saltRounds = 10;

//HOME
router.get("/", (req, res, next) => {
  res.render("home");
});

router.get("/home", (req, res, next) => {
  res.render("home");
});

// USER-PROFILE
router.get('/profile',  (req, res, next) => {
  res.render('user-profile'/* , { user:req.session.currentUser} */);
});


// PET-PROFILE
router.get('/pet-profile',  (req, res, next) => {
  res.render('pet-profile'/* , { user:req.session.currentUser} */);
});


// SIGN UP 
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
      res.render('auth/signup', { errorMessage: 'All fields are required' });
    }
    else{
      bcrypt
      .genSalt(saltRounds)
      .then((salt) => {
        return bcrypt.hash(password, salt);
      })
      .then((hashedPassword) => {
        return User.create({
          username,
          passwordHash: hashedPassword,
        });
      })
      .then(() => res.redirect('/profile'))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(500).redirect('/signup', { errorMessage: err.message });
        } else if (err.code === 11000) {
          res.status(500).render('auth/signup', {
            errorMessage:
              'Username needs to be unique.',
          });
        } else {
          next(err);
        }
      });
    }
   
});

// LOGIN
router.get('/login', (req, res, next) => res.render('auth/login'));

router.post('/login',  (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/login', { errorMessage: 'All fields are required' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'User not found' });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
          req.session.currentUser = user;
          req.app.locals.currentUser = user; 

        console.log(req.session);
        res.render('user-profile', { user });
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password' });
      }
    })
    .catch((err) => next(err));
}); 


router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect('/');
  });
});


//PET routes
//Add a pet 

router.get("/add-pet", (req, res, next) => 
    User.find()
    .then((users) => res.render("add-pet", {users}))
    );

    router.post("/add-pet", (req, res, next) => {
      const { name, humans } = req.body;
      Pet.create({ name, humans })
        .then(() => {
            res.redirect('/pet-profile');
        })
        .catch((err) => res.redirect('/add-pet'));
    });
  
    router.get('/pet-profile', (req, res, next) => {
      Pet.find({})
        .then((pets) => {
          res.render('/pet-profile', { pets });
        })
        .catch((err) => next(err));
    });

module.exports = router;

