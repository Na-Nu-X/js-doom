import { DoomFont } from "../Font/DoomFont.js"

const doom_font = new DoomFont()

export class Map {
    private image:HTMLImageElement

    constructor({
        
    }) {
        this.image = new Image()
        this.image.src = "../../textures/map_1.png"
    }
    
    // Method For Draw The Map
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
        const start_text:string = "Press Any Key To Start." // Sets The Text
        const scale:number = 4 // Sets The Scale Of Text
        const start_text_width:number = doom_font.getTextWidth(start_text, scale) // Gets The Width Of Text

        doom_font.drawText(ctx, start_text, (window.innerWidth / 2) - (start_text_width / 2), (window.innerHeight / 2) - ((14 * scale) / 2), scale) // Draws The Text
    }

    // Method For Show Death UI
    showDeathUI(ctx:CanvasRenderingContext2D):void {
        const death_text:string = "You Are Death!" // Sets The Text
        const restart_text:string = "Press Any Key To Restart." // Sets The Text

        const scale:number = 4 // Sets The Scale Of Text

        const death_text_width:number = doom_font.getTextWidth(death_text, scale) // Gets The Width Of Text
        const restart_text_width:number = doom_font.getTextWidth(restart_text, scale) // Gets The Width Of Text

        doom_font.drawText(ctx, death_text, (window.innerWidth / 2) - (death_text_width / 2), (window.innerHeight / 2) - ((14 * scale) / 2), scale) // Draws The Text
        doom_font.drawText(ctx, restart_text, (window.innerWidth / 2) - (restart_text_width / 2), (window.innerHeight / 2) + ((14 * scale) / 2), scale) // Draws The Text
    }
}