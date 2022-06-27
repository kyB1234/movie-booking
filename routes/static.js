const express = require("express");
const router = express.Router();
const passport = require('passport');
const staticController = require("../controllers/staticController");
const Genres = require("../models/Genres");
const TopMovies = require("../models/TopMovies");
const Language = require("../models/Language");
const Banner = require("../models/Banner");


router.get("/", staticController.setUser, staticController.home);
router.get("/login", staticController.login);
router.post("/login", staticController.loginAuth);
router.get("/register", staticController.register);
router.post("/register", staticController.registerSubmit, staticController.register);
router.get("/movies", staticController.setUser, staticController.moviesList);
router.post("/movies", staticController.setUser, staticController.moviesListWithFilters);
router.get("/movies/:id", staticController.setUser, staticController.movies);
router.get("/movies/:id/book", staticController.setUser, staticController.theaterList);
router.post("/movies/:id/book/seat", staticController.setUser, staticController.seatSelection);
router.post("/movies/:id/book/seat/pay", staticController.setUser, staticController.checkout);
router.post("/ticket", staticController.checkAuth, staticController.setUser, staticController.ticket);
// router.post("/top", function (req, res) {
//     const {movieId} = req.body;
//     let tm = new TopMovies();
//     tm.movieId = movieId;
//     tm.save((err, doc) => {
//         if (err) {
//             console.log(err);
//             req.flash("toastMessage", `some error try again`);
//             res.json({err: err});
//         } else {
//             req.flash("toastMessage", `done`);
//             req.flash("toastStatus", `success`);
//             res.json({success: "success"});
//         }
//     });
// });
// router.post("/banner", function (req, res) {
//     const {movieId, image} = req.body;
//     let ban = new Banner();
//     ban.movieId = movieId;
//     ban.image = image;
//     ban.save((err, doc) => {
//         if (err) {
//             console.log(err);
//             req.flash("toastMessage", `some error try again`);
//             res.json({err: err});
//         } else {
//             req.flash("toastMessage", `done`);
//             req.flash("toastStatus", `success`);
//             res.json({success: "success"});
//         }
//     });
// });
// router.post("/genre", function (req, res) {
//     const {name, images} = req.body;
//     let gen = new Genres();
//     gen.name = name;
//     gen.images = images;
//     gen.save((err, doc) => {
//         if (err) {
//             console.log(err);
//             req.flash("toastMessage", `some error try again`);
//             res.json({err: err});
//         } else {
//             req.flash("toastMessage", `done`);
//             req.flash("toastStatus", `success`);
//             res.json({success: "success"});
//         }
//     });
// });
// router.post("/language", function (req, res) {
//     const {name} = req.body;
//     let lang = new Language();
//     lang.name = name;
//     lang.save((err, doc) => {
//         if (err) {
//             console.log(err);
//             req.flash("toastMessage", `some error try again`);
//             res.json({err: err});
//         } else {
//             req.flash("toastMessage", `done`);
//             req.flash("toastStatus", `success`);
//             res.json({success: "success"});
//         }
//     });
// });
// router.post('/addTheatre', staticController.addTheatre);
// router.post('/addMovie', staticController.addMovie);
// router.post('/addMovieScreens', staticController.addMovieScreens);
router.get("/logout", staticController.logout);

// Google oAuth Sign In
router.get("/oauth/signin", passport.authenticate("google", {scope: ["profile", "email"]}));

// Google oAuth Callback
router.get("/oauth/signin/callback", passport.authenticate("google", {
    successRedirect: "/", failureRedirect: "/register",
}));

module.exports = router;

