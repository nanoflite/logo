const fs = require('fs')
const jison = require('jison')

const grammar = {
    "lex": {
        "rules": [
            ["\\s+", "/* skip whitespace */"],
            ["^;", "/* skip comments */"],
            ["[0-9]+(\\.[0-9]+)?\\b", "return 'NUMBER';"],
            ["\\*", "return '*'"],
            ["\\/", "return '/'"],
            ["-", "return '-'"],
            ["\\+", "return '+'"],
            ["\\^", "return '^'"],
            ["%", "return '%'"],
            ["\\(", "return '('"],
            ["\\)", "return ')'"],
            ["=", "return '='"],
            [":=", "return ':='"],
            ["<", "return '<'"],
            [">", "return '>'"],
            ["FORWARD\\b", "return 'FORWARD';"],
            ["BACKWARD\\b", "return 'BACKWARD';"],
            ["RIGHTTURN\\b", "return 'RIGHTTURN';"],
            ["LEFTTURN\\b", "return 'LEFTTURN';"],
            ["PENUP\\b", "return 'PENUP';"],
            ["PENDOWN\\b", "return 'PENDOWN';"],
            ["REPEAT\\b", "return 'REPEAT';"],
            ["TO\\b", "return 'TO';"],
            ["END\\b", "return 'END';"],
            ["STOP\\b", "return 'STOP';"],
            ["IF\\b", "return 'IF';"],
            ["SHOW\\b", "return 'SHOW';"],
            ["\\[", "return '[';"],
            ["\\]", "return ']';"],
            ["$", "return 'EOF';"],
            [":[A-Z0-9]+", "return 'VARIABLE';"],
            ["[A-Z0-9]+", "return 'NAME';"],
        ]
    },
    "operators": [
            ["left", "+", "-"],
            ["left", "*", "/"],
            ["left", "UMINUS"],
            ["left", "=", "<", ">"]
    ],
    "bnf": {
        "script": [[ "statements EOF", "return $1"]],
        "statements" : [[ "statement statements", "$$ = [$1].concat($2)" ], [ "", "$$ = []" ]],
        "statement"  : [ "assign", "penup", "pendown", "forward", "backward", "rightturn", "leftturn", "repeat", "to", "proc", "if", "stop", "show" ],

        "number"     : [[ "NUMBER", "$$ = Number(yytext)" ]],
        "numbers"    : [[ "", "$$ = []"],[ "number numbers", "$$ = [$1].concat($2)" ]],
        "name"       : [[ "NAME", "$$ = yytext" ]],
        "variables" : [
                        [ "", "$$ = []"],
                        [ "VARIABLE variables", "$$ = [$1].concat($2);"]
        ],
        "argument"  : [[ "number", "$$ = {type: 'numeric', value: $1}" ], ["VARIABLE", "$$ = {type: 'variable', value: $1}" ]],
        "arguments" : [[ "argument arguments", "$$ = [$1].concat($2)" ], [ "", "$$ = []" ]],
        "e" : [
                [ "argument", "$$ = $1" ],
                [ "e + e", "$$ = {expression: '+', arguments: [$1, $3] }"],
                [ "e - e", "$$ = {expression: '-', arguments: [$1, $3] }"],
                [ "e * e", "$$ = {expression: '*', arguments: [$1, $3] }"],
                [ "e / e", "$$ = {expression: '/', arguments: [$1, $3] }"],
                [ "- e",   "$$ = {expression: 'umin', arguments: [$2] }", {"prec": "UMINUS"}],
                ["( e )",  "$$ = $2"],
                [ "e = e", "$$ = {expression: '=', arguments: [$1, $3] }"],
                [ "e < e", "$$ = {expression: '<', arguments: [$1, $3] }"],
                [ "e > e", "$$ = {expression: '>', arguments: [$1, $3] }"]
        ],
        "e_list"     : [[ "", "$$ = []"], [ "e e_list ", "$$ = [$1].concat($2)" ]],
        "assign"     : [["VARIABLE := e", "$$ = {statement: 'ASSIGN', variable: $1, expression: $3}"]],
        "forward"    : [[ "FORWARD argument", "$$ = { statement: 'FORWARD', args: [$2]}" ]],
        "backward"    : [[ "BACKWARD argument", "$$ = { statement: 'BACKWARD', args: [$2]}" ]],
        "leftturn"    : [[ "LEFTTURN argument", "$$ = { statement: 'LEFTTURN', args: [$2]}" ]],
        "rightturn"    : [[ "RIGHTTURN argument", "$$ = { statement: 'RIGHTTURN', args: [$2]}" ]],
        "repeat"     : [[ "REPEAT argument [ statements ]", "$$ = { statement: 'REPEAT', count: $2, statements: $4}" ]],
        "to"         : [[ "TO name variables statements END", "$$ = { statement: 'TO', name: $2, variables: $3, statements: $4}" ]],
        "proc"       : [[ "NAME e_list", "$$ = { statement: 'PROC', name: $1, arguments: $2 }"]],
        "if"         : [[ "IF e [ statements ]", "$$ = {statement: 'IF', expression: $2, statements: $4}" ]],
        "pendown"    : [[ "PENDOWN", "$$ = {statement: 'PENDOWN'}" ]],
        "penup"    : [[ "PENUP", "$$ = {statement: 'PENUP'}" ]],
        "stop"    : [[ "STOP", "$$ = {statement: 'STOP'}" ]],
        "show"    : [[ "SHOW e_list", "$$ = {statement: 'SHOW', expressions: $2 }"]],
    }
}

const parser = new jison.Parser(grammar)
const source = parser.generate()
fs.writeFileSync('./logo_parser.js', source, 'utf8')