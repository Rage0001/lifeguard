"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseUser(user) {
    if (user.startsWith("<@") && user.endsWith(">")) {
        user = user.slice(2, -1);
        if (user.startsWith("!")) {
            user = user.slice(1);
        }
        return user;
    }
    else {
        return user;
    }
}
exports.parseUser = parseUser;
