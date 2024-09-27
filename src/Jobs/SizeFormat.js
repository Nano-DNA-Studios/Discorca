"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The Size Format for files
 */
var SizeFormat;
(function (SizeFormat) {
    SizeFormat[SizeFormat["B"] = 1] = "B";
    SizeFormat[SizeFormat["KB"] = 1024] = "KB";
    SizeFormat[SizeFormat["MB"] = 1048576] = "MB";
    SizeFormat[SizeFormat["GB"] = 1073741824] = "GB";
    SizeFormat[SizeFormat["TB"] = 1099511627776] = "TB";
})(SizeFormat || (SizeFormat = {}));
exports.default = SizeFormat;
