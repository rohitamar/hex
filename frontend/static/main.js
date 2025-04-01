"use strict";
import { HexagonGrid } from './draw.js';

class GameEvent {
    constructor(path, baseX, baseY, roomId = null) {
        this.hexagonGrid = new HexagonGrid(baseX, baseY);
        this.hexagonGrid.drawAll('white');
        
        this.path = path;
        this.player = true;

        if(this.roomId != 'mcts' || this.roomId != 'minimax') {
            this.socket = new WebSocket(`wss://87be-128-6-147-4.ngrok-free.app/ws/${roomId}`);
            this.roomId = roomId;

            this.initializeWebSocket();
            this.initializeEventForFriend();
        } else {
            this.initializeEventForComp();
        }
    }

    initializeWebSocket() {
        if(!this.socket) return;

        // this.socket.onopen = (e) => {
        //     console.log('Websocket conn');    
        // };

        this.socket.onmessage = (e) => {
            let data = JSON.parse(e.data);
            if(data.message == 'wait') {
                document.querySelector('.turnTitle').innerHTML = "Waiting for the other player";
            } else if(data.message == '1') {
                document.querySelector('.turnTitle').innerHTML = "Your turn";
                this.player = true;
                this.color = 'red';
            } else if(data.message == '2') {
                document.querySelector('.turnTitle').innerHTML = "Their turn";
                this.player = false;
                this.color = 'blue';
            } else if(data.message == 'testing a message') {
                var cd = data.coord;
                console.log(cd);
                this.player = !this.player;
                this.hexagonGrid.colorByGrid(cd[0], cd[1], this.color == 'red' ? 'blue' : 'red');
                document.querySelector('.turnTitle').innerHTML = "Your turn";
            } else {
                setTimeout(() => {
                    alert(data.message);
                    this.hexagonGrid.drawAll('white');
                    window.location.href = window.location.origin;
                }, 100); 
            }
        };

    }

    initializeEventForFriend() {
        $('#myCanvas').on('click', async (e) => {
            if(!this.player) {
                alert("It's their turn.");
                return;
            }

            if(!this.handleMouseClick2(e)) {
                alert("Square already clicked. Try again.");
                return;
            }

            this.player = !this.player;
            document.querySelector('.turnTitle').innerHTML = "Their turn";
        });
    }

    initializeEventForComp() {
        $('#myCanvas').on('click', async (e) => {
            if(!this.player) {
                alert("It's the computer's turn.");
                return;
            }

            if(!this.handleMouseClick(e)) {
                alert("Square already clicked. Try again.");
                return;
            }

            var result = await this.checkIfEndGame();
            if(result != 0) {
                setTimeout(() => {
                    alert(`${result.toString()} won!`);
                    this.hexagonGrid.drawAll('white');
                    window.location.href = window.location.origin;
                }, 100);    
            }

            document.querySelector('.turnTitle').innerHTML = "Computer's turn";
            this.player = false;
            const [posx, posy] = await this.algo(this.mode);
            this.hexagonGrid.colorOnCenter(this.hexagonGrid.getGridCoord(posx, posy), 'blue');
            result = await this.checkIfEndGame();
            if(result != 0) {
                setTimeout(() => {
                    if(result == -1) {
                        alert('You won!');
                    } else {
                        alert('Computer won :(');
                    }
                }, 100);    
            } else {
                document.querySelector('.turnTitle').innerHTML = "Your turn";
                this.player = true;
            }
        });
    }

    handleMouseClick(e) {
        const co = $("#myCanvas").offset();
        if (!co) {
            throw new Error("Canvas object is null"); 
        }
        const coord = this.hexagonGrid.findWhichHexagon(e.clientX - co.left, e.clientY - co.top);

        if(!coord) {
            return false;
        }

        this.hexagonGrid.colorOnCenter(coord, 'red');
        return true;
    }

    handleMouseClick2(e) {
        const co = $("#myCanvas").offset();
        if (!co) {
            throw new Error("Canvas object is null"); 
        }
        console.log("window: ", window.scrollX, window.scrollY);
        const coord = this.hexagonGrid.findWhichHexagon(e.clientX - co.left + window.scrollX, e.clientY - co.top + window.scrollY);
        console.log("i think coord: ", coord);
        if(!coord) {
            return false;
        }
        console.log(this.hexagonGrid.getGridCoordByCenter(coord));
        this.hexagonGrid.colorOnCenter(coord, this.color);
        const gridString = this.hexagonGrid.toString();

        this.socket.send(JSON.stringify({
            coord: this.hexagonGrid.getGridCoordByCenter(coord),
            grid: gridString,
            message: "testing a message"
        }));
        return true;
    }
    
    async algo(type) {
        try {
            const gridString = this.hexagonGrid.toString();
            const response = await fetch(`${this.path}/makeMove?grid=${encodeURIComponent(gridString)}&alg=${type}`);
            const data = await response.json();
            return data.pair;
        } catch (error) {
            console.error('Error fetching random pair:', error);
            return [0, 0];
        }
    }

    async checkIfEndGame() {
        try {
            const gridString = this.hexagonGrid.toString();
            const response = await fetch(`${this.path}/endgame?grid=${encodeURIComponent(gridString)}`);
            const data = await response.json();
            return data.end_state
        } catch (error) {
            console.error('Error fetching random pair:', error);
        }
    }
}

function setupCanvasSize() {
    const canvas = document.getElementById('myCanvas');

    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;

    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';

    return [canvas.width, canvas.height];
}

(async () => {
    try {
        const data = await fetch('/static/config.json')
                                .then(res => res.json());
        let path = data.TYPE === 'DEV' ? data.DEV : data.PROD;
        const [w, h] = setupCanvasSize();

        $(document).ready(() => {
            console.log(roomID);
            const w = window.innerWidth;
            const h = window.innerHeight;
            if(roomID == 'minimax' || roomID == 'mcts') {
                let game = new GameEvent(path, 0.17 * w, 0.08 * h);
            } else {
                let game = new GameEvent(path, 0.17 * w, 0.08 * h, roomID);
            }
        });
    } catch (error) {
        console.error("Error fetching environment:", error);
    }
})();