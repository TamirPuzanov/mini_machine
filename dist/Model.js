"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
class Model {
    command_names() {
        return new Set(this.defined_commands.keys());
    }
}
exports.Model = Model;
//# sourceMappingURL=Model.js.map