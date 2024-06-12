const fs = require("fs");
const jison = require("jison");
const bnf = fs.readFileSync("turtle.jison", "utf8");
const parser = new jison.Parser(bnf);
module.exports = parser;