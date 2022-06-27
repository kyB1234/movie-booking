const {userdata} = require("./userController");
const {updateUserData, getUserData, getUserOrderHistory} = require("../data/user/user");
const {ObjectId} = require("mongodb");

module.exports.home = async function (req, res, next) {

    const user = await getUserData(req.session.user.userId);

    res.render('pages/user/profile', {user: user});
}
module.exports.history = async function (req, res, next) {

    const userOrderHistory = await getUserOrderHistory(req.session.user.userId);

    res.render('pages/user/orderHistory', {'orderHistory': userOrderHistory});
}
module.exports.active = function (req, res, next) {
    res.render('tickers');
}

module.exports.userdata = async function (req, res, next) {
    try {
        const userData = await getUserData(req.session.user.userId);
        res.json(userData);
    } catch (e) {
        console.log(e)
        req.flash("Invalid request")
    }
}

module.exports.updateUser = async function (req, res, next) {

    /*------------ Error Handling Start ------------*/

    const userId = req.params.id;

    if (Object.keys(req.body).length < 5) throw 'Error: Less Data passed';

    const [firstName, lastName, gender, dateOfBirth, phoneNo] = [req.body.firstName, req.body.lastName, req.body.gender, req.body.dateOfBirth, req.body.phoneNo];
    if (!userId || !firstName || !lastName || !gender || !dateOfBirth || !phoneNo) throw "Error: Request body empty || Error: less data passed";
    if (!ObjectId.isValid(userId)) throw "Error: Invalid userId";
    if (typeof firstName != 'string') throw "Error: firstName not of type string";
    if (typeof lastName != 'string') throw "Error: lastName not of type string";
    if (typeof gender != 'string') throw "Error: gender not of type string";
    if (!new Date(dateOfBirth)) throw "Error: dateOfBirth not of type date";
    if (phoneNo.match(/\d/g).length !== 10) throw 'Error: Invalid Phone Number';

    /*------------ Error Handling End ------------*/

    await updateUserData(userId, firstName, lastName, gender, dateOfBirth, phoneNo);
}
