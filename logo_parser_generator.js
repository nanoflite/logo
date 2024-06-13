const fs = require('fs')
const jison = require('jison')

const grammar = {
    "lex": {
        "rules": [
            ["\\s+", "/* skip whitespace */"],
            [";.*", "/* skip comments */"],
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
            ["<", "return '<'"],
            ["<=", "return '<='"],
            [">", "return '>'"],
            [">=", "return '>='"],
            ["FORWARD\\b", "return 'FD';"],
            ["FD\\b", "return 'FD';"],
            ["BACK\\b", "return 'BK';"],
            ["BK\\b", "return 'BK';"],
            ["RIGHT\\b", "return 'RT';"],
            ["RT\\b", "return 'RT';"],
            ["LEFT\\b", "return 'LT';"],
            ["LT\\b", "return 'LT';"],
            ["PENUP\\b", "return 'PU';"],
            ["PU\\b", "return 'PU';"],
            ["PENDOWN\\b", "return 'PD';"],
            ["PD\\b", "return 'PD';"],
            ["REPEAT\\b", "return 'REPEAT';"],
            ["TO\\b", "return 'TO';"],
            ["END\\b", "return 'END';"],
            ["STOP\\b", "return 'STOP';"],
            ["IF\\b", "return 'IF';"],
            ["SHOW\\b", "return 'SHOW';"],
            ["MAKE\\b", "return 'MAKE'"],
            ["\\[", "return '[';"],
            ["\\]", "return ']';"],
            ["$", "return 'EOF';"],
            [":[A-Z0-9]+", "return 'VARIABLE';"],
            ["\"[A-Z0-9_=:,]+", "return 'VARIABLE_NAME';"],
            ["[A-Z0-9]+", "return 'NAME';"],
        ]
    },
    "operators": [
            ["left", "+", "-"],
            ["left", "*", "/"],
            ["left", "UMINUS"],
            ["left", "=", "<", ">", "<=", ">="]
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
        "argument"  : [
            [ "number", "$$ = {type: 'numeric', value: $1}" ],
            [ "VARIABLE", "$$ = {type: 'variable', value: $1}" ],
            [ "VARIABLE_NAME", "$$ = {type: 'variable_name', value: $1}" ],
        ],
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
        "assign"     : [["MAKE VARIABLE_NAME e", "$$ = {statement: 'ASSIGN', variable: $2, expression: $3}"]],
        "forward"    : [[ "FD argument", "$$ = { statement: 'FD', args: [$2]}" ]],
        "backward"    : [[ "BK argument", "$$ = { statement: 'BK', args: [$2]}" ]],
        "leftturn"    : [[ "LT argument", "$$ = { statement: 'LT', args: [$2]}" ]],
        "rightturn"    : [[ "RT argument", "$$ = { statement: 'RT', args: [$2]}" ]],
        "repeat"     : [[ "REPEAT argument [ statements ]", "$$ = { statement: 'REPEAT', count: $2, statements: $4}" ]],
        "to"         : [[ "TO name variables statements END", "$$ = { statement: 'TO', name: $2, variables: $3, statements: $4}" ]],
        "proc"       : [[ "NAME e_list", "$$ = { statement: 'PROC', name: $1, arguments: $2 }"]],
        "if"         : [[ "IF e [ statements ]", "$$ = {statement: 'IF', expression: $2, statements: $4}" ]],
        "pendown"    : [[ "PD", "$$ = {statement: 'PD'}" ]],
        "penup"    : [[ "PU", "$$ = {statement: 'PU'}" ]],
        "stop"    : [[ "STOP", "$$ = {statement: 'STOP'}" ]],
        "show"    : [[ "SHOW e_list", "$$ = {statement: 'SHOW', expressions: $2 }"]],
    }
}

const parser = new jison.Parser(grammar)
const source = parser.generate()
fs.writeFileSync('./logo_parser.js', source, 'utf8')