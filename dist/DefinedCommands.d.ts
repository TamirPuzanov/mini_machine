import type { Tape } from "./Tape";
type defined_command_fn = (tape: Tape, args: number[]) => number;
type DefinedCommands = Map<string, defined_command_fn>;
export { DefinedCommands, defined_command_fn };
//# sourceMappingURL=DefinedCommands.d.ts.map