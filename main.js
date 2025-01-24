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
    if (p.x <= Math.max(l1.p1.x, l1.p2.x) && p.x <= Math.min(l1.p1.x, l1.p2.x) && (p.y <= Math.max(l1.p1.y, l1.p2.y) && p.y <= Math.min(l1.p1.y, l1.p2.y)))
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

function colorOnCenter(coord) {
    hexagons[coord.hash()].color = turn ? 'red' : 'blue';
    drawHexagon(coord.x, coord.y, len, turn ? 'red' : 'blue');
    turn = !turn;
}

function handleMouseClick(e) {
    var co = $("#myCanvas").offset();

    for(const coord of centerCoords) {
        poly = hexagons[coord.hash()].points;
        if(checkInside(poly, new Point(e.clientX - co.left, e.clientY - co.top))) {
            if(hexagons[coord.hash()].color == 'white') colorOnCenter(coord)
            else return false;
        }
    }
    return true;
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

    if(centerCoords.length != rows * cols) {
        p0 = new Point(a, b);
        let tmp = {
            color: 'white',
            points: [p1, p2, p3, p4, p5, p6]
        };
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

baseX = 210
baseY = 74
len = 44
rows = 11
cols = 11
turn = true;

const grid = new Array(rows);

function drawAll(val) {
    for(let j = 0; j < rows; j++) {
        grid[j] = new Array(cols);
        for(let i = 0; i < cols; i++) {
            a = baseX + len * (j + 2 * i)
            b = baseY + len * j * Math.sqrt(3)
            grid[j][i] = new Point(a, b);
            drawHexagon(a, b, len, val);   
        }
    }
}

function check(x, y) {
    return x >= 0 && x < rows && y >= 0 && y < cols
}

function bfs(src, endCondition, color) {
    var queue = src;
    var visited = new Set([]);
    src.forEach((node) => visited.add(node.toString()));
    const dirs = [
        [1, 0],
        [-1, 0],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [0, 1],
        [0, -1]
    ];
    while (queue.length > 0) {
        const cur = queue.shift();
        if (endCondition(cur)) return true;
        for (const dir of dirs) {
            const coord = [cur[0] + dir[0], cur[1] + dir[1]];
            if(!check(coord[0], coord[1])) continue;
            var coordColor = hexagons[grid[coord[0]][coord[1]].hash()].color;
            if(!visited.has(coord.toString()) && coordColor == color) {
                queue.push(coord);
                visited.add(coord.toString());
            }
        }
    }
    return false;
}

function checkA(x, y, color) {
    return x >= 0 && x < rows && y >= 0 && y < cols && (hexagons[grid[x][y].hash()].color == color || hexagons[grid[x][y].hash()].color == 'white');
}

function countRemaining(color) {
    var queue = [];
    var dist = new Array(rows);
    for(let i = 0; i < rows; i++) dist[i] = new Array(cols).fill(Infinity);

    if(color == 'red') {
        for(let i = 0; i < cols; i++) {
            var col = hexagons[grid[0][i].hash()].color;
            if(col == 'red') {
                queue.unshift([0, i]);
                dist[0][i] = 0;
            } else {
                queue.push([0, i]);
                dist[0][i] = 1;
            }
        }
    } else {
        for(let i = 0; i < rows; i++) {
            var col = hexagons[grid[i][0].hash()].color;
            if(col == 'blue') {
                queue.unshift([i, 0]);
                dist[i][0] = 0;
            } else {
                queue.push([i, 0]);
                dist[i][0] = 1;
            }        
        }
    }
    
    const dirs = [
        [1, 0],
        [-1, 0],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [0, 1],
        [0, -1]
    ];

    while (queue.length > 0) {
        const cur = queue.shift();
        for(const dir of dirs) {
            const coord = [cur[0] + dir[0], cur[1] + dir[1]];
            if(!checkA(coord[0], coord[1], color)) continue;
            var neighColor = hexagons[grid[coord[0]][coord[1]].hash()].color;
            var weight = neighColor == color ? 0 : 1;
            if(dist[cur[0]][cur[1]] + weight < dist[coord[0]][coord[1]]) {
                dist[coord[0]][coord[1]] = dist[cur[0]][cur[1]] + weight;
                if(weight == 1) {
                    queue.push(coord);
                } else {
                    queue.unshift(coord);
                }
            }
        }
    }

    var min = Infinity;
    if(color == 'red') {
        for(let i = 0; i < cols; i++) {
            min = Math.min(min, dist[rows - 1][i]);
        }
    } else {
        for(let i = 0; i < rows; i++) {
            min = Math.min(min, dist[i][cols - 1]);
        }
    }

    return min;
}

function checkIfEndGame() {
    var srcRed = []
    for(let i = 0; i < cols; i++) {
        if(hexagons[grid[0][i].hash()].color == 'red') srcRed.push([0, i]);
    }

    var srcBlue = []
    for(let i = 0; i < rows; i++) {
        if(hexagons[grid[i][0].hash()].color == 'blue') srcBlue.push([i, 0]);
    }

    var player1 = bfs(srcRed, function endCondition(current) {
        return current[0] == rows - 1;
    }, 'red');

    var player2 = bfs(srcBlue, function endCondition(current) {
        return current[1] == cols - 1;
    }, 'blue');

    return player1 ? 1 : (player2 ? 2 : -1);
}

//red wants to minimize (human)
//blue wants to maximize (computer)
function getHeuristic() {
    return countRemaining("red") - countRemaining("blue");
}

//player is actually the computer
function minimax(depth, player) {
    if(depth == 0) {
        heur = getHeuristic();
        return [-1, -1, heur];
    }
    var ans = player ? -Infinity : Infinity;
    var posX, posY;
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            if(hexagons[grid[i][j].hash()].color == 'white') {
                hexagons[grid[i][j].hash()].color = player ? 'blue' : 'red';
                const [x, y, heur] = minimax(depth - 1, !player);
                if((player && heur > ans) || (!player && heur < ans)) {
                    posX = i, posY = j, ans = heur;
                }
                hexagons[grid[i][j].hash()].color = 'white';
            }
        }
    }
    return [posX, posY, ans];
}

function reset() {
    drawAll('white');
}

$('#myCanvas').click(function(e) {
    if(!handleMouseClick(e)) {
        alert("Square already clicked. Try again.");
        return;
    }
    const [posX, posY, ans] = minimax(2, true);
    colorOnCenter(grid[posX][posY]);
    var result = checkIfEndGame();
    console.log(result);
    if (result != -1) {
        setTimeout(() => {
            alert(result.toString() + ' won!');
            drawAll('white');
            window.location.reload();
        }, 100);
    }

});
drawAll('white');
 