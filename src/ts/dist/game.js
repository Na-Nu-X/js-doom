import { Doomguy } from "./doomguy/Doomguy.js";
const game = document.querySelector(".game"); // Gets The Game Canvas
const game_ctx = game.getContext("2d"); // Gets The Game CTX
game.width = window.innerWidth; // Sets The Game Canvas Width
game.height = window.innerHeight; // Sets The Game Canvas Height
// Creates The Doomguy
const doomguy = new Doomguy({
    position: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    },
    velocity: {
        x: 5,
        y: 5
    }
});
// Function For Initialize The Main Loop
function mainLoop() {
    game_ctx.clearRect(0, 0, game.width, game.height); // Clears The Game CTX
    game_ctx.fillStyle = "black";
    doomguy.draw(game_ctx); // Draws The Doomguy
    requestAnimationFrame(mainLoop); // Loops The Main Loop
}
mainLoop(); // Initializes The Main Loop
// Events
// Window Resize Functionality
window.addEventListener("resize", function () {
    game.width = window.innerWidth; // Updates The Game Canvas Width
    game.height = window.innerHeight; // Updates The Game Canvas Height
});
// Global Event Delegations
// Window Keydown Functionalities
window.addEventListener("keydown", function (event) {
    const key = event.keyCode; // Gets The Clicked Key
    switch (key) {
        // Move Up
        case 87:
            doomguy.moveUp(); // Moves The Doomguy Upwards
            break;
        // Move Up
        case 38:
            doomguy.moveUp(); // Moves The Doomguy Upwards
            break;
        // Move Left
        case 65:
            doomguy.moveLeft(); // Moves The Doomguy To The Left
            break;
        // Move Left
        case 37:
            doomguy.moveLeft(); // Moves The Doomguy To The Left
            break;
        // Move Down
        case 83:
            doomguy.moveDown(); // Moves The Doomguy Downwards
            break;
        // Move Down
        case 40:
            doomguy.moveDown(); // Moves The Doomguy Downwards
            break;
        // Move Right
        case 68:
            doomguy.moveRight(); // Moves The Doomguy To The Right
            break;
        // Move Right
        case 39:
            doomguy.moveRight(); // Moves The Doomguy To The Right
            break;
        case 32:
            doomguy.shoot(); // Doomguy Shoots
            break;
    }
});
//# sourceMappingURL=game.js.map