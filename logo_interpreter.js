class LogoInterpreter {
    constructor(effectors, logger) {
        this.effectors = effectors || [];
        this.logger = logger;
        this.state = {
            x: 250,
            y: 250,
            angle: 0,
            penDown: false,
            procedures: {}
        };

        this.variables = {}
        this.stack = []
        this.run = false
    }

    log(message) {
        if (this.logger) {
            this.logger(message)
        }
    }

    effect(action, prevState, state) {
        this.effectors.forEach(effector => {
            effector(action, prevState, state);
        })
    }

    push() {
        const variables = Object.assign({}, this.variables)
        this.stack.push(variables)
        this.variables = variables
    }

    pop() {
        this.variables = this.stack.pop()
    }

    stateSnapshot() {
        const state = Object.assign({}, this.state)
        delete state.procedures
        return state
    }

    executeCommand(command) {
        let value, prevState
        if (this.run == false) {
            return
        }
        switch(command.statement) {
            case 'FORWARD':
                value = this.expression(command.args[0])
                this.log(`FORWARD ${value}`);
                prevState = this.stateSnapshot()
                this.state.y += value * Math.sin(this.state.angle * Math.PI / 180);
                this.state.x += value * Math.cos(this.state.angle * Math.PI / 180);
                this.effect(['FD', value], prevState, this.stateSnapshot());
                break;
            case 'BACKWARD':
                value = this.expression(command.args[0])
                this.log(`BACKWARD ${value}`);
                prevState = this.stateSnapshot()
                this.state.y -= value * Math.sin(this.state.angle * Math.PI / 180);
                this.state.x -= value * Math.cos(this.state.angle * Math.PI / 180);
                this.effect(['BK', value], prevState, this.stateSnapshot());
                break;
            case 'RIGHTTURN':
                value = this.expression(command.args[0])
                this.log(`RIGHTTURN ${value}`);
                prevState = this.stateSnapshot()
                this.state.angle += value;
                this.state.angle %= 360
                this.effect(['RT', value], prevState, this.stateSnapshot());
                break;
            case 'LEFTTURN':
                value = this.expression(command.args[0])
                this.log(`LEFTTURN ${value}`);
                prevState = this.stateSnapshot()
                this.state.angle -= value;
                this.state.angle %= 360
                this.effect(['LT', value], prevState, this.stateSnapshot());
                break;
            case 'PENDOWN':
                this.log('PENDOWN');
                prevState = this.stateSnapshot()
                this.state.penDown = true;
                this.effect(['PD', null], prevState, this.stateSnapshot());
                break;
            case 'PENUP':
                this.log('PENUP');
                prevState = this.stateSnapshot()
                this.state.penDown = false;
                this.effect(['PU', null], prevState, this.stateSnapshot());
                break;
            case 'REPEAT':
                this.log('REPEAT');
                const count = this.expression(command.count)
                for(let i = 0; i < count; i++) {
                    command.statements.forEach((statement) => {
                        this.executeCommand(statement)
                    })
                }
                break;
            case 'TO':
                this.log('TO');
                this.state.procedures[command.name] = command;
                break;
            case 'PROC':
                this.log('PROC');
                const proc = this.state.procedures[command.name];
                this.push()
                const args = command.arguments
                const variables = proc.variables
                for(let i = 0; i < args.length; i++) {
                    const arg = this.expression(args[i])
                    const argName = variables[i]
                    this.variables[argName] = arg
                }
                for(let i = 0; i < proc.statements.length; i++) {
                    this.executeCommand(proc.statements[i])
                }
                this.pop()
                break;
            case 'ASSIGN':
                this.log('ASSIGN');
                this.variables[command.variable] = this.expression(command.expression);
                break;
            case 'SHOW':
                this.log('SHOW');
                const values = []
                command.expressions.forEach((expr) => {
                    values.push(this.expression(expr));
                });
                this.log(values.join(", "));
                break;
            case 'IF':
                this.log('IF');
                const expression = this.expression(command.expression);
                if (expression) {
                    command.statements.forEach((statement) => {
                        this.executeCommand(statement)
                    })
                }
                break;
            case 'STOP':
                this.log('STOP');
                this.run = false
                break;
            default:
                this.log("Unknown command: " + command.statement);
        }
    }

    expression(expression) {
        this.log(JSON.stringify(expression));
        if (expression.type === 'numeric') {
            return expression.value
        }
        if (expression.type === 'variable') {
            return this.variables[expression.value]
        }
        const e = expression.arguments;
        switch (expression.expression) {
            case '*':
                return this.expression(e[0]) * this.expression(e[1]);
            case '/':
                return this.expression(e[0]) / this.expression(e[1]);
            case '+':
                return this.expression(e[0]) + this.expression(e[1]);
            case '-':
                return this.expression(e[0]) - this.expression(e[1]);
            case '=':
                return this.expression(e[0]) === this.expression(e[1]);
            case '<':
                return this.expression(e[0]) < this.expression(e[1]);
            case '>':
                return this.expression(e[0]) > this.expression(e[1]);
            default:
                console.error(`unknown expression ${expression.expression}`);
        }
    }

    execute(ast) {
        this.run = true
        for(let i = 0; i < ast.length; i++) {
            this.executeCommand(ast[i]);
            if (this.run === false) {
                this.log("HALTED")
                break;
            }
        }
    }
}

module.exports = { LogoInterpreter }
