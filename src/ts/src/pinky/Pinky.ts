import { pinky as pinky_sprites } from "./data.js"

import type { 
    Position, 
    Size, 
    Velocity 
} from "../doomguy/Doomguy.js"

interface PinkyConfig {
    position:Position,
    velocity:Velocity,
    animation_slowdown_level:number,
    is_moving:boolean,
}

export class Pinky {
    position:Position
    velocity:Velocity
    animation_slowdown_level:number
    is_moving:boolean
    size:Size
    is_biting:boolean
    has_dealt_damage:boolean
    current_action:string
    is_death:boolean
    
    private scale:number
    private image:HTMLImageElement
    private current_frame:number
    private max_frames:number
    private is_mirrored:boolean
    private frames_counter:number
    private health:number
    private attack_cooldown_counter:number = 0
    private attack_cooldown_max:number = 300

    constructor({
        position,
        velocity,
        animation_slowdown_level
    }:PinkyConfig) {
        this.position = position
        this.velocity = velocity
        this.animation_slowdown_level = animation_slowdown_level // Sets The Level Of Animation Slowdown
        this.is_moving = false // Stores The Information If The Pinky Is Moving

        this.scale = 2

        this.image = new Image()
        this.image.src = "../../textures/pinky/SARGA1.png"

        this.size = {
            width: this.image.width * this.scale,
            height: this.image.height * this.scale
        }

        this.current_frame = 0 // Sets The Initial Current Sprite Frame
        this.max_frames = pinky_sprites.move_down.frames.length // Sets The Default Amount Of Maximum Sprite Frames
        this.is_mirrored = false // Sets The Default Information If The Sprite Is Mirrored
        this.frames_counter = 0 // Sets The Initial Frames Counter Value

        this.current_action = "move_down" // Stores The Current Used Sprite

        this.is_biting = false // Checks If The Pinky Is Biting
        this.has_dealt_damage = false // Checks If The Pinky Has Dealt Damage To The Player

        this.health = 100 // Stores The Health Amount
        this.is_death = false // Checks If The Pinky Is Dying
    }
    
    // Method For Draw The Pinky
    draw(ctx:CanvasRenderingContext2D):void {
        if(!this.image.complete) return // Do Nothing If The Image Isn't Fully Loaded

        this.size.width = this.image.width * this.scale // Sets The Hitbox Width
        this.size.height = this.image.height * this.scale // Sets The Hitbox Height

        // Shows The Sprite

        // Mirrored Sprite
        if(this.is_mirrored) {
            ctx.save() // Saves The Current Canvas State
            ctx.scale(-1, 1) // Inverts The X Axis

            ctx.drawImage(
                this.image,
                -this.position.x - (this.size.width / 2),
                this.position.y - (this.size.height / 2),
                this.size.width,
                this.size.height
            )

            ctx.restore() // Restores The Canvas State
        }

        // Unchanged Sprite
        else {
            ctx.drawImage(
                this.image,
                this.position.x - (this.size.width / 2),
                this.position.y - (this.size.height / 2),
                this.size.width,
                this.size.height
            )
        }

        // // Shows The Hitbox

        // ctx.strokeStyle = "red"

        // ctx.strokeRect(
        //     this.position.x - this.size.width / 2,
        //     this.position.y - this.size.height / 2,
        //     this.size.width,
        //     this.size.height
        // )

        // Health Bar

        if(!this.is_death) {
            const HEALTH_BAR_WIDTH:number = 100 // Defines The Width Of The Health Bar
            const HEALTH_BAR_HEIGHT:number = 5 // Defines The Height Of The Health Bar

            ctx.fillStyle = "black"

            // Creates The Health Bar Background
            ctx.fillRect(
                this.position.x - HEALTH_BAR_WIDTH / 2,
                this.position.y - this.size.height / 2 - HEALTH_BAR_HEIGHT - 5, 
                HEALTH_BAR_WIDTH, 
                HEALTH_BAR_HEIGHT
            )

            ctx.fillStyle = "red"

            // Creates The Health Bar Indicator
            ctx.fillRect(
                this.position.x - HEALTH_BAR_WIDTH / 2,
                this.position.y - this.size.height / 2 - HEALTH_BAR_HEIGHT - 5, 
                this.health, 
                HEALTH_BAR_HEIGHT
            )
        }
    }

    // Metdod For Execute Chase Of The Player
    private executeChase(player_dx:number, player_dy:number):void {
        this.is_biting = false // Stores The Information That The Pinky Isn't Biting
        this.is_moving = true // Stores The Information That The Pinky Is Moving

        const BUFFER:number = 20 // Sets The Distance From Where The Pinky's Direction Will Change
        const absolute_player_dx:number = Math.abs(player_dx) // Gets The Absolute Horizontal Player Distance
        const absolute_player_dy:number = Math.abs(player_dy) // Gets The Absolute Vertical Player Distance

        const previous_action = this.current_action // Stores The Previous Action

        // Decides The Move Action
        if(Math.abs(absolute_player_dx - absolute_player_dy) > BUFFER) {
            if(absolute_player_dx > absolute_player_dy) {
                if(player_dx > 0) this.current_action = "move_right" // Sets The Current Action
                else this.current_action = "move_left" // Sets The Current Action
            } 
            
            else {
                if(player_dy > 0) this.current_action = "move_down" // Sets The Current Action
                else this.current_action = "move_up" // Sets The Current Action
            }
        }

        // If The Action Has Changed
        if(previous_action !== this.current_action) {
            this.current_frame = 0 // Resets The Current Sprite Frame Value
            this.frames_counter = 0 // Resets The Frames Counter Value
        }

        if(this.current_action === "move_up") this.position.y -= this.velocity.y // Moves Up
        if(this.current_action === "move_left") this.position.x -= this.velocity.x // Moves To The Left
        if(this.current_action === "move_down") this.position.y += this.velocity.y // Moves Down
        if(this.current_action === "move_right") this.position.x += this.velocity.x // Moves To The Right
    }

    // Metdod For Execute Attack Of The Player
    private executeAttack(player_dx:number, player_dy:number, player_position:Position):void {
        this.is_moving = false // Stores The Information That The Pinky Isn't Moving
        
        if(this.current_action.startsWith("move_")) {
            this.is_biting = true // Stores The Information That The Pinky Is Biting
            this.has_dealt_damage = false // Resets The Has Dealt Damage Value

            const absolute_player_dx:number = Math.abs(player_dx) // Gets The Absolute Horizontal Player Distance
            const absolute_player_dy:number = Math.abs(player_dy) // Gets The Absolute Vertical Player Distance

            if(absolute_player_dx > absolute_player_dy) {
                if(player_dx > 0) this.current_action = "bite_down" // Sets The Current Action
                else this.current_action = "bite_down" // Sets The Current Action
            }
            
            else {
                if(player_dy > 0) this.current_action = "bite_up" // Sets The Current Action
                else this.current_action = "bite_up" // Sets The Current Action
            }

            this.current_frame = 0 // Resets The Current Sprite Frame Value
            this.frames_counter = 0 // Resets The Frames Counter Value
        }
    
        // Changes The Sprite Frame Only In Every Selected Period
        if(this.frames_counter % this.animation_slowdown_level === 0) {
            this.current_frame += 1 // Increases The Current Sprite Frame

            // When The Sprite Animation Has Finished
            if(this.current_frame >= this.max_frames) {
                if(this.is_biting) {
                    this.is_biting = false // Stores The Information That The Pinky Isn't Biting
                    this.has_dealt_damage = false // Resets The Has Dealt Damage Value

                    const current_player_dx:number = player_position.x - this.position.x // Gets The Horizontal Player Distance
                    const current_player_dy:number = player_position.y - this.position.y // Gets The Vertical Player Distance
                    
                    if(Math.abs(current_player_dx) > Math.abs(current_player_dy)) {
                        this.current_action = current_player_dx > 0 ? "move_right" : "move_left" // Sets The Current Action
                    }
                    
                    else {
                        this.current_action = current_player_dy > 0 ? "move_down" : "move_up" // Sets The Current Action
                    }

                    this.attack_cooldown_counter = this.attack_cooldown_max // Resets The Attack Cooldown Counter
                    this.current_frame = 0 // Resets The Current Sprite Frame Value
                    this.frames_counter = 0 // Resets The Frames Counter Value
                }

                else this.current_frame = 0 // Resets The Current Sprite Frame Value
            }
        }

        this.frames_counter += 1 // Increases The Frames Counter Value
    }

    // Method For Update The Pinky
    update(player_position:Position, is_player_death:boolean):void {
        const ATTACK_RANGE:number = 50 // Defines The Attack Range

        const player_dx:number = player_position.x - this.position.x // Gets The Horizontal Player Distance
        const player_dy:number = player_position.y - this.position.y // Gets The Vertical Player Distance
        const player_distance:number = Math.sqrt(player_dx * player_dx + player_dy * player_dy) // Gets The Player Distance

        if(this.attack_cooldown_counter > 0) {
            this.attack_cooldown_counter--
        }
        
        // If The Pinky Is Dying
        if(this.is_death) {
            // Changes The Sprite Frame Only In Every Selected Period
            if(this.frames_counter % this.animation_slowdown_level === 0) {
                this.current_frame += 1 // Increases The Current Sprite Frame

                // When The Sprite Animation Has Finished
                if(this.current_frame >= this.max_frames) {
                    this.current_frame = this.max_frames - 1 // Stays At The Last Frame
                }
            }

            this.frames_counter += 1 // Increases The Frames Counter Value
        }

        // If The Player Is Alive
        else if(!is_player_death) {
            // Chases The Player
            if(player_distance > ATTACK_RANGE) {
                this.executeChase(player_dx, player_dy) // Executes The Chase
                
                // Changes The Sprite Frame Only In Every Selected Period
                if(this.frames_counter % this.animation_slowdown_level === 0) {
                    this.current_frame += 1 // Increases The Current Sprite Frame
    
                    // When The Sprite Animation Has Finished
                    if(this.current_frame >= this.max_frames) {
                        this.current_frame = 0 // Resets The Current Sprite Frame Value
                    }
                }
    
                this.frames_counter += 1 // Increases The Frames Counter Value
            }
    
            // Attacks The Player
            else if(player_distance <= ATTACK_RANGE && this.attack_cooldown_counter === 0) {
                this.executeAttack(player_dx, player_dy, player_position) // Executes The Attack
            }
        }
        
        const MAIN_PATH:string = "../../textures/pinky/" // Defines The Main Sprite Path
        const sprite_data = pinky_sprites[this.current_action as keyof typeof pinky_sprites] // Loads Sprites For The Current Action

        if(this.current_frame >= sprite_data.frames.length) this.current_frame = 0 // Resets The Current Sprite Frame Value

        const next_source:string = `${MAIN_PATH + sprite_data.frames[this.current_frame]}.png` // Gets The Next Image Source

        this.max_frames = sprite_data.frames.length // Updates The Amount Of Maximum Sprite Frames
        this.is_mirrored = sprite_data.mirrored // Updates The Information If The Sprite Is Mirrored

        // Updates The Image Source Only If Differs
        if(!this.image.src.endsWith(`${sprite_data.frames[this.current_frame]}.png`)) {
            this.image.src = next_source 
        }
    }

    // Method For Obtain The Hit
    gotHit():void {
        this.health -= 25 // Decreases The Health

        // When The Health Gets To 0
        if(this.health <= 0) {
            const DEATHS:string[] = ["death"] // Stores The Possible Death Actions

            this.is_moving = false // Stores The Information That The Pinky Isn't Moving
            this.is_biting = false // Stores The Information That The Pinky Isn't Biting
            this.is_death = true // Stores The Information That The Pinky Is Dying
            this.current_frame = 0 // Resets The Current Sprite Frame Value
            this.frames_counter = 0 // Resets The Frames Counter Value
            this.current_action = DEATHS[Math.floor(Math.random() * DEATHS.length)] as string // Sets The Current Action
        }
    }
}