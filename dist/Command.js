"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandType = void 0;
var CommandType;
(function (CommandType) {
    CommandType[CommandType["Inc"] = 0] = "Inc";
    CommandType[CommandType["Dec"] = 1] = "Dec";
    CommandType[CommandType["RsR"] = 2] = "RsR";
    CommandType[CommandType["RsV"] = 3] = "RsV";
    CommandType[CommandType["Goto"] = 4] = "Goto";
    CommandType[CommandType["If"] = 5] = "If";
    CommandType[CommandType["Fn"] = 6] = "Fn";
})(CommandType || (exports.CommandType = CommandType = {}));
//# sourceMappingURL=Command.js.map