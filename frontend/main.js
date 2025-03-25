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
            
            document.querySelector('.turnTitle').innerHTML = "Computer's turn";
            this.player = false;
            const [posX, posY] = await this.randomGenerate();
            this.hexagonGrid.colorOnCenter(this.hexagonGrid.getGridCoord(posX, posY), 'blue');
            const result = this.checkIfEndGame();

            if(result != -1) {
                setTimeout(() => {
                    alert(`${result.toString()} won!`);
                    this.hexagonGrid.drawAll('white');
                    window.location.reload();
                }, 100);    
            }

            document.querySelector('.turnTitle').innerHTML = "Your turn";
            this.player = true;
        });
    }

    handleMouseClick(e) {
        const co = $("#myCanvas").offset();
        if (!co) {
            // do something here
            // throw an error here
            return false;
        }
        console.log(e.clientX - co.left, e.clientY - co.top);
        const coord = this.hexagonGrid.findWhichHexagon(e.clientX - co.left, e.clientY - co.top);

        if(!coord) {
            return false;
        }

        this.hexagonGrid.colorOnCenter(coord, 'red');
        return true;
    }
    
    async randomGenerate() {
        try {
            const gridString = this.hexagonGrid.toString();
            const response = await fetch(`${this.path}/random?grid=${encodeURIComponent(gridString)}`);
            const data = await response.json();
            return data.pair;
        } catch (error) {
            console.error('Error fetching random pair:', error);
            return [0, 0];
        }
    }
    
    checkIfEndGame() {
        return -1;
    }
}

function getWindowDimensions() {
    return {
        width: window.innerWidth * window.devicePixelRatio,
        height: window.innerHeight * window.devicePixelRatio
    };
}

function setupCanvasSize() {
    const canvas = document.getElementById('myCanvas');
    const dimensions = getWindowDimensions(); 

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

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