// ECMAScript 6
function interpret(ast, context = {
    procedures: {},
    variables: {}
}) {
    let stop;
    ast.forEach(node => {
        if (stop) return;
        const stmt = node.statement;

        switch (stmt) {
            case 'TO':
                context.procedures[node.name] = {...node};
                break;
            case 'PROC':
                const proc = {...context.procedures[node.name]};
                const was = proc.variables.map(v => context.variables[v]);
                const now = node.arguments.map(arg => calculateExpression(arg, context));
                proc.variables.forEach((v, i) => context.variables[v] = now[i]);
                stop = interpret(proc.statements, context) === undefined;
                proc.variables.forEach((v, i) => context.variables[v] = was[i]);
                break;
            case 'IF':
                const cond = calculateExpression(node.expression, context);
                if (cond && interpret(node.statements, context) === undefined) {
                    stop = true;
                }
                break;
            case 'REPEAT':
                const count = calculateExpression(node.count, context);
                for (let i = 0; i < count; i++) {
                    if (interpret(node.statements, context) === undefined) {
                        stop = true;
                        break;
                    }
                }
                break;
            case 'STOP':
                stop = true;
                break;
            case 'SHOW':
                const values = node.expressions.map((expr) => calculateExpression(expr, context));
                console.log(values.join(", "));
                break;
            default:
                console.error(`unknown statement ${stmt}`);
        }
    });
    if (!stop) return true;
}

function calculateExpression(expr, context) {
    if (expr.type === 'numeric') {
        return expr.value;
    } else if (expr.type === 'variable') {
        return context.variables[expr.value.slice(1)];
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
            default:
                console.error(`Unknown operation ${expr.expression}`);
                return null;
        }
    }
}

//// ECMAScript 6
//const interpret = (ast, context = { procedures: {}, variables: {} }) => {
//    return ast.some(node => {
//        const stmt = node.statement;
//        switch (stmt) {
//            case 'TO':
//                context.procedures[node.name] = node;
//                break;
//            case 'PROC':
//                const proc = context.procedures[node.name];
//                const variables = proc.variables;
//                const args = node.arguments;
//                let varContext = { ...context.variables };
//                for (let i = 0; i < args.length; i++) {
//                    const arg = calculateExpression(args[i], context);
//                    const argName = variables[i];
//                    varContext[argName] = arg;
//                }
//                if (interpret(proc.statements, { procedures: context.procedures, variables: varContext })) {
//                    return true;
//                }
//                break;
//            case 'IF':
//                const cond = calculateExpression(node.expression, context);
//                if (cond) {
//                    if (interpret(node.statements, context)) {
//                        return true;
//                    }
//                }
//                break;
//            case 'REPEAT':
//                const count = calculateExpression(node.count, context);
//                for (let i = 0; i < count; i++) {
//                    if (interpret(node.statements, context)) {
//                        return true;
//                    }
//                }
//                break;
//            case 'STOP':
//                return true;
//            case 'SHOW':
//                const values = node.expressions.map((expr) => calculateExpression(expr, context));
//                console.log(values.join(", "));
//                break;
//            default:
//                console.error(`unknown statement ${stmt}`);
//        }
//        return false;
//    });
//};
//
//const calculateExpression = (expr, context) => {
//    if (expr.type === 'numeric') {
//        return expr.value;
//    } else if (expr.type === 'variable') {
//        return context.variables[expr.value.slice(1)];
//    } else {
//        const e = expr.arguments;
//        switch (expr.expression) {
//            case '*':
//                return calculateExpression(e[0], context) * calculateExpression(e[1], context);
//            case '/':
//                return calculateExpression(e[0], context) / calculateExpression(e[1], context);
//            case '+':
//                return calculateExpression(e[0], context) + calculateExpression(e[1], context);
//            case '-':
//                return calculateExpression(e[0], context) - calculateExpression(e[1], context);
//            case '=':
//                return calculateExpression(e[0], context) === calculateExpression(e[1], context);
//            case '<':
//                return calculateExpression(e[0], context) < calculateExpression(e[1], context);
//            case '>':
//                return calculateExpression(e[0], context) > calculateExpression(e[1], context);
//            default:
//                console.error(`Unknown operation ${expr.op}`);
//                return null;
//        }
//    }
//};
//
//
////// ECMAScript 6
////const interpret = (ast, context = { procedures: {}, variables: {} }) => {
////    return ast.some(node => {
////        const stmt = node.statement;
////        switch (stmt) {
////            case 'TO':
////                context.procedures[node.name] = node;
////                return false;
////            case 'PROC':
////                const proc = context.procedures[node.name];
////                const variables = proc.variables;
////                const args = node.arguments;
////                let varContext = { ...context.variables };
////                for (let i = 0; i < args.length; i++) {
////                    const arg = calculateExpression(args[i], context);
////                    varContext[variables[i]] = arg;
////                }
////                for (let iteration = 0; iteration < 2; iteration++) {
////                    if (interpret(proc.statements, { ...context, variables: varContext })) {
////                        return false;
////                    }
////                }
////                break;
////            case 'IF':
////                const cond = calculateExpression(node.expression, context);
////                if (cond) {
////                    return interpret(node.statements, context);
////                }
////                break;
////            case 'REPEAT':
////                const count = calculateExpression(node.count, context);
////                for (let i = 0; i < count; i++) {
////                    if (interpret(node.statements, context)) {
////                        return true;
////                    }
////                }
////                break;
////            case 'STOP':
////                return true;
////            case 'SHOW':
////                const values = node.expressions.map((expr) => calculateExpression(expr, context));
////                console.log(values.join(", "));
////                break;
////            default:
////                console.error(`unknown statement ${stmt}`);
////        }
////        return false;
////    });
////};
////
////const calculateExpression = (expr, context) => {
////    if (expr.type === 'numeric') {
////        return expr.value;
////    } else if (expr.type === 'variable') {
////        return context.variables[expr.value.slice(1)];
////    } else {
////        const e = expr.arguments;
////        switch (expr.expression) {
////            case '*':
////                return calculateExpression(e[0], context) * calculateExpression(e[1], context);
////            case '/':
////                return calculateExpression(e[0], context) / calculateExpression(e[1], context);
////            case '+':
////                return calculateExpression(e[0], context) + calculateExpression(e[1], context);
////            case '-':
////                return calculateExpression(e[0], context) - calculateExpression(e[1], context);
////            case '=':
////                return calculateExpression(e[0], context) === calculateExpression(e[1], context);
////            case '<':
////                return calculateExpression(e[0], context) < calculateExpression(e[1], context);
////            case '>':
////                return calculateExpression(e[0], context) > calculateExpression(e[1], context);
////            default:
////                console.error(`Unknown operation ${expr.op}`);
////                return null;
////        }
////    }
////};
////
////// const interpret = (ast, context = { procedures: {}, variables: {} }) => {
//////     return ast.some(node => {
//////         const stmt = node.statement;
//////         switch (stmt) {
//////             case 'TO':
//////                 context.procedures[node.name] = node;
//////                 break;
//////             case 'PROC':
//////                 const proc = context.procedures[node.name];
//////                 const variables = proc.variables;
//////                 const args = node.arguments;
//////                 let varContext = { ...context.variables };
//////                 for (let i = 0; i < args.length; i++) {
//////                     const arg = calculateExpression(args[i], context);
//////                     const argName = variables[i];
//////                     varContext[argName] = arg;
//////                 }
//////                 return interpret(proc.statements, { ...context, variables: varContext });
//////             case 'IF':
//////                 const cond = calculateExpression(node.expression, context);
//////                 if (cond) {
//////                     return interpret(node.statements, context);
//////                 }
//////                 break;
//////             case 'REPEAT':
//////                 const count = calculateExpression(node.count, context);
//////                 for (let i = 0; i < count; i++) {
//////                     const stop = interpret(node.statements, context);
//////                     if (stop) {
//////                         return true;
//////                     }
//////                 }
//////                 break;
//////             case 'STOP':
//////                 return true;
//////             case 'SHOW':
//////                 const values = node.expressions.map((expr) => calculateExpression(expr, context));;
//////                 console.log(values.join(", "));
//////                 break;
//////             default:
//////                 console.error(`unknown statement ${stmt}`)
//////         }
//////         return false;
//////     });
////// };
//////
////// // const interpret = (ast, context = { procedures: {}, variables: {} }) => {
////// //     return ast.reduce((stop, next) => {
////// //         if (stop) return true;
////// //         const stmt = next.statement;
////// //         switch (stmt) {
////// //             case 'TO':
////// //                 context.procedures[next.name] = next;
////// //                 break;
////// //             case 'PROC':
////// //                 const proc = context.procedures[next.name];
////// //                 const variables = proc.variables;
////// //                 const args = next.arguments;
////// //                 let varContext = { ...context.variables };
////// //                 for (let i = 0; i < args.length; i++) {
////// //                     const arg = calculateExpression(args[i], context);
////// //                     const argName = variables[i];
////// //                     varContext[argName] = arg;
////// //                 }
////// //                 return interpret(proc.statements, { ...context, variables: varContext });
////// //             case 'IF':
////// //                 const cond = calculateExpression(next.expression, context);
////// //                 if (cond) {
////// //                     return interpret(next.statements, context);
////// //                 }
////// //                 break;
////// //             case 'REPEAT':
////// //                 const count = calculateExpression(next.count, context);
////// //                 for (let i = 0; i < count; i++) {
////// //                     stop = interpret(next.statements, context);
////// //                     if (stop) {
////// //                         return true;
////// //                     }
////// //                 }
////// //                 break;
////// //             case 'STOP':
////// //                 return true;
////// //             case 'SHOW':
////// //                 const values = next.expressions.map((expr) => calculateExpression(expr, context));;
////// //                 console.log(values.join(", "));
////// //                 break;
////// //             default:
////// //                 console.error(`unknown statement ${stmt}`)
////// //         }
////// //         return false;
////// //     }, false);
////// // }
//////
////// const calculateExpression = (expr, context) => {
//////     if (expr.type === 'numeric') {
//////         return expr.value;
//////     }
//////     if (expr.type === 'variable') {
//////         return context.variables[expr.value];
//////     }
//////     const e = expr.arguments;
//////     switch (expr.expression) {
//////         case '*':
//////             return calculateExpression(e[0], context) * calculateExpression(e[1], context);
//////         case '/':
//////             return calculateExpression(e[0], context) / calculateExpression(e[1], context);
//////         case '+':
//////             return calculateExpression(e[0], context) + calculateExpression(e[1], context);
//////         case '-':
//////             return calculateExpression(e[0], context) - calculateExpression(e[1], context);
//////         case '=':
//////             return calculateExpression(e[0], context) === calculateExpression(e[1], context);
//////         case '<':
//////             return calculateExpression(e[0], context) < calculateExpression(e[1], context);
//////         case '>':
//////             return calculateExpression(e[0], context) > calculateExpression(e[1], context);
//////         default:
//////             console.error(`unknown expression ${expr.expression}`)
//////     }
////// }

module.exports = interpret