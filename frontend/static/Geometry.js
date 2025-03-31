export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    hash() {
        return `Point(${this.x},${this.y})`;
    }
}

export class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    onLine(p) {
        return p.x <= Math.min(this.p1.x, this.p2.x) && p.y <= Math.min(this.p1.y, this.p2.y);
    }
}

export class GeoUtils {
    static direction(a, b, c) {
        let cross_product = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
        if (cross_product === 0)
            return 0; // collinear
        else if (cross_product < 0)
            return 2; // clockwise turn 
        else
            return 1; // counterclockwise turn 
    }
    static intersect(l1, l2) {
        let dir1 = GeoUtils.direction(l1.p1, l1.p2, l2.p1);
        let dir2 = GeoUtils.direction(l1.p1, l1.p2, l2.p2);
        let dir3 = GeoUtils.direction(l2.p1, l2.p2, l1.p1);
        let dir4 = GeoUtils.direction(l2.p1, l2.p2, l1.p2);
        if (dir1 !== dir2 && dir3 !== dir4)
            return true;
        if (dir1 === 0 && l1.onLine(l2.p1))
            return true;
        if (dir2 === 0 && l1.onLine(l2.p2))
            return true;
        if (dir3 === 0 && l2.onLine(l1.p1))
            return true;
        if (dir4 === 0 && l2.onLine(l1.p2))
            return true;
        return false;
    }
    static checkInside(poly, p) {
        let tmp = new Point(500000, p.y);
        let exline = new Line(p, tmp);
        let count = 0;
        let i = 0;
        do {
            let side = new Line(poly[i], poly[(i + 1) % 6]);
            if (GeoUtils.intersect(side, exline)) {
                if (GeoUtils.direction(side.p1, p, side.p2) == 0)
                    return side.onLine(p);
                count++;
            }
            i = (i + 1) % 6;
        } while (i != 0);
        return count % 2 == 1;
    }
}

