enum CommandType {
    Inc,  // increase register value
    Dec,  // decrease register value
    RsR,  // Rk := Rm
    RsV,  // Rk := m
    Goto, // goto k
    If,   // if Rk = 0 goto m
    Fn,   // Rk := Fn(Rm,...,Rt)
}


interface Command {
    type: CommandType,
    args: number[],
    link: string | null
}

type CommandList = Map<number, Command>;

export { CommandType, Command, CommandList };