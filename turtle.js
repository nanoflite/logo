const fs = require('fs')
const { createCanvas } = require('canvas')

class Turtle {

    constructor(width, height) {
        this.canvas = createCanvas(width, height)
        this.context = this.canvas.getContext("2d")
        this.pendown = false
        this.color = '#1b1b1b'
        this.backgroundColor = '#b1b1b1'
        this.context.fillStyle = this.backgroundColor
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    save(filename) {
        const buffer = this.canvas.toBuffer("image/png");
        fs.writeFileSync(filename, buffer)
    }

    effector(action, prev, state) {
        switch(action[0]) {
            case 'PD':
                this.pendown = true
                break;
            case 'PU':
                this.pendown = false
                break;
            case 'FD':
            case 'BK':
                if (this.pendown) {
                    const [x1, y1, x2, y2] = [prev.x, prev.y, state.x, state.y]
                    this.line(x1, y1, x2, y2)
                }
                break;
        }
    }

    line(x1, y1, x2, y2) {
        console.log(x1, y1, x2, y2)
        const ctx = this.context
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = this.color
        ctx.stroke()
    }

}

module.exports = Turtle