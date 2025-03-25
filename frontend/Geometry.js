class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    hash() {
        return `Point(${this.x},${this.y})`;
    }
}

class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    onLine(p) {
        
        return p.x <= Math.max(this.p1.x, this.p2.x)
    }
}