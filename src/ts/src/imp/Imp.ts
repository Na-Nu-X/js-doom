import { imp as imp_sprites } from "./data.js"

import type { 
    Position, 
    Size, 
    Velocity 
} from "../doomguy/Doomguy.js"

interface ImpConfig {
    position:Position,
    velocity:Velocity,
    animation_slowdown_level:number,
    is_moving:boolean,
}

interface FireballConfig {
    position:Position,
    velocity?:Velocity,
    size?:Size,
    direction:string
}

export class Imp {
    position:Position
    velocity:Velocity
    animation_slowdown_level:number
    is_moving:boolean
    size:Size
    is_shooting:boolean
    current_action:string
    health:number

    private scale:number
    private image:HTMLImageElement
    private current_frame:number
    private max_frames:number
    private is_mirrored:boolean
    private frames_counter:number
    private shoot_loops:number
    private is_dying:boolean

    constructor({
        position,
        velocity,
        animation_slowdown_level
    }:ImpConfig) {
        this.position = position
        this.velocity = velocity
        this.animation_slowdown_level = animation_slowdown_level // Sets The Level Of Animation Slowdown
        this.is_moving = false // Stores The Information If The Imp Is Moving

        this.scale = 2

        this.image = new Image()
        this.image.src = "../../textures/imp/TROOA1.png"

        this.size = {
            width: this.image.width * this.scale,
            height: this.image.height * this.scale
        }

        this.current_frame = 0 // Sets The Initial Current Sprite Frame
        this.max_frames = imp_sprites.move_down.frames.length // Sets The Default Amount Of Maximum Sprite Frames
        this.is_mirrored = false // Sets The Default Information If The Sprite Is Mirrored
        this.frames_counter = 0 // Sets The Initial Frames Counter Value

        this.current_action = "move_down" // Stores The Current Used Sprite

        this.is_shooting = false // Checks If The Imp Is Shooting
        this.shoot_loops = 0 // Stores The Amount Of Current Shooting Animation's Repetitions

        this.health = 100 // Stores The Health Amount
        this.is_dying = false // Checks If The Imp Is Dying
    }
    
    // Method For Draw The Imp
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

        if(!this.is_dying) {
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

    // Method For Update The Imp
    update():void {
        const MAIN_PATH:string = "../../textures/imp/" // Defines The Main Sprite Path
        const sprite_data = imp_sprites[this.current_action as keyof typeof imp_sprites] // Loads Sprites For The Current Action
        const next_source:string = `${MAIN_PATH + sprite_data.frames[this.current_frame]}.png` // Gets The Next Image Source

        this.max_frames = sprite_data.frames.length // Updates The Amount Of Maximum Sprite Frames
        this.is_mirrored = sprite_data.mirrored // Updates The Information If The Sprite Is Mirrored

        if(this.image.src !== next_source) this.image.src = next_source // Updates The Image Source Only If Differs

        // If The Imp Is Moving Or Shooting
        if(this.is_moving || this.is_shooting) {
            // Changes The Sprite Frame Only In Every Selected Period
            if(this.frames_counter % this.animation_slowdown_level === 0) {
                this.current_frame += 1 // Increases The Current Sprite Frame

                // When The Sprite Animation Has Finished
                if(this.current_frame >= this.max_frames) {
                    // Handles The Shooting Animation Loop
                    if(this.is_shooting) {
                        const REPEAT_TIMES:number = 3 // Sets The Amount Of Shooting Animation's Repetitions

                        this.shoot_loops += 1 // Increases The Amount Of Current Shooting Animation's Repetitions

                        // Ends The Shooting Animation When The Shooting Animation Reached The Maximum Amount Of Loops
                        if(this.shoot_loops >= REPEAT_TIMES) {
                            this.is_shooting = false // Stores The Information That The Imp Isn't Shooting
                            this.current_action = this.current_action.replace("shoot", "move") // Replaces The Shoot Action With The Move Action
                            this.current_frame = 0 // Resets The Current Sprite Frame Value
                        }
                        
                        else this.current_frame = 0 // Resets The Current Sprite Frame Value
                    } 
                    
                    else this.current_frame = 0 // Resets The Current Sprite Frame Value
                }
            }

            this.frames_counter += 1 // Increases The Frames Counter Value
        }

        // If The Imp Is Dying
        else if(this.is_dying) {
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
        
        // If The Imp Is Standing
        else {
            this.current_frame = 0 // Resets The Current Sprite Frame Value
            this.frames_counter = 0 // Resets The Frames Counter Value
        }
    }

    // Method For Move Up The Imp
    moveUp():void {
        this.position.y -= this.velocity.x // Moves Up
        this.is_moving = true // Stores The Information That The Imp Is Moving
        if(!this.is_shooting) this.current_action = "move_up" // Sets The Current Action
    }

    // Method For Move Left The Imp
    moveLeft():void {
        this.position.x -= this.velocity.x // Moves To The Left
        this.is_moving = true // Stores The Information That The Imp Is Moving
        if(!this.is_shooting) this.current_action = "move_left" // Sets The Current Action
    }

    // Method For Move Down The Imp
    moveDown():void {
        this.position.y += this.velocity.x // Moves Down
        this.is_moving = true // Stores The Information That The Imp Is Moving
        if(!this.is_shooting) this.current_action = "move_down" // Sets The Current Action
    }

    // Method For Move Right The Imp
    moveRight():void {
        this.position.x += this.velocity.x // Moves To The Right
        this.is_moving = true // Stores The Information That The Imp Is Moving
        if(!this.is_shooting) this.current_action = "move_right" // Sets The Current Action
    }

    // Method For Shooting
    shoot():void {
        // If The Imp Isn't Shooting
        if(!this.is_shooting) {
            this.is_shooting = true // Stores The Information That The Imp Is Shooting
            this.shoot_loops = 0 // Resets The Amount Of Current Shooting Animation's Repetitions
            this.current_frame = 0 // Resets The Current Sprite Frame Value
            this.frames_counter = 0 // Resets The Frames Counter Value

            if(this.current_action.startsWith("move")) this.current_action = this.current_action.replace("move", "shoot") // Replaces The Move Action With The Shoot Action
        }
    }

    // Method For Obtain The Hit
    gotHit():void {
        this.health -= 50

        // When The Health Gets To 0
        if(this.health <= 0) {
            const DEATHS:string[] = ["death", "explode_death"] // Stores The Possible Death Actions

            this.is_moving = false // Stores The Information That The Imp Isn't Moving
            this.is_shooting = false // Stores The Information That The Imp Isn't Shooting
            this.is_dying = true // Stores The Information That The Imp Is Dying
            this.current_action = DEATHS[Math.floor(Math.random() * DEATHS.length)] as string // Sets The Current Action
        }
    }
}

export class Fireball {
    position:Position
    velocity:Velocity
    size:Size
    direction:string

    constructor({
        position,
        velocity,
        size,
        direction
    }:FireballConfig) {
        this.position = position

        // Sets The Movement Speed
        this.velocity = { 
            x: 10,
            y: 10
        },

        // Sets The Size
        this.size = {
            width: 10,
            height: 10
        }

        this.direction = direction
    }

    // Method For Draw The Fireball
    draw(ctx:CanvasRenderingContext2D):void {
        ctx.fillStyle = "red"

        ctx.fillRect(
            this.position.x - this.size.width / 2,
            this.position.y - this.size.height / 2,
            this.size.width,
            this.size.height
        )
    }

    // Method For Update The Fireball
    update():void {
        if(this.direction === "shoot_up") this.position.y -= this.velocity.y
        if(this.direction === "shoot_left") this.position.x -= this.velocity.x
        if(this.direction === "shoot_down") this.position.y += this.velocity.y
        if(this.direction === "shoot_right") this.position.x += this.velocity.x
    }
}