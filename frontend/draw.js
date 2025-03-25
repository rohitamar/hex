import { Point, GeoUtils } from './Geometry.js';

export class HexagonGrid {
    constructor() {
        this.baseX = 210;
        this.baseY = 74;
        this.len = 44;
        this.rows = 11;
        this.cols = 11;
        this.grid = [];
        this.centerCoords = [];
        this.hexagons = {};
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
    }

    getRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    drawAll(val) {
        for (let j = 0; j < this.rows; j++) {
            this.grid[j] = new Array(this.cols);
            for (let i = 0; i < this.cols; i++) {
                const a = this.baseX + this.len * (j + 2 * i);
                const b = this.baseY + this.len * j * Math.sqrt(3);
                this.grid[j][i] = new Point(a, b);2
                this.drawHexagon(a, b, this.len, val);
            }
        }
    }

    toString() {
        let s = "[";
        for(let i = 0; i < this.rows; i++) {
            s += "[";
            for(let j = 0; j < this.cols; j++) {
                let color = this.hexagons[this.grid[i][j].hash()].color;
                if(color == 'red') {
                    s += "R";
                } else if(color == 'white') {
                    s += "W"; 
                } else {
                    s += "B";
                }
                if(j != this.cols - 1) s += ",";
            }
            s += "]";
            if(i != this.rows - 1) s += ",";
        }
        s += "]";
        console.log(s);
        return s;
    }

    drawHexagon(a, b, len, val) {
        const p1 = new Point(a - len, b + len * Math.tan(this.getRad(30)));
        const p2 = new Point(a, b + 2 * len * Math.tan(this.getRad(30)));
        const p3 = new Point(a + len, b + len * Math.tan(this.getRad(30)));
        const p4 = new Point(a + len, b - len * Math.tan(this.getRad(30)));
        const p5 = new Point(a, b - 2 * len * Math.tan(this.getRad(30)));
        const p6 = new Point(a - len, b - len * Math.tan(this.getRad(30)));
        if (this.centerCoords.length !== this.rows * this.cols) {
            const p0 = new Point(a, b);
            const hexagon = {
                color: 'white',
                points: [p1, p2, p3, p4, p5, p6]
            };
            this.centerCoords.push(p0);
            this.hexagons[p0.hash()] = hexagon;
        }
        this.ctx.fillStyle = val;
        this.ctx.beginPath();
        this.ctx.moveTo(a - len, b + len * Math.tan(this.getRad(30)));
        this.ctx.lineTo(a, b + 2 * len * Math.tan(this.getRad(30)));
        this.ctx.lineTo(a + len, b + len * Math.tan(this.getRad(30)));
        this.ctx.lineTo(a + len, b - len * Math.tan(this.getRad(30)));
        this.ctx.lineTo(a, b - 2 * len * Math.tan(this.getRad(30)));
        this.ctx.lineTo(a - len, b - len * Math.tan(this.getRad(30)));
        this.ctx.lineTo(a - len, b + len * Math.tan(this.getRad(30)));
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();
    }

    findWhichHexagon(posX, posY) {
        const mousePoint = new Point(posX, posY);
        for (const coord of this.centerCoords) {
            const poly = this.hexagons[coord.hash()].points;
            if (GeoUtils.checkInside(poly, mousePoint)) {
                if (this.hexagons[coord.hash()].color === 'white') {
                    return coord;
                }
            }
        }
        return null;
    }
    
    colorOnCenter(coord, color) {
        const hexagon = this.hexagons[coord.hash()];
        hexagon.color = color;
        this.drawHexagon(coord.x, coord.y, this.len, hexagon.color);
    }

    getGrid() {
        return this.grid;
    }

    getGridCoord(i, j) {
        return this.grid[i][j];
    }
}
