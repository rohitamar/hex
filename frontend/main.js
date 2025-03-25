"use strict";
import { HexagonGrid } from './draw.js';

class GameEvent {
    constructor() {
        this.hexagonGrid = new HexagonGrid();
        this.initializeEventListeners();
        this.hexagonGrid.drawAll('white');
    }

    initializeEventListeners() {
        $('#myCanvas').on('click', async (e) => {
            if (!this.handleMouseClick(e)) {
                alert("Square already clicked. Try again.");
                return;
            }
            
            const [posX, posY] = await this.randomGenerate();

            this.hexagonGrid.colorOnCenter(this.hexagonGrid.getGridCoord(posX, posY), 'blue');
            const result = this.checkIfEndGame();

            if (result !== -1) {
                setTimeout(() => {
                    alert(`${result.toString()} won!`);
                    this.hexagonGrid.drawAll('white');
                    window.location.reload();
                }, 100);    
            }
        });
    }

    handleMouseClick(e) {
        const co = $("#myCanvas").offset();
        if (!co) {
            // do something here
            // throw an error here
            return false;
        }
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
            const response = await fetch(`/random?grid=${encodeURIComponent(gridString)}`);
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
$(document).ready(() => {
    const game = new GameEvent();
});
66