const fs = require('fs')
const { createCanvas } = require('canvas')

function turtle(options = {
    width: 500,
    height: 500,
    color: '#1b1b1b',
    backgroundColor: '#b1b1b1',
}) {

    const canvas = createCanvas(options.width, options.height)
    const context = canvas.getContext("2d")
    context.fillStyle = options.backgroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)

    const state = {
        pen: false,
        angle: 0,
        x: canvas.width / 2,
        y: canvas.height / 2
    }

    function line(x1, y1, x2, y2, pen) {
        const ctx = context
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = options.color
        ctx.stroke()
    }

    function save(filename) {
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(filename, buffer)
    }

    function draw(command, value) {
        let x, y
        switch(command) {
            case 'PD':
                state.pen = true
                break
            case 'PU':
                state.pen = false
                break
            case 'FD':
                x = state.x + value * Math.cos(state.angle * Math.PI / 180)
                y = state.y + value * Math.sin(state.angle * Math.PI / 180)
                line(state.x, state.y, x, y, state.pen)
                state.x = x
                state.y = y
                break
            case 'BK':
                x = state.x - value * Math.cos(state.angle * Math.PI / 180)
                y = state.y - value * Math.sin(state.angle * Math.PI / 180)
                line(state.x, state.y, x, y, state.pen)
                state.x = x
                state.y = y
                break
            case 'RT':
                state.angle = (state.angle + value) % 360
                break
            case 'LT':
                state.angle = (state.angle - value) % 360
                break
            case 'SHOW':
                console.log(`${value.join('')}`)
                break
        }
    }

    return { draw, save }

}

module.exports = turtle