const {ObjectId} = require("mongodb");
const Users = require("../../models/Users");
const verifyTicket = async (req) => {
    if (!req || !req.params || !req.params.id || !ObjectId.isValid(req.params.id)) {
        req.flash("toastMessage", "Invalid request")
        return null
    } else {
        const orders = await Users.findOne({"orders.orderId": new ObjectId(req.params.id)});
        if (orders) {
            console.log(orders)
            return orders.orders.filter(order => order.orderId.toString() === req.params.id)
        } else {
            req.flash("toastMessage", "Something went wrong")
            return null;
        }
    }

}

module.exports = {verifyTicket}
