const fs = require('fs')
const path = require('path')
const parser = require('./logo_parser').parser
const { LogoInterpreter } = require('./logo_interpreter')
const Turtle = require("./turtle")

const turtle = new Turtle(500, 500)
const effectors = [ turtle.effector.bind(turtle) ]
const interpreter = new LogoInterpreter(effectors)

const name = process.argv[2]
const script = fs.readFileSync(name, { encoding: 'utf8' })
const ast = parser.parse(script)
interpreter.execute(ast)
const p = path.parse(name)
delete p.base
p.ext = 'png'
const out = path.format(p)
turtle.save(out)