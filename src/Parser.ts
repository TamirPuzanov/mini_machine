import { CommandType, Command, CommandList } from "./Command";


class ParseError extends Error {
    constructor(line: number) {
        super("invalid format string in line " + line);
        this.name = "ParseError";
    }
}


type Reducer = (type: CommandType, line: string) => Command;


class Parser {

    protected static reducers: Map<CommandType, Reducer> = new Map([
        [CommandType.Inc,  Parser.standard_reducer],
        [CommandType.Dec,  Parser.standard_reducer],
        [CommandType.RsR,  Parser.standard_reducer],
        [CommandType.RsV,  Parser.standard_reducer],
        [CommandType.Goto, Parser.standard_reducer],
        [CommandType.If,   Parser.conditional_command_reducer],
        [CommandType.Fn,   Parser.function_command_reducer]
    ]);

    protected static templates: Map<CommandType, RegExp> = new Map([
        [CommandType.Inc,  /^\s*inc\s*R(0|[1-9]([0-9]{0,10}))\s*$/i],
        [CommandType.Dec,  /^\s*dec\s*R(0|[1-9]([0-9]{0,10}))\s*$/i],
        [CommandType.RsR,  /^\s*R(0|[1-9]([0-9]{0,10}))\s*:=\s*R(0|[1-9]([0-9]{0,10}))\s*$/i],
        [CommandType.RsV,  /^\s*R(0|[1-9]([0-9]{0,10}))\s*:=\s*(0|[1-9]([0-9]{0,10}))\s*$/i],
        [CommandType.Goto, /^\s*goto\s*(0|[1-9]([0-9]{0,10}))\s*$/i],
        [CommandType.If,   /^\s*if\s*R(0|[1-9]([0-9]{0,10}))\s*=\s*0\s*goto\s*(0|[1-9]([0-9]{0,10}))\s*$/i],
        [CommandType.Fn,   /^\s*R(0|[1-9]([0-9]{0,10}))\s*:=\s*([a-z]+)\s*\(\s*((R(0|[1-9]([0-9]{0,10}))\s*,\s*)*R(0|[1-9]([0-9]{0,10})))?\s*\)\s*$/i]
    ]);

    protected static arg_template: RegExp = /0|[1-9]([0-9]{0,10})/g;

    protected static empty_string_template: RegExp = /^\s*$/;


    static parse(str: string) : [CommandList, number] {

        let lines: string[] = str.split("\n");

        let command_list: CommandList = new Map<number, Command>();

        let current_command: Command;
        let current_command_type: CommandType | null;
        let current_command_reducer: Reducer;

        for (let i = 0; i < lines.length; i++) {

            if (Parser.empty_string_template.test(lines[i])) {
                continue;
            }

            current_command_type = null;

            for (let command_type of Parser.templates.keys()) {
                if (Parser.templates.get(command_type)!.test(lines[i])) {
                    current_command_type = command_type;
                    break;
                }
            }

            if (current_command_type === null) {
                throw new ParseError(i);
            }

            current_command_reducer = Parser.reducers.get(current_command_type) as Reducer;
            current_command = current_command_reducer(current_command_type, lines[i]);

            command_list.set(i, current_command);
        }

        return [command_list, lines.length];
    }

    public static extract_args(str: string) : number[] {

        let parts: string[] | null = str.match(Parser.arg_template);
        let args: number[] = [];

        if (parts !== null) {
            args = parts.map((v: string) => Number(v))
        }

        return args;
    }

    protected static standard_reducer(type: CommandType, line: string) : Command {
        return { type, args: Parser.extract_args(line), link: null }
    }

    protected static conditional_command_reducer(type: CommandType, line: string) : Command {
        let args = Parser.extract_args(line);
        return { type, args: [args[0], args[2]], link: null };
    }

    protected static function_command_reducer(type: CommandType, line: string) : Command {

        let parts = line.match(/([a-z]+[0-9]*)\(/i);
        let link = null;

        if (parts !== null && parts.length >= 2) {
            link = parts[1];
        }

        return { type, link, args: Parser.extract_args(line) };
    }
}


export default Parser;
export { ParseError };