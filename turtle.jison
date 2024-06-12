%lex

%%
\s+
[0-9]+\b    return 'NUMBER'
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