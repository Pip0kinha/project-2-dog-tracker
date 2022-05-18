const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { populate } = require("../models/Pet.model");
const Pet = require("../models/Pet.model");
const User = require("../models/User.model");
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Task = require("../models/Task.model");
const saltRounds = 10;
const fileUploader = require("../config/cloudinary.config");

//HOME
router.get("/", (req, res, next) => {
  res.render("home");
});

router.get("/home", (req, res, next) => {
  res.render("home");
});

// USER-PROFILE
router.get("/profile", (req, res, next) => {
  User.findById(req.session.currentUser._id)
    .populate("pets")
    .then((userFound) => {
      console.log(userFound);
      res.render("user-profile", { user: userFound });
    })
    .catch((err) => next(err));
});

// SIGN UP
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("auth/signup", { errorMessage: "All fields are required" });
  } else {
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
      .then((user) => {
        req.session.currentUser = user;
        req.app.locals.user = user;
        res.redirect("/profile");
      })

      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(500).redirect("/signup", { errorMessage: err.message });
        } else if (err.code === 11000) {
          res.status(500).render("auth/signup", {
            errorMessage: "Username needs to be unique.",
          });
        } else {
          next(err);
        }
      });
  }
});

// LOGIN
router.get("/login", (req, res, next) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/login", { errorMessage: "All fields are required" });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { errorMessage: "User not found" });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        req.app.locals.user = user;

        console.log(req.session);
        res.redirect("/profile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password" });
      }
    })
    .catch((err) => next(err));
});

router.get("/logout", (req, res, next) => {
  req.app.locals.user = null;
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

//EDIT USER PROFILE

/* router.get("/user/:id/edit", (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => res.render("edit-profile", { user }))

    .catch((err) => next(err));
});

router.post("/user/:id/edit", (req, res, next) => {
  const { id } = req.params;
  const { username } = req.body;

  User.findByIdAndUpdate(id, { username })
    .then((user) => res.redirect("/profile"))
    .catch((err) => next(err));
});
 */

//PET routes

//Add a pet

router.get("/add-pet", (req, res, next) =>
  User.find().then((users) => res.render("add-pet", { users }))
);

router.post("/add-pet", (req, res, next) => {
  const userId = req.session.currentUser._id;

  const { name } = req.body;
  Pet.create({ name, humans: userId })
    .then((createdPet) => {
      console.log(createdPet);
      return User.findByIdAndUpdate(
        userId,
        { $push: { pets: createdPet._id } },
        { new: true }
      ).then((updatedUser) => {
        res.redirect("/profile");
      });
    })

    .catch((err) => res.redirect("/add-pet"));
});

// EDIT PET

router.get("/pet/:id/edit", (req, res, next) => {
  const { id } = req.params;
  Pet.findById(id)
    .then((pet) => res.render("edit-pet", { pet }))

    .catch((err) => next(err));
});

router.post(
  "/pet/:id/edit",
  fileUploader.single("pet-img"),
  async (req, res, next) => {
    const { id } = req.params;
    const { name, newHuman, removeHuman } = req.body;
    let imageUrl;
    let newUser;
    let deletedUser;
    let pet = await Pet.findById(id);

    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    if (removeHuman && removeHuman.length > 0) {
      deletedUser = await User.findOne({ username: removeHuman });
    }

    if (deletedUser) {
      User.findByIdAndUpdate(deletedUser._id, { $pull: { pets: pet._id } })
        .then(() => {
          return Pet.findByIdAndUpdate(id, {
            name,
            $pull: { humans: deletedUser._id },
          })
            .then((pet) => res.redirect("/profile"))
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    }

    if (newHuman && newHuman.length > 0) {
      newUser = await User.findOne({ username: newHuman });
    }

    if (
      newUser &&
      pet.humans.filter((human) => human.toString() === newUser._id.toString())
        .length === 0
    ) {
      User.findByIdAndUpdate(newUser._id, { $push: { pets: pet._id } })
        .then(() => {
          return Pet.findByIdAndUpdate(id, {
            name,
            $push: { humans: newUser._id },
          })
            .then((pet) => res.redirect("/profile"))
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    }

    Pet.findByIdAndUpdate(id, { name, imageUrl })
      .then((pet) => res.redirect("/profile"))
      .catch((err) => next(err));
  }
);

//DELETE PET
router.post("/pet/:id/delete", (req, res, next) => {
  console.log("getting here");
  const { id } = req.params;
  /* console.log("to be deleted", id); */
  Pet.findByIdAndRemove(id)
    .then(() => res.redirect("/profile"))
    .catch((err) => next(err));
});

//PET PORFILE WITH ID
router.get("/pet-profile/:id", (req, res, next) => {
  const { id } = req.params;
  Pet.findById(id)
    .populate("humans")
    .populate("tasks")
    .then((pet) => {
      console.log(pet);
      res.render("pet-profile", { pet, user: req.session.currentUser });
    })
    .catch((err) => next(err));
});

//ADD TASK

router.post("/pet-profile/:id", (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;
  Task.create({ content })
    .then((createdTask) => {
      console.log(createdTask);
      return Pet.findByIdAndUpdate(
        id,
        { $push: { tasks: createdTask._id } },
        { new: true }
      ).then((pet) => {
        res.redirect(`/pet-profile/${id}`);
      });
    })

    .catch((err) => res.redirect(`/pet-profile/${id}`));
});

//DELETE TASK

router.post("/pet-profile/:id/tasks/:taskid/delete", async (req, res, next) => {
  console.log("getting here");
  const { id, taskid } = req.params;
  let deletedTask;
  Pet.findByIdAndUpdate(id, { $pull: { tasks: taskid } })
    .then(() => res.redirect(`/pet-profile/${id}`))
    .catch((err) => next(err));
});

module.exports = router;
