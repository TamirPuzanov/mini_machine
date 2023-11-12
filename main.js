const textarea = document.getElementById('textarea');
const textDiv = document.getElementById('text');

const numbers = document.getElementById('numbers');
const code = document.getElementById('code');

const run_btn = document.getElementById('run-btn');
const r_list = document.getElementById('r-list');
const r_line = document.getElementById('r-line');

const log = document.getElementById('log-out');

var n_count = 1;


const highlighterRules = [
    {class: "operator", filter: /if|=|\<|\>|\+/g},
    {class: "key_word", filter: /goto|inc|dec/g},
    {class: "reg", filter: /R\d+/g},
];

const langRule = [
    {type: "inc", filter: /^\s*inc\s?R[0-9]+\s*$/i},
    {type: "dec", filter: /^\s*dec\s?R[0-9]+\s*$/i},
    {type: "if", filter: /^\s*if\s+R[0-9]+\s+=\s+0\s+goto\s+[0-9]+\s*$/i},
    {type: "goto", filter: /^\s*goto\s+[0-9]+\s*$/},
    {type: "=R", filter: /^\s*R[0-9]\s+:=\s+R[0-9]+\s*$/},
    {type: "=d", filter: /^\s*R[0-9]\s+:=\s+[0-9]+\s*$/},
    {type: "s", filter: /^\s*$/}
];

const highlighter = function (input, output) {
    let text = input.value;

    for (let i of highlighterRules) {
        text = text.replaceAll(i.filter, `<span class="${i.class}">$&</span>`);
    }

    text = text.replaceAll("\n", "<br>");

    output.innerHTML = text;
};

const adaptive = function () {
    textDiv.style.width = (25 + textarea.scrollWidth) + "px";
    textDiv.style.height = (25 + textarea.scrollHeight) + "px";

    textarea.style.width = "1px";
    textarea.style.width = (25 + textarea.scrollWidth) + "px";

    textarea.style.height = "1px";
    textarea.style.height = (25 + textarea.scrollHeight) + "px";

    code.style.width = (35 + textarea.scrollWidth) + "px";
};

const numerize = function (n) {
    if (n == n_count) { return; }

    let r = "";

    n_count = n;

    for (let i = 0; i < n + 1; i++) {
        r += "<p>" + i + ":</p>";
    }

    numbers.innerHTML = r;
}


const code_exec = function (commands, max_steps) {
    let r = getRegValues(), t = 0, h = commands.length;
    let reg = getReg(), cmd;

    // console.log(commands);


    for (let i = 0; i < max_steps; i++) {
        if (t >= h) { return; }

        cmd = commands[t];

        if (!(cmd[1] in r)) { r[cmd[1]] = 0; }

        if (cmd[0] == 0) {
            r[cmd[1]] += 1;

            if (cmd[1] in reg) {
                reg[cmd[1]].innerText = r[cmd[1]];
            }

            t += 1;
        } else if (cmd[0] == 1) {
            r[cmd[1]] -= 1;

            if (r[cmd[1]] < 0) { r[cmd[1]] = 0; };

            if (cmd[1] in reg) {
                reg[cmd[1]].innerText = r[cmd[1]];
            }

            t += 1;
        } else if (cmd[0] == 2) {
            if (r[cmd[1]] == 0) {
                t = cmd[2];
            } else {
                t += 1;
            }
        } else if (cmd[0] == 3) {
            t = cmd[1];
        } else if (cmd[0] == 4) {
            if (!(cmd[2] in r)) { r[cmd[2]] = 0; }

            r[cmd[1]] = r[cmd[2]];

            if (cmd[1] in reg) {
                reg[cmd[1]].innerText = r[cmd[1]];
            }

            t += 1;
        } else if (cmd[0] == 5) {
            r[cmd[1]] = cmd[2];

            if (cmd[1] in reg) {
                reg[cmd[1]].innerText = r[cmd[1]];
            }

            t += 1;
        } else if (cmd[0] == 6) {
            t += 1;
        } else {
            console.log("Error");
            return;
        }
    }

    log.innerText = "Программа выполнила более " + max_steps + " шагов";
    log.style.display = "block";
}

const getReg = function () {
    let r = [];

    for (let i = 0; i < r_line.children.length; i++) {
        k = r_line.children[i].getElementsByClassName("input")[0];
        if (k == undefined) {continue; };

        r[k.getAttribute("r")] = k;   
    }

    return r;
}

const updateReg = function () {
    let r = r_list.value.match(/[0-9]+/g);

    if (r != null) {
        r = r.map((v, n, a) => {return parseInt(v);});
    } else {
        r = [];
    }

    r = new Set(r);
    r.delete(0); r.delete(1);
    r.delete(2);

    r = Array.from(r);

    r.sort((a, b) => {
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
    });

    let line = `<div class="R"><p>R0</p><span r="0" id="input" class="input" role="textbox" contenteditable>0</span></div>
    <div class="R"><p>R1</p><span r="1" id="input" class="input" role="textbox" contenteditable>0</span></div>
    <div class="R"><p>R2</p><span r="2" id="input" class="input" role="textbox" contenteditable>0</span></div>`;

    let k = 2;

    for (let i = 0; i < r.length; i++) {
        if (r[i] - k > 1) {
            line += "<div class='t'>...</div>";
        }

        line += "<div class=\"R\"><p>R" + r[i] + "</p><span r=\"" + r[i] + "\" "
        line += "id=\"input\" class=\"input\" role=\"textbox\" contenteditable>0</span></div>";

        k = r[i];
    }

    r_line.innerHTML = line;
}

const getRegValues = function () {
    let r = {}, k;

    for (let i = 0; i < r_line.children.length; i++) {
        k = r_line.children[i].getElementsByClassName("input")[0];

        if (k == undefined) {continue; };
        r[k.getAttribute("r")] = parseInt(k.innerText);    
    }

    return r;
}


textarea.addEventListener("input", () => {
    adaptive();

    highlighter(textarea, textDiv);
    numerize(textarea.value.split(/\n/).length - 1);
});

run_btn.addEventListener("click", () => {
    log.innerText = "";
    log.style.display = "none";

    let prog = textarea.value.split(/\n/);
    let commands = [], command = "", c=[];

    for (let i = 0; i < prog.length; i++) {
        command = prog[i];

        if (langRule[0].filter.test(command)) {
            commands.push([0, parseInt(command.match(/[0-9]+/g)[0])]); // inc
        } else if (langRule[1].filter.test(command)) {
            commands.push([1, parseInt(command.match(/[0-9]+/g)[0])]); // dec
        } else if (langRule[2].filter.test(command)) {
            c = command.match(/[0-9]+/g);
            commands.push([2, parseInt(c[0]), parseInt(c[2])]); // if
        } else if (langRule[3].filter.test(command)) {
            commands.push([3, parseInt(command.match(/[0-9]+/g)[0])]); // goto
        } else if (langRule[4].filter.test(command)) {
            c = command.match(/[0-9]+/g);
            commands.push([4, parseInt(c[0]), parseInt(c[1])]); // =R
        } else if (langRule[5].filter.test(command)) {
            c = command.match(/[0-9]+/g);
            commands.push([5, parseInt(c[0]), parseInt(c[1])]); // =d
        } else if (langRule[6].filter.test(command)) {
            commands.push([6]);
        } else {
            console.log("Wrong input! Line - " + i);

            log.innerText = "Команда в строке " + i + " не распознана";
            log.style.display = "block";

            return;
        }
    }

    code_exec(commands, 5_000_000);
});

r_list.addEventListener("input", () => {
    updateReg();
});

window.onload = adaptive;
updateReg();

{
    textarea.value = `R0 := R1
if R2 = 0 goto 5
inc R0
dec R2
goto 1
R1 := 0`;

    adaptive();

    highlighter(textarea, textDiv);
    numerize(textarea.value.split(/\n/).length - 1);

    let r = getReg();

    r[1].innerText = 5;
    r[2].innerText = 3;
}
