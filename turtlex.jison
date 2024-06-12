/* lexical grammar */
%lex

%%
\s+                                /* skip whitespace */
"FORWARD"\s+([0-9]+)               return ['FORWARD', parseInt(yytext.split("FORWARD")[1])]
"BACKWARD"\s+([0-9]+)              return ['BACKWARD', parseInt(yytext.split("BACKWARD")[1])]
"RIGHTTURN"\s+([0-9]+)             return ['RIGHTTURN', parseInt(yytext.split("RIGHTTURN")[1])]
"LEFTTURN"\s+([0-9]+)              return ['LEFTTURN', parseInt(yytext.split("LEFTTURN")[1])]
"PENDOWN"                          return 'PENDOWN'
"PENUP"                            return 'PENUP'
"REPEAT"\s+([0-9]+)                return ['REPEAT', parseInt(yytext.split("REPEAT")[1])]
"TO"\s+([a-zA-Z][a-zA-Z0-9]*)      return ['TO', yytext.split("TO")[1].trim()]
"["                                return '['
"]"                                return ']'
<<EOF>>                            return 'EOF'

/lex

%start Program

%% /* language grammar */

Program
  : Commands 'EOF'                 {$$ = $1}
  ;

Commands
  : Command                        {$$ = [$1]}
  | Commands Command               {$$ = $1.concat([$2])}
  ;

Command
  : FORWARD                        {$$ = {type: 'FORWARD', value: $1[1]}}
  | BACKWARD                       {$$ = {type: 'BACKWARD', value: $1[1]}}
  | RIGHTTURN                      {$$ = {type: 'RIGHTTURN', value: $1[1]}}
  | LEFTTURN                       {$$ = {type: 'LEFTTURN', value: $1[1]}}
  | PENDOWN                        {$$ = {type: 'PENDOWN'}}
  | PENUP                          {$$ = {type: 'PENUP'}}
  | Repeat                         {$$ = $1}
  | Subroutine                     {$$ = $1}
  ;

Repeat
  : REPEAT '[' Commands ']'        {$$ = {type: 'REPEAT', count: $1[1], commands: $3}}
  ;

Subroutine
  : TO '[' Commands ']'            {$$ = {type: 'SUBROUTINE', name: $1[1], commands: $3}}
  ;

%%