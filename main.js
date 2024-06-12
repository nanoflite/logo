const parser = require('./logo_parser')
const { LogoInterpreter } = require('./logo_interpreter')
const Turtle = require("./turtle");

const spiral = `
 TO SPIRAL :N
    IF :N < 1 [ STOP ]
    FORWARD :N
    RIGHTTURN 20
    SPIRAL :N * 0.97
 END
 PENDOWN
 SPIRAL 50
`

const expr = `
:A := 10
:B := :A * 3
SHOW :A :B
`
const repeat = `
:I := 1
REPEAT 10 [
    :I := :I + 1
    SHOW :I
]
`

const proc = `
TO SQUARE :N
    REPEAT 4 [ FORWARD :N RIGHTTURN 90 ]
END
SQUARE 100
`
const squares = `
TO SQUARE :N
    REPEAT 4 [ FORWARD :N RIGHTTURN 90 ]
END
PENDOWN
REPEAT 10 [
    SQUARE 100
    RIGHTTURN 36
]
PENUP
`
const steps = []
function kb(action, prev, state) {
    steps.push({action, prev, state})
}

const turtle = new Turtle(500, 500)

const effectors = [ kb, turtle.effector.bind(turtle) ]

const ast = parser.parse(spiral)
const interpreter = new LogoInterpreter(effectors, console.log)
interpreter.execute(ast)

// console.log(steps)

turtle.save(`spiral.png`)