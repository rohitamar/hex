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
}

function onLine(l1, p)
{
    if (p.x <= Math.max(l1.p1.x, l1.p2.x) 
        && p.x <= Math.min(l1.p1.x, l1.p2.x) 
        && (p.y <= Math.max(l1.p1.y, l1.p2.y) 
        && p.y <= Math.min(l1.p1.y, l1.p2.y)))
        return true;
    return false;
}

function direction(a, b, c)
{
    let val = (b.y - a.y) * (c.x - b.x)
              - (b.x - a.x) * (c.y - b.y);
 
    if (val == 0)
 
        // Collinear
        return 0;
 
    else if (val < 0)
 
        // Anti-clockwise direction
        return 2;
 
    // Clockwise direction
    return 1;
}

function isIntersect(l1, l2)
{
    let dir1 = direction(l1.p1, l1.p2, l2.p1);
    let dir2 = direction(l1.p1, l1.p2, l2.p2);
    let dir3 = direction(l2.p1, l2.p2, l1.p1);
    let dir4 = direction(l2.p1, l2.p2, l1.p2);
 
    if (dir1 != dir2 && dir3 != dir4)
        return true;
    if (dir1 == 0 && onLine(l1, l2.p1))
        return true;
    if (dir2 == 0 && onLine(l1, l2.p2))
        return true;
    if (dir3 == 0 && onLine(l2, l1.p1))
        return true;
    if (dir4 == 0 && onLine(l2, l1.p2))
        return true;
 
    return false;
}

function checkInside(poly, p)
{
    let tmp = new Point(500000, p.y);
    let exline = new Line( p, tmp );
    let count = 0;
    let i = 0;
    do {
        let side = new Line( poly[i], poly[(i + 1) % 6] );
        if (isIntersect(side, exline)) {
            if (direction(side.p1, p, side.p2) == 0)
                return onLine(side, p);
            count++;
        }
        i = (i + 1) % 6;
    } while (i != 0);
 
    return count % 2 == 1;
}

hexagons = {}
centerCoords = []

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var canvasOffset = $("#myCanvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

function getRad(deg) {
    return (deg * Math.PI) / 180;
}


function handleMouseClick(e) {
    for(const coord of centerCoords) {
        poly = hexagons[coord.hash()].points;
        if(hexagons[coord.hash()].color == 'white' && checkInside(poly, new Point(e.clientX - offsetX, e.clientY - offsetY))) {
            hexagons[coord.hash()].color = turn ? 'red' : 'blue';
            drawHexagon(coord.x, coord.y, 40, turn ? 'red' : 'blue');
            turn = !turn;
            break;
        }
    }
}


//(a, b) is center of hexagon
//len: length of apothem
function drawHexagon(a, b, len, val) {
    p1 = new Point(a - len, b + len * Math.tan(getRad(30)));
    p2 = new Point(a, b + 2 * len * Math.tan(getRad(30)));
    p3 = new Point(a + len, b + len * Math.tan(getRad(30)));
    p4 = new Point(a + len, b - len * Math.tan(getRad(30)));
    p5 = new Point(a, b - 2 * len * Math.tan(getRad(30)));
    p6 = new Point(a - len, b - len * Math.tan(getRad(30)));

    if(centerCoords.length != row * col) {
        let tmp = {
            color: 'white',
            points: [p1, p2, p3, p4, p5, p6]
        };
    
        p0 = new Point(a, b);
        centerCoords.push(p0);
        hexagons[p0.hash()] = tmp;
        
    }
    ctx.fillStyle = val;
    ctx.beginPath(); 
    ctx.moveTo(a - len, b + len * Math.tan(getRad(30)));
    ctx.lineTo(a, b + 2 * len * Math.tan(getRad(30)));
    ctx.lineTo(a + len, b + len * Math.tan(getRad(30)));
    ctx.lineTo(a + len, b - len * Math.tan(getRad(30)));
    ctx.lineTo(a, b - 2 * len * Math.tan(getRad(30)));
    ctx.lineTo(a - len, b - len * Math.tan(getRad(30)));
    ctx.lineTo(a - len, b + len * Math.tan(getRad(30)));
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    
}

baseX = 260
baseY = 140
len = 40
row = 11
col = 11
turn = true;

function drawAll(val) {
    for(let j = 0; j < row; j++) {
        for(let i = 0; i < col; i++) {
            drawHexagon(baseX + len * j + 2 * len * i, baseY + len * j * Math.sqrt(3), len, val);   
        }
    }
}

$('#myCanvas').click(function(e) {
    handleMouseClick(e);
});

drawAll('white');
