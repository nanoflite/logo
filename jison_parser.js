const jison = require("jison");
const parser = new jison.Parser(`
%lex
%%
\\s*        /* skip */
[0-9]+      return 'NUMBER'
.           return 'INVALID'
<<EOF>>     return 'EOF'
/lex
%start script
%%
script
    : number 'EOF'          {$$ = $1;}
    ;
number
    : 'NUMBER'              {$$ = $1;}
    ;
%%
`);
console.log(parser.parse("100\n"));