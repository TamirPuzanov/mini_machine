import Parser, { ParseError } from "../src/Parser";
import { CommandType } from "../src/Command";


test("(Parser) method of extracting arguments", () => {
    expect(Parser.extract_args("R1 := R2")).toEqual([1, 2]);
    expect(Parser.extract_args("R1 := 2024")).toEqual([1, 2024]);
    expect(Parser.extract_args("if R1 = 0 goto 0")).toEqual([1, 0, 0]);
});

test("(Parser) parsing commands and building a list of commands", () => {

    expect(Parser.parse("inc R1 \n dec R3")).toEqual([
        new Map([
            [0, { type: CommandType.Inc, args: [1], link: null }],
            [1, { type: CommandType.Dec, args: [3], link: null }],
        ]), 2
    ]);

    expect(Parser.parse("R1 := R2 \n \n R2 := 3")).toEqual([
        new Map([
            [0, { type: CommandType.RsR, args: [1, 2], link: null }],
            [2, { type: CommandType.RsV, args: [2, 3], link: null }],
        ]), 3
    ]);

    expect(Parser.parse("\n goto 2024 \n if R10 = 0 goto 7")).toEqual([
        new Map([
            [1, { type: CommandType.Goto, args: [2024],  link: null }],
            [2, { type: CommandType.If,   args: [10, 7], link: null }],
        ]), 3
    ]);

    expect(() => Parser.parse("\n inc 10")).toThrow(ParseError);
});


test("(Parser) checking the parsing of additional (functional) commands", () => {

    expect(Parser.parse("\n R0 := SumA(R1, R2) \n \n \n R1 := SumB(R0, R2)")).toEqual([
        new Map([
            [1, { type: CommandType.Fn, args: [0, 1, 2], link: "SumA" }],
            [4, { type: CommandType.Fn, args: [1, 0, 2], link: "SumB" }]
        ]), 5
    ]);

    expect(() => Parser.parse("R0 := Sum1(R1, R2)")).toThrow(ParseError);
})