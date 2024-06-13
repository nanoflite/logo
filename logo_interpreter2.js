function expression(expr, context = {}) {
    function _expression(expr) {
        if (expr.type === 'numeric') {
            return expr.value
        }
        if (expr.type === 'variable') {
            return context.variables[expr.value]
        }
        const e = expr.arguments;
        switch (expr.expression) {
            case '*':
                return _expression(e[0]) * _expression(e[1]);
            case '/':
                return _expression(e[0]) / _expression(e[1]);
            case '+':
                return _expression(e[0]) + _expression(e[1]);
            case '-':
                return _expression(e[0]) - _expression(e[1]);
            case '=':
                return _expression(e[0]) === _expression(e[1]);
            case '<':
                return _expression(e[0]) < _expression(e[1]);
            case '>':
                return _expression(e[0]) > _expression(e[1]);
            default:
                console.error(`unknown expression ${expr.expression}`)
        }
    }
    return _expression(expr)
}

function _interpret(ast, context = {}) {
    context.depth++
    console.log(`_interpret ${context.depth}`)

    if (context.depth > 100) {
        console.error("MAX DEPTH")
        return
    }

    let stop = false

    for (let i = 0; i < ast.length; ++i) {
        const next = ast[i]
        const stmt = next.statement
        switch (stmt) {
            case 'TO':
                console.log(`TO ${next.name}`)
                context.procedures[next.name] = next
                break;
            case 'PROC':
                console.log(`CALL PROC ${next.name}`)
                const ctx = Object.assign({}, context)
                delete ctx.procedures
                console.log(`context:\n${JSON.stringify(ctx, null, 2)}`)
                const proc = context.procedures[next.name]
                const variables = proc.variables
                const args = next.arguments
                context.variables = Object.assign({}, context.variables)
                for(let i = 0; i < args.length; i++) {
                    const arg = expression(args[i], context)
                    const argName = variables[i]
                    context.variables[argName] = arg
                }
                stop = _interpret(proc.statements, context)
                if (stop) {
                    return true
                }
                break;
            case 'IF':
                console.log(`IF`)
                const cond = expression(next.expression, context)
                if (cond) {
                    stop = _interpret(next.statements, context)
                    if (stop) {
                        return true
                    }
                }
                break;
            case 'REPEAT':
                console.log(`REPEAT`)
                const count = expression(next.count, context)
                for(let i = 0; i < count; i++) {
                    stop = stop || _interpret(next.statements, context)
                }
                console.log(`--> stop ${stop}`)
                return stop
                break;
            case 'STOP':
                console.log('### STOP ###')
                return true
                break;
            case 'SHOW':
                console.log('SHOW')
                const values = []
                next.expressions.forEach((expr) => {
                    values.push(expression(expr, context));
                });
                console.log(values.join(", "));
                break;
        }
    }
    return false
}

function interpret(ast) {
    const context = {
        depth: 0,
        procedures: {},
        variables: {}
    }
    let stop
    do {
        stop = _interpret(ast, context)
    } while (!stop)
}

module.exports = interpret