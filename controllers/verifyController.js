const {verifyTicket} = require("../data/verify/verify");
module.exports.verify = async (req, res, next) => {
    const status = await verifyTicket(req)
    console.log(status[0])
    if (status && status[0]) {
        res.render('pages/orders/verify', {
            showTimeId: status[0].showTimeId,
            seats: status[0].seats,
            orderId: req.params.id,
            isValid: new Date(status[0].showTimeId) > new Date()
        });
    } else {
        res.render('pages/error/notFound')
    }
}
module.exports.checkAdmin = (req, res, next) => {
    console.log(req.session, "session is here")
    if (req.session.isAdmin === true) {
        next()
    } else {
        req.flash("toastMessage", "User not authorized");
        res.redirect("/")
    }
}
