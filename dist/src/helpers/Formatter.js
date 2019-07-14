"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatter(str, data) {
    const regex = [/\{([^}]+)\}/g, /\{(.*)\}/];
    const matcher = (matched) => {
        const regexMatch = matched.match(regex[1]);
        if (regexMatch) {
            const match = regexMatch[1];
            return data[match];
        }
        else {
            return "";
        }
    };
    return str.replace(regex[0], matcher);
}
exports.formatter = formatter;
