function calculateExpression(expr, context) {
    if (expr.type === 'numeric') {
        return expr.value
    } else if (expr.type === 'variable') {
        return context.variables[expr.value]
    } else if (expr.type === 'variable_name') {
        return expr.value.slice(1)
    } else {
        const args = expr.arguments;
        switch (expr.expression) {
            case '/':
                return calculateExpression(args[0], context) / calculateExpression(args[1], context);
            case '*':
                return calculateExpression(args[0], context) * calculateExpression(args[1], context);
            case '+':
                return calculateExpression(args[0], context) + calculateExpression(args[1], context);
            case '-':
                return calculateExpression(args[0], context) - calculateExpression(args[1], context);
            case '=':
                return calculateExpression(args[0], context) === calculateExpression(args[1], context);
            case '<':
                return calculateExpression(args[0], context) < calculateExpression(args[1], context);
            case '>':
                return calculateExpression(args[0], context) > calculateExpression(args[1], context);
            default:
                console.error(`Unknown operation ${expr.expression}`);
                return null;
        }
    }
}

function interpret(ast, effectors = [], context = {
    procedures: {},
    variables: {},
    depth: 0
}) {
    // console.log(`depth: ${context.depth}, :N=${context.variables[':N']}`);
    let stop = false
    let value
    for (let node_i =0; node_i < ast.length; node_i++) {
        if (stop) break
        const node = ast[node_i]
        const stmt = node.statement
        // console.log(stmt)
        // Language specific
        switch (stmt) {
            case 'TO':
                context.procedures[node.name] = {...node}
                break
            case 'PROC':
                const proc = {...context.procedures[node.name]}
                // const thisContext = {...context}
                const thisContext = structuredClone(context)
                for(let i = 0; i < node.arguments.length; i++) {
                    const arg = calculateExpression(node.arguments[i], thisContext)
                    const argName = proc.variables[i]
                    thisContext.variables[argName] = arg
                }
                thisContext.depth++
                interpret(proc.statements, effectors, thisContext)
                break
            case 'ASSIGN':
                context.variables[':'+node.variable.slice(1)] = calculateExpression(node.expression, context)
                break
            case 'IF':
                const cond = calculateExpression(node.expression, context)
                if (cond) {
                    stop = interpret(node.statements, effectors, context)
                }
                break;
            case 'REPEAT':
                const count = calculateExpression(node.count, context)
                for (let i = 0; i < count; i++) {
                    stop = interpret(node.statements, effectors, context)
                    if (stop) {
                        break
                    }
                }
                break
            case 'STOP':
                stop = true
                break
            case 'FD':
            case 'BK':
            case 'RT':
            case 'LT':
                value = calculateExpression(node.args[0], context)
                effect(effectors, stmt, value)
                break;
            case 'PU':
            case 'PD':
                effect(effectors, stmt, null)
                break;
            case 'SHOW':
                const values = node.expressions.map((expr) => calculateExpression(expr, context))
                effect(effectors, stmt, values)
                break
            default:
                console.error(`Unknown operation ${stmt}`)
        }
    }
    return stop
}

function effect(effectors, command, value) {
    effectors.forEach(effect => {
        effect(command, value)
    })
}

module.exports = interpret
