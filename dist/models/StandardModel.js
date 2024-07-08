"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardValue = exports.StandardTape = exports.StandardModel = void 0;
const Command_1 = require("../Command");
const Value_1 = require("../Value");
const Tape_1 = require("../Tape");
const Model_1 = require("../Model");
class StandardValue extends Value_1.Value {
    constructor(v = 0) {
        super();
        this.value = !isNaN(v) && isFinite(v) && v > 0 ? Math.ceil(v) : 0;
    }
    get() {
        return this.value;
    }
    set(v) {
        this.value = !isNaN(v) && isFinite(v) && v > 0 ? Math.ceil(v) : 0;
    }
    toString() {
        return String(this.value);
    }
    toNumber() {
        return this.value;
    }
    clone() {
        return new StandardValue(this.value);
    }
}
exports.StandardValue = StandardValue;
class StandardTape extends Tape_1.Tape {
    constructor(values, registers) {
        if (registers) {
            super(registers);
            return;
        }
        if (!values) {
            super();
            return;
        }
        registers = new Map();
        for (let key of values.keys()) {
            registers.set(key, new StandardValue(values.get(key)));
        }
        super(registers);
    }
    get(register) {
        let register_value = this.registers.get(register);
        if (register_value) {
            return register_value;
        }
        register_value = new StandardValue(0);
        this.set(register, register_value);
        return register_value;
    }
    set(register, value) {
        this.registers.set(register, value);
    }
    assign(register, value) {
        let register_value = this.get(register);
        register_value.set(value.get());
    }
    clone() {
        let registers = new Map();
        for (let key of this.registers.keys()) {
            registers.set(key, this.get(key).get());
        }
        return new StandardTape(registers);
    }
}
exports.StandardTape = StandardTape;
class StandardModel extends Model_1.Model {
    constructor(allow = [], allow_all = true) {
        super();
        this.reducers = new Map([
            [Command_1.CommandType.Inc, StandardModel.inc_reducer],
            [Command_1.CommandType.Dec, StandardModel.dec_reducer],
            [Command_1.CommandType.RsR, StandardModel.rsr_reducer],
            [Command_1.CommandType.RsV, StandardModel.rsv_reducer],
            [Command_1.CommandType.Goto, StandardModel.goto_reducer],
            [Command_1.CommandType.If, StandardModel.if_reducer]
        ]);
        this.defined_commands = new Map();
        if (allow_all) {
            this.defined_commands = new Map(StandardModel.commands);
            return;
        }
        for (let command_name of allow) {
            if (StandardModel.commands.has(command_name)) {
                throw new Error("command '" + command_name + "' not found!");
            }
            this.defined_commands.set(command_name, StandardModel.commands.get(command_name));
        }
    }
    use_command(name, tape) {
        if (!this.defined_commands.has(name)) {
            throw new Error("command '" + name + "' not found!");
        }
        let output_tape = new StandardTape();
        output_tape.assign(0, this.defined_commands.get(name)(tape));
        return output_tape;
    }
    create_tape(registers) {
        return new StandardTape(undefined, registers);
    }
    static inc_reducer(cr, tape, args) {
        let register = tape.get(args[0]);
        register.set(register.get() + 1);
        return cr + 1;
    }
    static dec_reducer(cr, tape, args) {
        let register = tape.get(args[0]);
        register.set(register.get() - 1);
        return cr + 1;
    }
    static rsr_reducer(cr, tape, args) {
        tape.get(args[0]).set(tape.get(args[1]).get());
        return cr + 1;
    }
    static rsv_reducer(cr, tape, args) {
        tape.get(args[0]).set(args[1]);
        return cr + 1;
    }
    static goto_reducer(cr, tape, args) {
        return args[0];
    }
    static if_reducer(cr, tape, args) {
        if (tape.get(args[0]).get() === 0)
            return args[1];
        return cr + 1;
    }
}
exports.StandardModel = StandardModel;
StandardModel.commands = new Map([]);
//# sourceMappingURL=StandardModel.js.map