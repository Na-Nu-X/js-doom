import { 
    Doomguy,
    Bullet
} from "./doomguy/Doomguy.js"

import { Imp } from "./imp/Imp.js"

import type { Position } from "./doomguy/Doomguy.js"

const game:HTMLCanvasElement = document.querySelector(".game") as HTMLCanvasElement // Gets The Game Canvas
const game_ctx:CanvasRenderingContext2D = game.getContext("2d") as CanvasRenderingContext2D // Gets The Game CTX

game.width = window.innerWidth // Sets The Game Canvas Width
game.height = window.innerHeight // Sets The Game Canvas Height

// Stores The Information Which Keys Are Pressed
const keys:{
    w:boolean,
    a:boolean,
    s:boolean,
    d:boolean,
    space:boolean
} = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false
}

// Creates The Doomguy
const doomguy:Doomguy = new Doomguy({
    // Sets The Spawn Position (Center Of The Screen)
    position: { 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
    },

    // Sets The Movement Speed
    velocity: { 
        x: 2,
        y: 2
    },

    animation_slowdown_level: 30, // Sets The Timeout Between Sprite Animations (Every 30th Frame)
    is_moving: false // Stores The Information That The Doomguy Isn't Moving
})

const all_bullets:Bullet[] = [] // Stores All Bullets

// Creates The Imp
const imp:Imp = new Imp({
    // Sets The Spawn Position
    position: { 
        x: window.innerWidth - 100, 
        y: window.innerHeight - 100 
    },

    // Sets The Movement Speed
    velocity: { 
        x: 2,
        y: 2
    }
})

// Fubction For Get The Bullet Position
function getBulletPosition(current_action:string, position_of_shooter:Position):Position {
    const position:Position = {
        x: 0,
        y: 0
    }

    // Up Spawn Position
    if(current_action === "shoot_up") {
        position.x = position_of_shooter.x,
        position.y = position_of_shooter.y - doomguy.size.height / 2
    }
    
    // Left Spawn Position
    if(current_action === "shoot_left") {
        position.x = position_of_shooter.x - doomguy.size.width / 2,
        position.y = position_of_shooter.y
    }

    // Down Spawn Position
    if(current_action === "shoot_down") {
        position.x = position_of_shooter.x,
        position.y = position_of_shooter.y
    }

    // Right Spawn Position
    if(current_action === "shoot_right") {
        position.x = position_of_shooter.x + doomguy.size.width / 2,
        position.y = position_of_shooter.y
    }

    return position
}

// Function For Initialize The Main Loop
function mainLoop():void {
    game_ctx.clearRect(0, 0, game.width, game.height) // Clears The Game CTX
    
    if(keys.w) doomguy.moveUp() // Moves The Doomguy Upwards
    if(keys.a) doomguy.moveLeft() // Moves The Doomguy To The Left
    if(keys.s) doomguy.moveDown() // Moves The Doomguy Downwards
    if(keys.d) doomguy.moveRight() // Moves The Doomguy To The Right

    // Doomguy Shoot Functionality
    if(keys.space && !doomguy.is_shooting) {
        doomguy.shoot() // Doomguy Shoots

        const bullet_position:Position = getBulletPosition(doomguy.current_action, doomguy.position) // Gets The Bullet Position

        // Creates The Bullet
        const bullet:Bullet = new Bullet({
            position: bullet_position, // Sets The Spawn Position
            direction: doomguy.current_action // Sets The Fly Direction
        })

        all_bullets.push(bullet) // Stores The New Bullet To All Bullets
    }

    doomguy.is_moving = false // Stores The Information That The Doomguy Isn't Moving
    doomguy.update() // Updates The Doomguy's Frames
    doomguy.draw(game_ctx) // Draws The Doomguy

    imp.draw(game_ctx) // Draws The Imp

    // Renders Every Bullet
    for(let i:number = all_bullets.length - 1; i >= 0; i--) {
        const one_bullet:Bullet = all_bullets[i] as Bullet // Gets The Bullet

        one_bullet.update() // Updates The Bullet
        one_bullet.draw(game_ctx) // Draws The Bullet
    }

    requestAnimationFrame(mainLoop) // Loops The Main Loop
}

mainLoop() // Initializes The Main Loop

// Events

// Window Resize Functionality
window.addEventListener("resize", function():void {
    game.width = window.innerWidth // Updates The Game Canvas Width
    game.height = window.innerHeight // Updates The Game Canvas Height
})

// Global Event Delegations

// Window Keydown Functionalities
window.addEventListener("keydown", function(event):void {
    const key:string = event.key // Gets The Clicked Key

    // Stores The Pressed Keys
    if(key === "w" || key === "ArrowUp") keys.w = true
    if(key === "a" || key === "ArrowLeft") keys.a = true
    if(key === "s" || key === "ArrowDown") keys.s = true
    if(key === "d" || key === "ArrowRight") keys.d = true
    if(key === " ") keys.space = true
})

// Window Keyup Functionalities
window.addEventListener("keyup", function(event):void {
    const key:string = event.key // Gets The Clicked Key

    // Stores The Released Keys
    if(key === "w" || key === "ArrowUp") keys.w = false
    if(key === "a" || key === "ArrowLeft") keys.a = false
    if(key === "s" || key === "ArrowDown") keys.s = false
    if(key === "d" || key === "ArrowRight") keys.d = false
    if(key === " ") keys.space = false
})