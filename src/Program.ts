import { CommandType, CommandList } from "./Command";
import Parser from "./Parser";


class Program {

    command_list: CommandList;
    length: number;
    links: Set<string>;

    constructor(program_text: string) {

        let [command_list, length] = Parser.parse(program_text);

        this.command_list = command_list;
        this.length = length;

        {
            let links: Set<string> = new Set();

            for (let current_command of command_list.values()) {

                if (current_command.type !== CommandType.Fn) {
                    continue;
                }

                links.add(current_command.link as string);
            }

            this.links = links;
        }
    }


}

export { Program };