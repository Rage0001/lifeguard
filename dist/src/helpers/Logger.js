"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const chalk_1 = __importDefault(require("chalk"));
const Sentry = __importStar(require("@sentry/node"));
const moment_1 = __importDefault(require("moment"));
const log = console.log;
exports.default = {
    debug: (item) => {
        log(`[${moment_1.default(moment_1.default.now()).format("hh:mm:ss")}]`, chalk_1.default `{yellow.bold DEBUG: }` + item);
    },
    error: (err) => {
        log(`[${moment_1.default(moment_1.default.now()).format("hh:mm:ss")}]`, chalk_1.default `{red.bold ERROR:} ${err}`);
        Sentry.captureException(err);
    },
    info: (msg) => {
        log(`[${moment_1.default(moment_1.default.now()).format("hh:mm:ss")}]`, chalk_1.default `{blue.bold INFO:} ${msg}`);
    }
};
