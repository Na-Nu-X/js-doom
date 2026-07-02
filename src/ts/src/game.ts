import { 
    Doomguy,
    Bullet
} from "./doomguy/Doomguy.js"

import { 
    Fireball, 
    Imp 
} from "./imp/Imp.js"

import { 
    FormerHuman,
    Bullet as FormerHumanBullet
} from "./former_human/FormerHuman.js"

import { 
    FormerHumanSergeant,
    Bullet as FormerHumanSergeantBullet
} from "./former_human_sergeant/FormerHumanSergeant.js"

import { Map } from "./map/Map.js"
import { collisions } from "./map/data.js"
import { Pinky } from "./pinky/Pinky.js"
import { HealthBonus } from "./health_bonus/HealthBonus.js"
import { ArmorBonus } from "./armor_bonus/ArmorBonus.js"
import { ExplosiveBarrel } from "./explosive_barrel/ExplosiveBarrel.js"

import type { 
    Position, 
    Size 
} from "./doomguy/Doomguy.js"

import type { Wall } from "./map/data.js"

const game:HTMLCanvasElement = document.querySelector(".game") as HTMLCanvasElement // Gets The Game Canvas
const game_ctx:CanvasRenderingContext2D = game.getContext("2d") as CanvasRenderingContext2D // Gets The Game CTX

game.width = 1920 // Sets The Game Canvas Width
game.height = 1080 // Sets The Game Canvas Height

let game_paused:boolean = true // Stores The Information If The Game Is Paused
let is_death:boolean = false // Stores The Information If The Player Is Death
    
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

// Functions

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

// Function For Check Collision Between Wall And Entities
export function checkWallCollision(rectangle_1:any, rectangle_2:Wall): boolean {
    const rectangle_1_left:number = rectangle_1.position.x - (rectangle_1.size.width / 2)
    const rectangle_1_right:number = rectangle_1.position.x + (rectangle_1.size.width / 2)
    const rectangle_1_top:number = rectangle_1.position.y - (rectangle_1.size.height / 2)
    const rectangle_1_bottom:number = rectangle_1.position.y + (rectangle_1.size.height / 2)

    const rectangle_2_left = rectangle_2.x
    const rectangle_2_right = rectangle_2.x + rectangle_2.width
    const rectangle_2_top = rectangle_2.y
    const rectangle_2_bottom = rectangle_2.y + rectangle_2.height

    return (
        rectangle_1_left < rectangle_2_right &&
        rectangle_1_right > rectangle_2_left &&
        rectangle_1_top < rectangle_2_bottom &&
        rectangle_1_bottom > rectangle_2_top
    )
}

// Fubction For Get The Bullet Position
export function getBulletPosition(current_action:string, position_of_shooter:Position, size_of_shooter:Size):Position {
    const position:Position = {
        x: 0,
        y: 0
    }

    // Up Spawn Position
    if(current_action === "shoot_up" || current_action === "move_up") {
        position.x = position_of_shooter.x,
        position.y = position_of_shooter.y - size_of_shooter.height / 2
    }
    
    // Left Spawn Position
    if(current_action === "shoot_left" || current_action === "move_left") {
        position.x = position_of_shooter.x - size_of_shooter.width / 2,
        position.y = position_of_shooter.y - 12
    }

    // Down Spawn Position
    if(current_action === "shoot_down" || current_action === "move_down") {
        position.x = position_of_shooter.x - 18,
        position.y = position_of_shooter.y - 12
    }

    // Right Spawn Position
    if(current_action === "shoot_right" || current_action === "move_right") {
        position.x = position_of_shooter.x + size_of_shooter.width / 2,
        position.y = position_of_shooter.y - 12
    }

    return position
}

// Function For Initialize The Game
function initializeGame():void {
    const map:Map = new Map({}) // Creates The Map
    
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
            x: 0.5,
            y: 0.5
        },
    
        animation_slowdown_level: 30, // Sets The Timeout Between Sprite Animations (Every 30th Frame)
        is_moving: false // Stores The Information That The Imp Isn't Moving
    })
    
    const all_fireballs:Fireball[] = [] // Stores All Fireballs

    // Creates The Former Human
    const former_human:FormerHuman = new FormerHuman({
        // Sets The Spawn Position
        position: { 
            x: 100, 
            y: 100 
        },
    
        // Sets The Movement Speed
        velocity: { 
            x: 0.5,
            y: 0.5
        },
    
        animation_slowdown_level: 30, // Sets The Timeout Between Sprite Animations (Every 30th Frame)
        is_moving: false // Stores The Information That The Former Human Isn't Moving
    })

    const all_former_human_bullets:FormerHumanBullet[] = [] // Stores All Bullets From Former Human

    // Creates The Former Human Sergeant
    const former_human_sergeant:FormerHumanSergeant = new FormerHumanSergeant({
        // Sets The Spawn Position
        position: { 
            x: 300, 
            y: 300 
        },
    
        // Sets The Movement Speed
        velocity: { 
            x: 0.5,
            y: 0.5
        },
    
        animation_slowdown_level: 30, // Sets The Timeout Between Sprite Animations (Every 30th Frame)
        is_moving: false // Stores The Information That The Former Human Sergeant Isn't Moving
    })

    const all_former_human_sergeant_bullets:FormerHumanSergeantBullet[] = [] // Stores All Bullets From Former Human Sergeant

    // Creates The Pinky
    const pinky:Pinky = new Pinky({
        // Sets The Spawn Position
        position: { 
            x: 200, 
            y: 200 
        },
    
        // Sets The Movement Speed
        velocity: { 
            x: 0.5,
            y: 0.5
        },
    
        animation_slowdown_level: 30, // Sets The Timeout Between Sprite Animations (Every 30th Frame)
        is_moving: false // Stores The Information That The Pinky Isn't Moving
    })
    
    // Creates Health Bonuses
    const HEALTH_BONUSES_AMOUNT:number = 10 // Defines The Amount Of Generated Health Bonuses
    const all_health_bonuses:HealthBonus[] = [] // Stores All Health Bonuses

    for(let i:number = 0; i < HEALTH_BONUSES_AMOUNT; i++) {
        const SCALE:number = 2 // Defines The Scale
        const HEALTH_BONUS_WIDTH:number = 14 * SCALE // Defines The Width Of The Health Bonus
        const HEALTH_BONUS_HEIGHT:number = 18 * SCALE // Defines The Height Of The Health Bonus

        const health_bonus = new HealthBonus({
            // Sets The Spawn Position
            position: { 
                x: Math.floor(Math.random() * (window.innerWidth - HEALTH_BONUS_WIDTH)),
                y: Math.floor(Math.random() * (window.innerHeight - HEALTH_BONUS_HEIGHT))
            },
        
            animation_slowdown_level: 60 // Sets The Timeout Between Sprite Animations (Every 60th Frame)
        })

        all_health_bonuses.push(health_bonus) // Stores The New Health Bonus To All Health Bonuses
    }

    // Creates Armor Bonuses
    const ARMOR_BONUSES_AMOUNT:number = 5 // Defines The Amount Of Generated Armor Bonuses
    const all_armor_bonuses:ArmorBonus[] = [] // Stores All Armor Bonuses

    for(let i:number = 0; i < ARMOR_BONUSES_AMOUNT; i++) {
        const SCALE:number = 2 // Defines The Scale
        const ARMOR_BONUS_WIDTH:number = 14 * SCALE // Defines The Width Of The Armor Bonus
        const ARMOR_BONUS_HEIGHT:number = 18 * SCALE // Defines The Height Of The Armor Bonus

        const armor_bonus = new ArmorBonus({
            // Sets The Spawn Position
            position: { 
                x: Math.floor(Math.random() * (window.innerWidth - ARMOR_BONUS_WIDTH)),
                y: Math.floor(Math.random() * (window.innerHeight - ARMOR_BONUS_HEIGHT))
            },
        
            animation_slowdown_level: 60 // Sets The Timeout Between Sprite Animations (Every 60th Frame)
        })

        all_armor_bonuses.push(armor_bonus) // Stores The New Armor Bonus To All Armor Bonuses
    }
    
    // Creates Explosive Barrels
    const EXPLOSIVE_BARRELS_AMOUNT:number = 5 // Defines The Amount Of Generated Explosive Barrels
    const all_explosive_barrels:ExplosiveBarrel[] = [] // Stores All Explosive Barrels

    for(let i:number = 0; i < EXPLOSIVE_BARRELS_AMOUNT; i++) {
        const SCALE:number = 2 // Defines The Scale
        const HEALTH_BONUS_WIDTH:number = 14 * SCALE // Defines The Width Of The Explosive Barrel
        const HEALTH_BONUS_HEIGHT:number = 18 * SCALE // Defines The Height Of The Explosive Barrel

        const explosive_barrel = new ExplosiveBarrel({
            // Sets The Spawn Position
            position: { 
                x: Math.floor(Math.random() * (window.innerWidth - HEALTH_BONUS_WIDTH)),
                y: Math.floor(Math.random() * (window.innerHeight - HEALTH_BONUS_HEIGHT))
            },
        
            animation_slowdown_level: 120 // Sets The Timeout Between Sprite Animations (Every 120th Frame)
        })

        all_explosive_barrels.push(explosive_barrel) // Stores The New Explosive Barrel To All Explosive Barrels
    }
    
    // Function For Initialize The Main Loop
    function mainLoop():void {
        game_ctx.clearRect(0, 0, game.width, game.height) // Clears The Game CTX
        game_ctx.imageSmoothingEnabled = false // Makes Sharp Images
    
        map.draw(game_ctx, collisions) // Draws The Map

        // Renders Every Health Bonus
        for(let i:number = all_health_bonuses.length - 1; i >= 0; i--) {
            const one_health_bonus:HealthBonus = all_health_bonuses[i] as HealthBonus // Gets The Health Bonus

            one_health_bonus.update(game_ctx) // Updates The Health Bonus

            // If The Doomguy Picked Up The Health Bonus And Isn't Already Death
            if(!doomguy.is_death && checkCollision(one_health_bonus, doomguy)) {
                doomguy.addHealth(10) // Adds Health For The Doomguy
                all_health_bonuses.splice(i, 1) // Removes The Health Bonus From The All Health Bonuses
            }
        }

        // Renders Every Armor Bonus
        for(let i:number = all_armor_bonuses.length - 1; i >= 0; i--) {
            const one_armor_bonus:ArmorBonus = all_armor_bonuses[i] as ArmorBonus // Gets The Armor Bonus

            one_armor_bonus.update(game_ctx) // Updates The Armor Bonus

            // If The Doomguy Picked Up The Armor Bonus And Isn't Already Death
            if(!doomguy.is_death && checkCollision(one_armor_bonus, doomguy)) {
                doomguy.addArmor(10) // Adds Armor For The Doomguy
                all_armor_bonuses.splice(i, 1) // Removes The Armor Bonus From The All Armor Bonuses
            }
        }

        // Renders Every Explosive Barrels
        for(let i:number = all_explosive_barrels.length - 1; i >= 0; i--) {
            const one_explosive_barrel:ExplosiveBarrel = all_explosive_barrels[i] as ExplosiveBarrel // Gets The Explosive Barrel

            one_explosive_barrel.update(game_ctx) // Updates The Explosive Barrel

            // If The Explosive Barrel's Blast Hit The Doomguy And The Doomguy Isn't Already Death
            if(!doomguy.is_death && one_explosive_barrel.is_exploded && one_explosive_barrel.can_be_removed && checkCollision(one_explosive_barrel, doomguy, -50)) {
                doomguy.gotHit("explosive_barrel") // Doomguy Obtain The Hit From The Explosive Barrel
            }

            // If The Explosive Barrel's Blast Hit The Imp And The Imp Isn't Already Death
            if(!imp.is_death && one_explosive_barrel.is_exploded && one_explosive_barrel.can_be_removed && checkCollision(one_explosive_barrel, imp, -50)) {
                imp.gotHit() // Imp Obtain The Hit From The Explosive Barrel
            }

            // If The Explosive Barrel's Blast Hit The Former Human And The Former Human Isn't Already Death
            if(!former_human.is_death && one_explosive_barrel.is_exploded && one_explosive_barrel.can_be_removed && checkCollision(one_explosive_barrel, former_human, -50)) {
                former_human.gotHit() // Former Human Obtain The Hit From The Explosive Barrel
            }

            // If The Explosive Barrel's Blast Hit The Former Human Sergeant And The Former Human Sergeant Isn't Already Death
            if(!former_human_sergeant.is_death && one_explosive_barrel.is_exploded && one_explosive_barrel.can_be_removed && checkCollision(one_explosive_barrel, former_human_sergeant, -50)) {
                former_human_sergeant.gotHit() // Former Human Sergeant Obtain The Hit From The Explosive Barrel
            }

            // If The Explosive Barrel's Blast Hit The Pinky And The Pinky Isn't Already Death
            if(!pinky.is_death && one_explosive_barrel.is_exploded && one_explosive_barrel.can_be_removed && checkCollision(one_explosive_barrel, pinky, -50)) {
                pinky.gotHit() // Pinky Obtain The Hit From The Explosive Barrel
            }

            // Removes The Explosive Barrel From The All Explosive Barrels
            if(one_explosive_barrel.can_be_removed) {
                all_explosive_barrels.splice(i, 1)
                continue
            }
        }

        imp.draw(game_ctx) // Draws The Imp
        former_human.draw(game_ctx) // Draws The Former Human
        former_human_sergeant.draw(game_ctx) // Draws The Former Human Sergeant
        pinky.draw(game_ctx) // Draws The Pinky
        doomguy.draw(game_ctx) // Draws The Doomguy
    
        if(game_paused) map.showStartUI(game_ctx) // Shows The Start UI
    
        // If The Game Isn't Paused
        if(!game_paused) {
            doomguy.is_moving = false // Stores The Information That The Doomguy Isn't Moving
            
            // Enables Doomguy's Actions Only If Is Still Alive
            if(!doomguy.is_death) {
                if(keys.w && doomguy.position.y > 0 + doomguy.size.height / 2) doomguy.moveUp(collisions) // Moves The Doomguy Upwards
                else if(keys.a && doomguy.position.x > 0 + doomguy.size.width / 2) doomguy.moveLeft(collisions) // Moves The Doomguy To The Left
                else if(keys.s && doomguy.position.y < window.innerHeight - doomguy.size.height / 2) doomguy.moveDown(collisions) // Moves The Doomguy Downwards
                else if(keys.d && doomguy.position.x < window.innerWidth - doomguy.size.width / 2) doomguy.moveRight(collisions) // Moves The Doomguy To The Right
        
                // Doomguy Shoot Functionality
                if(keys.space && !doomguy.is_shooting) {
                    doomguy.shoot() // Doomguy Shoots
        
                    const bullet_position:Position = getBulletPosition(doomguy.current_action, doomguy.position, doomguy.size) // Gets The Bullet Position
        
                    // Creates The Bullet
                    const bullet:Bullet = new Bullet({
                        position: bullet_position, // Sets The Spawn Position
                        direction: doomguy.current_action, // Sets The Fly Direction
                        animation_slowdown_level: 30 // Sets The Timeout Between Sprite Animations (Every 30th Frame)
                    })
        
                    all_bullets.push(bullet) // Stores The New Bullet To All Bullets
                }
            }
        
            // imp.update(all_fireballs, doomguy.position, doomguy.is_death) // Updates The Imp
            // former_human.update(all_former_human_bullets, doomguy.position, doomguy.is_death) // Updates The Former Human
            // former_human_sergeant.update(all_former_human_sergeant_bullets, doomguy.position, doomguy.is_death) // Updates The Former Human Sergeant
            // pinky.update(doomguy.position, doomguy.is_death) // Updates The Pinky
            doomguy.update() // Updates The Doomguy's Frames
        
            // If The Player Has Died
            if(doomguy.is_death && doomguy.is_death_animation_finished) {
                map.showDeathUI(game_ctx) // Shows The Death UI
                is_death = true // Sets The Information That The Player Is Death
                return
            }
        
            // Renders Every Doomguy's Bullet
            for(let i:number = all_bullets.length - 1; i >= 0; i--) {
                const one_bullet:Bullet = all_bullets[i] as Bullet // Gets The Bullet
        
                one_bullet.update(game_ctx) // Updates The Bullet
        
                // Removes The Bullet From The All Bullets
                if(one_bullet.can_be_removed) {
                    all_bullets.splice(i, 1)
                    continue
                }
        
                // If The Bullet Hit The Imp, Hasn't Started The Decal Animation Yet And The Imp Isn't Already Death
                if(!imp.is_death && !one_bullet.is_colliding && checkCollision(one_bullet, imp, 10)) {
                    imp.gotHit() // Imp Obtain The Hit
                    one_bullet.makeDecal() // Makes The Decal
                    continue
                }

                // If The Bullet Hit The Former Human, Hasn't Started The Decal Animation Yet And The Former Human Isn't Already Death
                if(!former_human.is_death && !one_bullet.is_colliding && checkCollision(one_bullet, former_human, 10)) {
                    former_human.gotHit() // Former Human Obtain The Hit
                    one_bullet.makeDecal() // Makes The Decal
                    continue
                }

                // If The Bullet Hit The Former Human Sergeant, Hasn't Started The Decal Animation Yet And The Former Human Sergeant Isn't Already Death
                if(!former_human_sergeant.is_death && !one_bullet.is_colliding && checkCollision(one_bullet, former_human_sergeant, 10)) {
                    former_human_sergeant.gotHit() // Former Human Sergeant Obtain The Hit
                    one_bullet.makeDecal() // Makes The Decal
                    continue
                }

                // If The Bullet Hit The Pinky, Hasn't Started The Decal Animation Yet And The Pinky Isn't Already Death
                if(!pinky.is_death && !one_bullet.is_colliding && checkCollision(one_bullet, pinky, 10)) {
                    pinky.gotHit() // Pinky Obtain The Hit
                    one_bullet.makeDecal() // Makes The Decal
                    continue
                }

                // If The Bullet Hit Some Explosive Barrel
                all_explosive_barrels.forEach(function(one_explosive_barrel:ExplosiveBarrel):void {
                    // If The Explosive Barrel Hasn't Exploded Yet And The Bullet Hasn't Started The Decal Animation Yet
                    if(!one_explosive_barrel.is_exploded && !one_bullet.is_colliding) {
                        if(checkCollision(one_bullet, one_explosive_barrel, 10)) {
                            one_bullet.current_action = "wall_hit"
                            one_bullet.makeDecal() // Makes The Decal
                            one_explosive_barrel.gotHit() // Explosive Barrel Obtain The Hit
                        }
                    }
                })
        
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
        
            // Renders Every Fireball
            for(let i:number = all_fireballs.length - 1; i >= 0; i--) {
                const one_fireball:Fireball = all_fireballs[i] as Fireball // Gets The Fireball
        
                one_fireball.update(game_ctx) // Updates The Fireball
        
                // Removes The Fireball From The All Fireballs
                if(one_fireball.can_be_removed) {
                    all_fireballs.splice(i, 1)
                    continue
                }
        
                // If The Fireball Hit The Doomguy, Hasn't Started The Decal Animation Yet And The Doomguy Isn't Already Death
                if(!doomguy.is_death && !one_fireball.is_colliding && checkCollision(one_fireball, doomguy, 10)) {
                    doomguy.gotHit("imp") // Doomguy Obtain The Hit From The Imp's Fireball
                    one_fireball.makeDecal() // Makes The Decal
                    continue
                }
        
                // If The Fireball Hit The Map Border
                if(
                    one_fireball.position.x <= 0 ||
                    one_fireball.position.x >= window.innerWidth ||
                    one_fireball.position.y <= 0 || 
                    one_fireball.position.y >= window.innerHeight
                ) {
                    all_fireballs.splice(i, 1) // Removes The Fireball From The All Fireballs
                }
            }

            // Renders Every Former Human's Bullet
            for(let i:number = all_former_human_bullets.length - 1; i >= 0; i--) {
                const one_bullet:FormerHumanBullet = all_former_human_bullets[i] as FormerHumanBullet // Gets The Bullet
        
                one_bullet.update(game_ctx) // Updates The Bullet
        
                // Removes The Bullet From The All Bullets
                if(one_bullet.can_be_removed) {
                    all_former_human_bullets.splice(i, 1)
                    continue
                }

                // If The Bullet Hit The Doomguy, Hasn't Started The Decal Animation Yet And The Doomguy Isn't Already Death
                if(!doomguy.is_death && !one_bullet.is_colliding && checkCollision(one_bullet, doomguy, 10)) {
                    doomguy.gotHit("former_human") // Doomguy Obtain The Hit From The Former Human's Bullet
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
                    all_former_human_bullets.splice(i, 1) // Removes The Bullet From The All Bullets
                }
            }

            // Renders Every Former Human Sergeant's Bullet
            for(let i:number = all_former_human_sergeant_bullets.length - 1; i >= 0; i--) {
                const one_bullet:FormerHumanSergeantBullet = all_former_human_sergeant_bullets[i] as FormerHumanSergeantBullet // Gets The Bullet
        
                one_bullet.update(game_ctx) // Updates The Bullet
        
                // Removes The Bullet From The All Bullets
                if(one_bullet.can_be_removed) {
                    all_former_human_sergeant_bullets.splice(i, 1)
                    continue
                }

                // If The Bullet Hit The Doomguy, Hasn't Started The Decal Animation Yet And The Doomguy Isn't Already Death
                if(!doomguy.is_death && !one_bullet.is_colliding && checkCollision(one_bullet, doomguy, 10)) {
                    doomguy.gotHit("former_human_sergeant") // Doomguy Obtain The Hit From The Former Human Sergeant's Bullet
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
                    all_former_human_sergeant_bullets.splice(i, 1) // Removes The Bullet From The All Bullets
                }
            }

            // If The Pinky Is Biting The Doomguy, Hasn't Already Dealt Damage And The Doomguy Isn't Already Death
            if(!doomguy.is_death && pinky.is_biting && !pinky.has_dealt_damage && checkCollision(pinky, doomguy)) {
                doomguy.gotHit("pinky") // Doomguy Obtain The Hit From The Imp's Fireball
                pinky.has_dealt_damage = true // Stores The Information That The Pinky Has Dealt Damage To The Player
            }
        }
    
        requestAnimationFrame(mainLoop) // Loops The Main Loop
    }
    
    mainLoop() // Initializes The Main Loop
}

// Events

// // Window Resize Functionality
// window.addEventListener("resize", function():void {
//     game.width = window.innerWidth // Updates The Game Canvas Width
//     game.height = window.innerHeight // Updates The Game Canvas Height
// })

// Global Event Delegations

// Window Keydown Functionalities
window.addEventListener("keydown", function(event):void {
    const key:string = event.key // Gets The Clicked Key

    if(game_paused) game_paused = false // Starts The Game On Any Pressed Key If The Game Is Paused
    
    // Starts The Game On Any Pressed Key If The Player Is Death
    if(is_death) {
        is_death = false // Sets The Information That The Player Isn't Death
        initializeGame() // Restarts The Game
    }

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

// Initialization

initializeGame() // Initializes The Game