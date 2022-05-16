const router = require("express").Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { populate } = require("../models/Pet.model");
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
router.get('/profile', (req, res, next) => {
 User.findById(req.session.currentUser._id)
 .populate("pets")
    .then((userFound) => {
      console.log(userFound)
      res.render('user-profile', {user:userFound});
    })
    .catch((err) => next(err));
});


// PET-PROFILE
/* router.get('/pet-profile',  (req, res, next) => {
  res.render('pet-profile');
});
 */

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
        res.redirect('/profile');
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
     const userId = req.session.currentUser._id

      const { name } = req.body;
      Pet.create({ name, humans:userId })
        .then((createdPet) => {
            console.log(createdPet)
       return User.findByIdAndUpdate(userId, {$push: {pets:createdPet._id}}, {new:true})
        .then((updatedUser) => {
          res.redirect('/profile');
        })
        })

        .catch((err) => res.redirect('/add-pet'));
    });
  
    // EDIT PET

    router.get('/pet/:id/edit', (req, res, next) => {
      const { id } = req.params;
      Pet.findById(id)
        .then((pet) =>  res.render('edit-pet', {pet}))
      
        .catch((err) => next(err));
    });

    router.post('/pet/:id/edit', (req, res, next) => {
      const { id } = req.params;
      const { name} = req.body;
    
      Pet.findByIdAndUpdate(id, { name })
        .then((pet) => res.redirect('/profile'))
        .catch((err) => next(err));
    });
    
    //DELETE PET
  router.post('/pet/:id/delete', (req, res, next) => {
    console.log("getting here")
    const { id } = req.params;
    console.log("to be deleted", id)
    Pet.findByIdAndRemove(id)
      .then(() => res.redirect('/profile'))
      .catch((err) => next(err));
  });

    //PET PORFILE WITH ID 
    router.get('/pet-profile/:id', (req, res, next) => {
      const { id } = req.params;
      Pet.findById(id)
      .populate("humans")
        .then((pet) => {
          res.render('pet-profile', pet );
        })
        .catch((err) => next(err));
    });

module.exports = router;

