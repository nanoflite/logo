const jison = require("jison");

const bnf = {
    "lex": {
        "rules": [
           ["\\s+",      ""],
           ["[0-9]+",    "return 'NUMBER';"],
           ["$",         "return 'EOF';"]
        ]
    },
    "bnf": {
        "expressions" :[
            ["e EOF", "return $1;"]
        ],

        "e": [
            ["NUMBER", "$$ = {type: 'Number', value: Number(yytext)};"]
        ]
    }
};

let parser = new jison.Parser(bnf);
let ast = parser.parse('123');
console.log(ast);  // { type: 'Number', value: 123 }