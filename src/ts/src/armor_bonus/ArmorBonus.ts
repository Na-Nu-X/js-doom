import { armor_bonus as armor_bonus_sprites } from "./data.js"

import type { 
    Position,
    Size
} from "../doomguy/Doomguy.js"

interface ArmorBonusConfig {
    position:Position,
    animation_slowdown_level:number
}

export class ArmorBonus {
    position:Position
    animation_slowdown_level:number
    size:Size

    private scale:number
    private image:HTMLImageElement
    private current_frame:number
    private max_frames:number
    private frames_counter:number
    private current_action:string

    constructor({
        position,
        animation_slowdown_level
    }:ArmorBonusConfig) {
        this.position = position
        this.animation_slowdown_level = animation_slowdown_level // Sets The Level Of Animation Slowdown

        this.scale = 2

        this.image = new Image()
        this.image.src = "../../textures/armor_bonus/BON2A0.png"

        // Sets The Size
        this.size = {
            width: this.image.width * this.scale,
            height: this.image.height * this.scale
        }

        this.current_frame = 0 // Sets The Initial Current Sprite Frame
        this.max_frames = armor_bonus_sprites.armor_bonus.frames.length // Sets The Default Amount Of Maximum Sprite Frames
        this.frames_counter = 0 // Sets The Initial Frames Counter Value

        this.current_action = "armor_bonus" // Stores The Current Used Sprite
    }
    
    // Method For Draw The Armor Bonus
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

    // Method For Update The Armor Bonus
    update(ctx:CanvasRenderingContext2D) {
        this.draw(ctx) // Draws The Armor Bonus

        const MAIN_PATH:string = "../../textures/armor_bonus/" // Defines The Main Sprite Path
        const sprite_data = armor_bonus_sprites[this.current_action as keyof typeof armor_bonus_sprites] // Loads Sprites For The Current Action
        const next_image_source:string = `${MAIN_PATH + sprite_data.frames[this.current_frame]}.png` // Gets The Next Image Source

        this.max_frames = sprite_data.frames.length // Updates The Amount Of Maximum Sprite Frames
        this.image.src = next_image_source // Updates The Image Source

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
}