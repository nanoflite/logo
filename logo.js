const fs = require('fs')
const path = require('path')
const parser = require('./logo_parser').parser
const interpret = require('./logo_interpreter2')
const Turtle = require("./turtle")

const logger = process.env.hasOwnProperty('LOGO_DEBUG') ? console.log : null

const turtle = new Turtle(500, 500)
const effectors = [ turtle.effector.bind(turtle) ]
// const interpreter = new LogoInterpreter(effectors, logger)

const name = process.argv[2]
const script = fs.readFileSync(name, { encoding: 'utf8' })
const ast = parser.parse(script)
// interpreter.execute(ast)
interpret(ast)