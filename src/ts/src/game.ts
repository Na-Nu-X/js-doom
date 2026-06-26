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
    },

    animation_slowdown_level: 30, // Sets The Timeout Between Sprite Animations (Every 30th Frame)
    is_moving: false // Stores The Information That The Doomguy Isn't Moving
})

// Function For Check The Collision Between Two Rectangles
function checkCollision(rectangle_1:any, rectangle_2:any, offset:number = 0):boolean {
    const rectangle_1_left:number = rectangle_1.position.x - (rectangle_1.size.width / 2)
    const rectangle_1_right:number = rectangle_1.position.x + (rectangle_1.size.width / 2)
    const rectangle_1_top:number = rectangle_1.position.y - (rectangle_1.size.height / 2)
    const rectangle_1_bottom:number = rectangle_1.position.y + (rectangle_1.size.height / 2)

    const rectangle_2_left:number = rectangle_2.position.x - (rectangle_2.size.width / 2) + offset
    const rectangle_2_right:number = rectangle_2.position.x + (rectangle_2.size.width / 2) - offset
    const rectangle_2_top:number = rectangle_2.position.y - (rectangle_2.size.height / 2) + offset
    const rectangle_2_bottom:number = rectangle_2.position.y + (rectangle_2.size.height / 2) - offset

    return (
        rectangle_1_left < rectangle_2_right &&
        rectangle_1_right > rectangle_2_left &&
        rectangle_1_top < rectangle_2_bottom &&
        rectangle_1_bottom > rectangle_2_top
    )
}

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
        position.y = position_of_shooter.y - 12
    }

    // Down Spawn Position
    if(current_action === "shoot_down") {
        position.x = position_of_shooter.x - 18,
        position.y = position_of_shooter.y - 12
    }

    // Right Spawn Position
    if(current_action === "shoot_right") {
        position.x = position_of_shooter.x + doomguy.size.width / 2,
        position.y = position_of_shooter.y - 12
    }

    return position
}

// Function For Initialize The Main Loop
function mainLoop():void {
    game_ctx.clearRect(0, 0, game.width, game.height) // Clears The Game CTX

    doomguy.is_moving = false // Stores The Information That The Doomguy Isn't Moving
    
    if(keys.w) doomguy.moveUp() // Moves The Doomguy Upwards
    else if(keys.a) doomguy.moveLeft() // Moves The Doomguy To The Left
    else if(keys.s) doomguy.moveDown() // Moves The Doomguy Downwards
    else if(keys.d) doomguy.moveRight() // Moves The Doomguy To The Right

    // Doomguy Shoot Functionality
    if(keys.space && !doomguy.is_shooting) {
        doomguy.shoot() // Doomguy Shoots

        const bullet_position:Position = getBulletPosition(doomguy.current_action, doomguy.position) // Gets The Bullet Position

        // Creates The Bullet
        const bullet:Bullet = new Bullet({
            position: bullet_position, // Sets The Spawn Position
            direction: doomguy.current_action, // Sets The Fly Direction
            animation_slowdown_level: 30 // Sets The Timeout Between Sprite Animations (Every 30th Frame)
        })

        all_bullets.push(bullet) // Stores The New Bullet To All Bullets
    }

    doomguy.update() // Updates The Doomguy's Frames
    doomguy.draw(game_ctx) // Draws The Doomguy

    imp.update() // Updates The Imp's Frames
    imp.draw(game_ctx) // Draws The Imp

    // Renders Every Bullet
    for(let i:number = all_bullets.length - 1; i >= 0; i--) {
        const one_bullet:Bullet = all_bullets[i] as Bullet // Gets The Bullet

        one_bullet.update() // Updates The Bullet
        one_bullet.draw(game_ctx) // Draws The Bullet

        // Removes The Bullet From The All Bullets
        if(one_bullet.can_be_removed) {
            all_bullets.splice(i, 1)
            continue
        }

        // If The Bullet Hit The Imp And Haven't Started The Decal Animation Yet
        if(!one_bullet.is_colliding && checkCollision(one_bullet, imp, 10)) {
            imp.gotHit() // Imp Obtain The Hit
            one_bullet.makeDecal() // Makes The Decal
            continue
        }

        // If The Bullet Hit The Map Border
        if(
            one_bullet.position.x <= 0 ||
            one_bullet.position.x >= window.innerWidth ||
            one_bullet.position.y <= 0 || 
            one_bullet.position.y >= window.innerHeight
        ) {
            all_bullets.splice(i, 1) // Removes The Bullet From The All Bullets
        }
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
    else if(key === "a" || key === "ArrowLeft") keys.a = true
    else if(key === "s" || key === "ArrowDown") keys.s = true
    else if(key === "d" || key === "ArrowRight") keys.d = true
    else if(key === " ") keys.space = true
})

// Window Keyup Functionalities
window.addEventListener("keyup", function(event):void {
    const key:string = event.key // Gets The Clicked Key

    // Stores The Released Keys
    if(key === "w" || key === "ArrowUp") keys.w = false
    else if(key === "a" || key === "ArrowLeft") keys.a = false
    else if(key === "s" || key === "ArrowDown") keys.s = false
    else if(key === "d" || key === "ArrowRight") keys.d = false
    else if(key === " ") keys.space = false
})