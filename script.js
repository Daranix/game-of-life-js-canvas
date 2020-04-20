
/**
* @type {HTMLCanvasElement}
*/
const canvas = document.getElementById("game");
const gameStatusElement = document.getElementById("gameStatus");
const ctx = canvas.getContext("2d");
const width = 1280;
const height = 720;
const boxHeight = 20;
const boxWidth = 20;
let isPaused = false;
/**
 * @type {Array<Cell[]>}
 */
let matrix = null;


document.addEventListener("keypress", (event) => {
    console.log(event);
    if (event.code === 'Space') {
        isPaused = !isPaused;
        gameStatusElement.innerText = (isPaused ? "Stopped" : "Running");
    }
});

let isMouseDown = false;

canvas.addEventListener("mousedown", () => {
    isMouseDown = true;
});

canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
});

canvas.addEventListener("mousemove", (ev) => {
    if (isMouseDown) {
        const mouseX = ev.offsetX;
        const mouseY = ev.offsetY;
        handleCellClick(mouseX, mouseY);
    }
});



canvas.addEventListener("click", (ev) => {
    const mouseX = ev.offsetX;
    const mouseY = ev.offsetY;
    handleCellClick(mouseX, mouseY);
});

function handleCellClick(mouseX, mouseY) {
    console.log("Mouse X: ", mouseX);
    console.log("Mouse Y:", mouseY);
    const posMatrixX = Math.floor(mouseX / boxWidth);
    const posMatrixY = Math.floor(mouseY / boxHeight);

    console.log("Position in matrix X", posMatrixX);
    console.log("Position in matrix Y", posMatrixY);

    const cell = matrix[posMatrixX][posMatrixY];
    cell.status = !cell.status;
}



/**
 *
 * @class Cell
 * @property {number} x
 * @property {number} y
 * @property {boolean} status
 */
class Cell {

    constructor(id, posX, posY, mX, mY) {
        this.id = id;
        this.posX = posX;
        this.posY = posY;
        this.mX = mX;
        this.mY = mY;
        this.status = false;
    }

    /**
     *
     *
     * @param {Array<Cell[]>} matrix
     * @memberof Cell
     */
    nearestCellsAlive(matrix) {
        let count = 0;

        // Top
        if (matrix[this.mX]?.[this.mY + 1]?.status) {
            count++;
        }

        // Bottom
        if (matrix[this.mX]?.[this.mY - 1]?.status) {
            count++;
        }

        // Left
        if (matrix[this.mX - 1]?.[this.mY]?.status) {
            count++;
        }

        // Right
        if (matrix[this.mX + 1]?.[this.mY]?.status) {
            count++;
        }

        // TopLeft
        if (matrix[this.mX - 1]?.[this.mY + 1]?.status) {
            count++;
        }

        // TopRight
        if (matrix[this.mX + 1]?.[this.mY + 1]?.status) {
            count++;
        }

        //BottomLeft
        if (matrix[this.mX - 1]?.[this.mY - 1]?.status) {
            count++;
        }

        //BottomRight
        if (matrix[this.mX + 1]?.[this.mY - 1]?.status) {
            count++;
        }

        return count;
    }

    /**
     *
     *
     * @returns {Cell}
     * @memberof Cell
     */
    clone() {
        return Object.assign(new Cell(), this);
    }

}

function update() {
    // ctx.clearRect(0,0,width,height);
    // ctx.fillStyle = "white";
    // ctx.fillRect(0,0, width, height);

    const currentGameStatus = matrix;
    const newGameStatus = setup();

    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            const cell = matrix[x][y];
            const posX = cell.posX;
            const posY = cell.posY;

            if (!isPaused) {
                const newCell = gameLogic(cell, currentGameStatus);
                newGameStatus[x][y] = newCell;
            }


            ctx.fillStyle = (cell.status) ? "white" : "black";
            ctx.fillRect(posX, posY, boxWidth - 1, boxHeight - 1);

        }
    }

    if (!isPaused) {
        matrix = newGameStatus;
    }

    setTimeout(() => update(), 250);

}

/**
 *
 * @returns {Array<Cell[]>}
 */
function setup() {

    let m = [];
    for (let x = 0; x < width / boxWidth; x++) {
        m[x] = [];
        for (let y = 0; y < height / boxHeight; y++) {
            const posX = (x * boxWidth);
            const posY = (y * boxHeight);
            const id = `${x}-${y}`;
            m[x][y] = new Cell(id, posX, posY, x, y);
        }
    }

    return m;

}



/**
 *
 *
 * @param {Cell} cell
 * @param {Array<Cell[]>} newGameStatus
 * @param {Array<Cell[]>} currentGameStatus
 * @returns {Cell}
 */
function gameLogic(cell, currentGameStatus) {

    const cellCopy = cell.clone();
    if (cell.status === false && cell.nearestCellsAlive(currentGameStatus) === 3) {
        cellCopy.status = true;
    }
    else if (cell.status === true && cell.nearestCellsAlive(currentGameStatus) === 2 || cell.nearestCellsAlive(currentGameStatus) === 3) {
        cellCopy.status = true;
    } else {
        cellCopy.status = false;
    }
    return cellCopy;
}

matrix = setup();
update();