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
        "statement"  : [ "assign", "PENUP", "PENDOWN", "forward", "backward", "rightturn", "leftturn", "repeat", "to", "proc", "if", "STOP" ],

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
        "assign"     : [["VARIABLE := e", "$$ = {statement: 'ASSIGN', variable: $1, expression: $3}"]],
        "forward"    : [[ "FORWARD argument", "$$ = { statement: 'FORWARD', args: [$2]}" ]],
        "backward"    : [[ "BACKWARD argument", "$$ = { statement: 'BACKWARD', args: [$2]}" ]],
        "leftturn"    : [[ "LEFTTURN argument", "$$ = { statement: 'LEFTTURN', args: [$2]}" ]],
        "rightturn"    : [[ "RIGHTTURN argument", "$$ = { statement: 'RIGHTTURN', args: [$2]}" ]],
        "repeat"     : [[ "REPEAT argument [ statements ]", "$$ = { statement: 'REPEAT', count: $2, statements: $4}" ]],
        "to"         : [[ "TO name variables statements END", "$$ = { statement: 'TO', name: $2, variables: $3, statements: $4}" ]],
        "proc"       : [[ "NAME e", "$$ = { statement: 'PROC', name: $1, arguments: $2 }"]],
        "if"         : [[ "IF e [ statements ]", "$$ = {statement: 'IF', expression: $2, statements: [$4]}" ]],
    }
}

const parser = new jison.Parser(grammar)

 const spiral = `
 TO SPIRAL :N
    IF :N < 1 [ STOP ]
    FORWARD :N
    RIGHTTURN 20
    SPIRAL :N * 0.97
 END
 SPIRAL 50
`

const square = `
:SIZE := 100
TO SQUARE :LENGTH
    REPEAT 4 [ FORWARD :LENGTH RIGHTTURN 90 ]
END
PENDOWN
SQUARE :SIZE
PENUP
`

try {
    const ast = parser.parse(spiral);
    console.log(JSON.stringify(ast, null, 2));
    console.log("ok")
} catch (err) {
    console.error(err);
}