import { explosive_barrel as explosive_barrel_sprites } from "./data.js"

import type { 
    Position, 
    Size
} from "../doomguy/Doomguy.js"

interface ExplosiveBarrelConfig {
    position:Position,
    animation_slowdown_level:number
}

export class ExplosiveBarrel {
    position:Position
    animation_slowdown_level:number
    size:Size
    current_action:string
    is_exploded:boolean
    can_be_removed:boolean
    
    private scale:number
    private image:HTMLImageElement
    private current_frame:number
    private max_frames:number
    private frames_counter:number
    private health:number
    private last_image_source:string

    constructor({
        position,
        animation_slowdown_level
    }:ExplosiveBarrelConfig) {
        this.position = position
        this.animation_slowdown_level = animation_slowdown_level // Sets The Level Of Animation Slowdown
        
        this.scale = 2

        this.image = new Image()
        this.image.src = "../../textures/explosive_barrel/BAR1A0.png"

        this.size = {
            width: this.image.width * this.scale,
            height: this.image.height * this.scale
        }

        this.current_frame = 0 // Sets The Initial Current Sprite Frame
        this.max_frames = explosive_barrel_sprites.explosive_barrel.frames.length // Sets The Default Amount Of Maximum Sprite Frames
        this.frames_counter = 0 // Sets The Initial Frames Counter Value

        this.current_action = "explosive_barrel" // Stores The Current Used Sprite

        this.last_image_source = "../../textures/explosive_barrel/BAR1A0.png" // Stores The Last Image Source

        this.health = 100 // Stores The Health Amount
        this.is_exploded = false // Checks If The Explosive Barrel Is Dying
        this.can_be_removed = false // Stores The Information If The Explosive Barrel Can Be Removed
    }

    // Method For Draw The Explosive Barrel
    private draw(ctx:CanvasRenderingContext2D):void {
        if(!this.image.complete) return // Do Nothing If The Image Isn't Fully Loaded

        this.size.width = this.image.width * this.scale // Sets The Hitbox Width
        this.size.height = this.image.height * this.scale // Sets The Hitbox Height

        // Shows The Sprite

        ctx.drawImage(
            this.image,
            this.position.x - (this.size.width / 2),
            this.position.y - (this.size.height / 2),
            this.size.width,
            this.size.height
        )
    }

    // Method For Update The Explosive Barrel
    update(ctx:CanvasRenderingContext2D) {
        this.draw(ctx) // Draws The Explosive Barrel

        const MAIN_PATH:string = "../../textures/explosive_barrel/" // Defines The Main Sprite Path
        const sprite_data = explosive_barrel_sprites[this.current_action as keyof typeof explosive_barrel_sprites] // Loads Sprites For The Current Action
        const next_image_source:string = `${MAIN_PATH + sprite_data.frames[this.current_frame]}.png` // Gets The Next Image Source

        this.max_frames = sprite_data.frames.length // Updates The Amount Of Maximum Sprite Frames

        if(this.last_image_source !== next_image_source) {
            this.image.src = next_image_source // Updates The Image Source Only If Differs
            this.last_image_source = next_image_source // Updates The Last Image Source
        }

        // If The Explosive Barrel Isn't Exploded
        if(!this.is_exploded) {
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

        // If The Explosive Barrel Is Exploded
        else if(this.is_exploded) {
            // Changes The Sprite Frame Only In Every Selected Period
            if(this.frames_counter % this.animation_slowdown_level === 0) {
                this.current_frame += 1 // Increases The Current Sprite Frame

                // When The Sprite Animation Has Finished
                if(this.current_frame >= this.max_frames) {
                    this.can_be_removed = true // Stores The Information That The Explosive Barrel Can Be Removed
                }
            }

            this.frames_counter += 1 // Increases The Frames Counter Value
        }
    }

    // Method For Obtain The Hit
    gotHit():void {
        this.health -= 50 // Decreases The Health

        // When The Health Gets To 0
        if(this.health <= 0) {
            this.animation_slowdown_level = 30 // Makes The Explosion Animation Faster
            this.is_exploded = true // Stores The Information That The Explosive Barrel Is Exploded
            this.current_frame = 0 // Resets The Current Sprite Frame Value
            this.frames_counter = 0 // Resets The Frames Counter Value
            this.current_action = "explosion" // Sets The Current Action
        }
    }
}