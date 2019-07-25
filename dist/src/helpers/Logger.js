"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const chalk_1 = __importDefault(require("chalk"));
const log = console.log;
exports.default = {
    debug: (item) => {
        log(chalk_1.default `{yellow.bold DEBUG:\n}` + item);
    },
    error: (err) => {
        log(chalk_1.default `{red.bold ERROR:} ${err}`);
    },
    info: (msg) => {
        log(chalk_1.default `{blue.bold INFO:} ${msg}`);
    }
};
