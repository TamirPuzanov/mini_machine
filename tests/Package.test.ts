import { Program } from "../src/Program";
import { Package, InferiorityError, ConnectednessError, OverflowError } from "../src/Package";

import { Tape } from "../src/Tape";


test("(Package) checking the validity of packages", () => {

    let progM = new Program("R0 := A(R1, R2, R3) \n R0 := B(R1, R2, R3) \n R0 := C(R1, R2, R3)");
    let progA = new Program("R0 := B(R1, R2, R3) \n R0 := C(R1, R2, R3)");
    let progB = new Program("R0 := C(R1, R2, R3) \n R0 := C(R1, R2, R3)");
    let progC = new Program("R0 := A(R1, R2, R3)");

    expect(() => new Package(new Map([
        ["Main", progM], ["A", progA], ["B", progB], ["C", progC]
    ]))).toThrow(ConnectednessError);

    expect(() => new Package(new Map([
        ["Main", progM], ["A", progA], ["B", progB],
    ]))).toThrow(InferiorityError);

    expect(() => new Package(new Map([
        ["Main", progM], ["A", progA], ["B", progB], ["C", new Program("")]
    ]))).not.toThrow();
});


test("(Package) checking the processing of defined commands", () => {

    const Fn = ($tape: Tape) => 0;

    let progM = new Program("R0 := A()");
    let progA = new Program("inc R0");

    let progs1 = new Map([
        ["Main", progM], ["A", progA]
    ]);

    let progs2 = new Map([
        ["Main", progM],
    ]);

    expect(() => new Package(progs1, new Map([ ["A", Fn ] ]))).toThrow(OverflowError);
    expect(() => new Package(progs2, new Map([ ["B", Fn ] ]))).toThrow(InferiorityError);
    expect(() => new Package(progs2, new Map([ ["A", Fn ] ]))).not.toThrow();
})