const fs = require('fs')
const path = require('path')

const parser = require('./logo_parser').parser
const interpret = require('./interpret2')
const turtle = require("./turtle2")()

const name = process.argv[2]
const script = fs.readFileSync(name, { encoding: 'utf8' })
const ast = parser.parse(script)
interpret(ast, [ turtle.draw ])

const p = path.parse(name)
delete p.base
p.ext = '.png'
turtle.save(path.format(p))

