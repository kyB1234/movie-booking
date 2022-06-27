const formidable = require("formidable");
const User = require("../../models/Users");
const bcrypt = require('bcryptjs');
const {ObjectId} = require("mongodb");
const saltRounds = 10;

const registration = (req, res) => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy - 18 + '-' + mm + '-' + dd;
    const form = formidable({multiples: true});
    form.parse(req, (err, fields, files) => {
        if (fields.firstName === "" || fields.lastName === "" || fields.email === "" || fields.gender === undefined || fields.dateOfBirth === "" || fields.phoneNo === "" || fields.password === "" || err) {
            req.flash('toastMessage', `Please enter all the details`);
            res.redirect("back")
        } else {
            if (new Date(fields.dateOfBirth) > new Date(today)) {
                req.flash('toastMessage', `Invalid Date of birth`);
                res.redirect("back")
            } else {
                const user = new User({
                    userId: new ObjectId(),
                    firstName: fields.givenName,
                    lastName: fields.familyName,
                    email: req.session.user.email,
                    imageUrl: req.session.imageUrl,
                    gender: fields.gender,
                    dateOfBirth: fields.dateOfBirth,
                    phoneNo: fields.phoneNo,
                });
                console.log({...fields}, user, "review this")
                bcrypt.hash(fields.password, saltRounds, (err, hash) => {
                    user.password = hash
                    user.save((err, doc) => {
                        if (err) {
                            console.log(err);
                            req.flash('toastMessage', `some error try again`);
                            res.redirect("back")
                        } else {
                            req.session.newUser = false;
                            req.flash('toastStatus', `success`);
                            req.flash('toastMessage', `Hello ${doc.firstName} ${doc.lastName}!`);
                            res.redirect('/');
                        }
                    });
                });
            }


        }
    });
}

const checkUserByEmail = (req, accessToken, refreshToken, profile, done) => {
    User.findOne({email: profile.emails[0].value}, (error, user) => {
        if (error) {
            return done(error);
        } else if (user) {
            req.session.user = user;
            req.session.imageUrl = profile["_json"]["picture"];
            if (profile.emails[0].value === "harish.numb19@gmail.com") {
                req.session.isAdmin = true
            } else {
                req.session.isAdmin = false
            }
            req.session.loggedIn = true;

            req.session.newUser = false;
            req.flash("toastStatus", "success");
            req.flash("toastMessage", `Hey ${user.firstName} ${user.lastName}, welcome back!`);
            return done(null, user);
        } else {
            req.session.newUser = true;
            req.session.loggedIn = true;
            req.session.user = profile;
            req.session.user.name = profile.displayName;
            req.session.user.email = profile.emails[0].value;
            req.session.user.imageUrl = profile.photos[0].value;
            req.session.imageUrl = profile["_json"]["picture"];
            return done(null, null);
        }
    });
};
const checkUserByEmailPassword = (req, res) => {
    const form = formidable({multiples: true});
    form.parse(req, (err, fields, files) => {
        if (fields.email === "" || fields.password === "") {
            req.flash("toastMessage", `Please enter all the details`);
            res.redirect("back");
        } else {
            User.findOne({email: fields.email}, (error, user) => {
                if (error) {
                    console.log("mo user wur", error);
                    req.flash("toastMessage", `email or password incorrect`);
                    res.redirect("back");
                } else if (user) {
                    bcrypt.compare(fields.password, user.password, (err, result) => {
                        if (err || !result) {
                            console.log("mo user wur", err);
                            req.flash("toastMessage", `email or password incorrect`);
                            res.redirect("back");
                        } else {
                            if (fields.email === "harish.numb19@gmail.com") {
                                req.session.isAdmin = true
                            } else {
                                req.session.isAdmin = false
                            }
                            req.session.user = user;
                            req.session.imageUrl = user.imageUrl;
                            req.session.loggedIn = true;
                            req.session.newUser = false;
                            req.flash("toastStatus", "success");
                            req.flash("toastMessage", `Hey ${user.firstName} ${user.lastName}, welcome back!`);
                            res.redirect("/");
                        }
                    });
                } else {
                    console.log("mo user");
                    req.flash("toastMessage", `email or password incorrect`);
                    res.redirect("back");
                }
            });
        }
    });
};
const checkUserById = (id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
};
module.exports = {
    registration, checkUserByEmail, checkUserByEmailPassword, checkUserById,
};
