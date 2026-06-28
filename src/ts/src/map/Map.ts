import { DoomFont } from "../Font/DoomFont.js"

const doom_font = new DoomFont()

export class Map {
    private image:HTMLImageElement

    constructor({
        
    }) {
        this.image = new Image()
        this.image.src = "../../textures/map_1.png"
    }
    
    // Method For Draw The Doomguy
    draw(ctx:CanvasRenderingContext2D):void {
        if(!this.image.complete) return // Do Nothing If The Image Isn't Fully Loaded

        // Shows The Background

        ctx.drawImage(
            this.image,
            0,
            0
        )
    }

    // Method For Show Start UI
    showStartUI(ctx:CanvasRenderingContext2D):void {
        const text:string = "Press Any Key To Start." // Sets The Text
        const scale:number = 4 // Sets The Scale Of Text
        const text_width:number = doom_font.getTextWidth(text, scale) // Gets The Width Of Text

        doom_font.drawText(ctx, text, (window.innerWidth / 2) - (text_width / 2), (window.innerHeight / 2) - ((14 * scale) / 2), scale) // Draws The Text
    }

    // Method For Show Death UI
    showDeathUI(ctx:CanvasRenderingContext2D):void {
        const text:string = "You Are Death!" // Sets The Text
        const scale:number = 4 // Sets The Scale Of Text
        const text_width:number = doom_font.getTextWidth(text, scale) // Gets The Width Of Text

        doom_font.drawText(ctx, text, (window.innerWidth / 2) - (text_width / 2), (window.innerHeight / 2) - ((14 * scale) / 2), scale) // Draws The Text
    }
}