"use strict";
import { HexagonGrid } from './draw.js';

class GameEvent {
    constructor(path, baseX, baseY) {
        this.hexagonGrid = new HexagonGrid(baseX, baseY);
        this.hexagonGrid.drawAll('white');
        this.initializeEventListeners();
        this.path = path;
        this.player = true;
    }

    initializeEventListeners() {
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
                    window.location.reload();
                }, 100);    
            }

            document.querySelector('.turnTitle').innerHTML = "Computer's turn";
            this.player = false;
            const [posx, posy] = await this.algo('mcts');
            this.hexagonGrid.colorOnCenter(this.hexagonGrid.getGridCoord(posx, posy), 'blue');
            result = await this.checkIfEndGame();
            if(result != 0) {
                setTimeout(() => {
                    if(result == -1) {
                        alert('You won!');
                    } else {
                        alsert('Computer won :(');
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
        const data = await fetch('../config.json')
                                .then(res => res.json());
        let path = data.TYPE === 'DEV' ? data.DEV : data.PROD;
        const [w, h] = setupCanvasSize();
        // window.addEventListener('resize', setupCanvasSize);

        $(document).ready(() => {
            const game = new GameEvent(path, 0.17 * w, 0.08 * h);
        });
    } catch (error) {
        console.error("Error fetching environment:", error);
    }
})();