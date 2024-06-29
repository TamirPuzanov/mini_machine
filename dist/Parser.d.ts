import { CommandType, Command, CommandList } from "./Command";
declare class ParseError extends Error {
    constructor(line: number);
}
type Reducer = (type: CommandType, line: string) => Command;
declare class Parser {
    protected static reducers: Map<CommandType, Reducer>;
    protected static templates: Map<CommandType, RegExp>;
    protected static arg_template: RegExp;
    protected static empty_string_template: RegExp;
    static parse(str: string): [CommandList, number];
    static extract_args(str: string): number[];
    protected static standard_reducer(type: CommandType, line: string): Command;
    protected static conditional_command_reducer(type: CommandType, line: string): Command;
    protected static function_command_reducer(type: CommandType, line: string): Command;
}
export default Parser;
export { ParseError };
//# sourceMappingURL=Parser.d.ts.map