export class DoomFont {
    private font_images:Map<string, HTMLImageElement> = new Map() // Stores Image For Each Character
    public is_loaded:boolean = false // Stores The Information If All Font Images Are Loaded

    constructor() {
        this.preloadFont() // Preloads The Font
    }

    // Method For Preload The Font
    private async preloadFont():Promise<void> {
        const ALLOWED_CHARACTERS:string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?-+=".split("") // Stores All Allowed Characters
        const MAIN_PATH:string = "../../textures/font/" // Defines The Main Sprite Path

        const loaded_characters:Promise<void>[] = ALLOWED_CHARACTERS.map((one_character:string) => {
            return new Promise<void>((resolve) => {
                const image:HTMLImageElement = new Image() // Creates The Image
                const ascii_character:string = one_character.charCodeAt(0).toString().padStart(3, "0") // Gets The ASCII Character For Every Allowed Character (For Example: 65 -> A)
                
                image.src = `${MAIN_PATH}STCFN${ascii_character}.png` // Sets The Image Source

                image.onload = () => {
                    this.font_images.set(one_character, image) // Adds The Image To The Font Images Map
                    resolve()
                }
                
                image.onerror = () => resolve() // Do Nothing If Some Image Is Missing
            })
        })

        await Promise.all(loaded_characters)
        this.is_loaded = true // Stores The Information That The Font Is Fully Loaded
    }

    // Method For Draw The Text
    public drawText(ctx:CanvasRenderingContext2D, text:string, x:number, y:number, scale = 4):void {
        if(!this.is_loaded) return // Do Nothing If The Font Isn't Loaded

        let current_x:number = x // Stores The Current X Position
        const uppercase_text:string = text.toUpperCase() // Converts The Text To Uppercase Style

        for(const one_character of uppercase_text) {
            // Space
            if(one_character === " ") {
                current_x += 8 * scale // Moves The Cursor Forwards
                continue
            }

            const image:HTMLImageElement|null = this.font_images.get(one_character) || null // Gets The Image Of The Character

            if(image) {
                // Shows The Character
                ctx.drawImage(
                    image,
                    current_x,
                    y,
                    image.width * scale,
                    image.height * scale
                )
                
                current_x += (image.width + 1) * scale // Moves The Cursor Forwards
            }
        }
    }

    // Method For Get The Width Of Text
    public getTextWidth(text:string, scale = 4):number {
        if(!this.is_loaded) return 0 // Returns 0 If The Font Isn't Loaded
    
        let total_width:number = 0 // Stores The Total Width Of Text
        const uppercase_text = text.toUpperCase() // Converts The Text To Uppercase Style
    
        for(const one_character of uppercase_text) {
            // Space
            if(one_character === " ") {
                total_width += 8 * scale // Increases The Total Width
                continue
            }
    
            const image:HTMLImageElement|null = this.font_images.get(one_character) || null // Gets The Image Of The Character

            if(image) total_width += (image.width + 1) * scale // Increases The Total Width
        }
    
        return total_width // Returns The Total Width Of Text
    }
}