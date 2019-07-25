"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Infraction_1 = require("./Infraction");
exports.User = new mongoose_1.Schema({
    id: String,
    infractions: [Infraction_1.Infraction],
    reminders: Array
});
exports.UserModel = mongoose_1.model("users", exports.User);
function createUser(user) {
    return exports.UserModel.create(user);
}
exports.createUser = createUser;
function findUser(id) {
    return new Promise((res, rej) => {
        exports.UserModel.findOne({
            id
        }, (err, doc) => {
            if (err) {
                return rej(err);
            }
            if (doc) {
                res(doc);
            }
            else {
                res(undefined);
            }
        });
    });
}
exports.findUser = findUser;
