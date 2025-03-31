import { Point, GeoUtils } from './Geometry.js';

export class HexagonGrid {
    constructor(baseX, baseY) {
        this.baseX = baseX;
        this.baseY = baseY;
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
                this.grid[j][i] = new Point(a, b);
                this.drawHexagon(a, b, this.len, val, j, i);
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
        return s;
    }

    drawEdge(p1, p2, color, width) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawHexagon(a, b, len, val, i, j) {
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
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        if(j == 0) {
            if(i != this.rows - 1) this.drawEdge(p1, p2, 'blue', 5);
            this.drawEdge(p6, p1, 'blue', 5);
        }

        if(i == 0) {
            this.drawEdge(p4, p5, 'red', 5);
            this.drawEdge(p5, p6, 'red', 5);
        }

        if(j == this.cols - 1) {
            this.drawEdge(p3, p4, 'blue', 5);
            if(i != 0) this.drawEdge(p4, p5, 'blue', 5);
        }

        if(i == this.rows - 1) {
            this.drawEdge(p1, p2, 'red', 5);
            this.drawEdge(p2, p3, 'red', 5);
        }
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
