const jison = require("jison");
const parser = new jison.Parser(`
%lex
%%
\\s+                    /* skip whitespace */
[0-9]+                  return 'NUMBER'
<<EOF>>                 return 'EOF'
/lex
%start expressions
%%
expressions
    : e EOF             {$$ = $e;}
    ;
e   
    : NUMBER            {$$ = {type: 'Number', value: Number(yytext)};}
    ;
%%
`);
const ast = parser.parse("100");
console.log(JSON.stringify(ast, null, 2));