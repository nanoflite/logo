const jison = require('jison');
const grammar = `
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
`;

const generator = new jison.Generator(grammar);
const parserSource = generator.generate({moduleType: 'js'});
const parser = new Function('return ' + parserSource)();

const result = parser.parse('100');
console.log(result);