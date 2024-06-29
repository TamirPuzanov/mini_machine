declare enum CommandType {
    Inc = 0,// increase register value
    Dec = 1,// decrease register value
    RsR = 2,// Rk := Rm
    RsV = 3,// Rk := m
    Goto = 4,// goto k
    If = 5,// if Rk = 0 goto m
    Fn = 6
}
interface Command {
    type: CommandType;
    args: number[];
    link: string | null;
}
type CommandList = Map<number, Command>;
export { CommandType, Command, CommandList };
//# sourceMappingURL=Command.d.ts.map