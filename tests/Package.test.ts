import { Program } from "../src/Program";
import { Package, CompletenessError, ConnectednessError } from "../src/Package";


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
    ]))).toThrow(CompletenessError);

    expect(() => new Package(new Map([
        ["Main", progM], ["A", progA], ["B", progB], ["C", new Program("")]
    ]))).not.toThrow();

});