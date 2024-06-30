"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tape = void 0;
class Tape {
    constructor(registers) {
        this.registers = registers ? registers : new Map();
        for (let value of this.registers.values()) {
            if (!isFinite(value) || isNaN(value)) {
                throw new RangeError("the value argument must be defined and finite!");
            }
        }
    }
    get(register) {
        let value = this.registers.get(register);
        return value !== undefined && value > 0 ? value : 0;
    }
    set(register, value) {
        if (!isFinite(value) || isNaN(value)) {
            throw new RangeError("the value argument must be defined and finite!");
        }
        this.registers.set(register, value > 0 ? value : 0);
    }
    sum(register, value) {
        this.set(register, this.get(register) + value);
    }
    clone() {
        return new Tape(new Map(this.registers));
    }
    get values() {
        return new Map(this.registers);
    }
}
exports.Tape = Tape;
//# sourceMappingURL=Tape.js.map