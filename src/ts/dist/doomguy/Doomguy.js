import { doomguy as doomguy_sprites } from "./data.js";
export class Doomguy {
    position;
    velocity;
    scale;
    image;
    size;
    current_frame;
    max_frames;
    is_mirrored;
    frame_counter;
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.scale = 2;
        this.image = new Image();
        this.image.src = "../../textures/doomguy/PLAYA1.png";
        this.size = {
            width: this.image.width * this.scale,
            height: this.image.height * this.scale
        };
        this.current_frame = 0; // Sets The Initial Current Sprite Frame
        this.max_frames = doomguy_sprites.move_down.frames.length; // Sets The Default Amount Of Maximum Sprite Frames
        this.is_mirrored = false; // Sets The Default Information If The Sprite Is Mirrored
        this.frame_counter = 0; // Sets The Initial Frame Counter Value
    }
    // Method For Draw The Doomguy
    draw(ctx) {
        if (!this.image.complete)
            return; // Do Nothing If The Image Isn't Fully Loaded
        this.size.width = this.image.width * this.scale; // Sets The Hitbox Width
        this.size.height = this.image.height * this.scale; // Sets The Hitbox Height
        // Shows The Sprite
        // Mirrored Sprite
        if (this.is_mirrored) {
            ctx.save(); // Saves The Current Canvas State
            ctx.scale(-1, 1); // Inverts The X Axis
            ctx.drawImage(this.image, -this.position.x - (this.size.width / 2), this.position.y - (this.size.height / 2), this.size.width, this.size.height);
            ctx.restore(); // Restores The Canvas State
        }
        // Unchanged Sprite
        else {
            ctx.drawImage(this.image, this.position.x - (this.size.width / 2), this.position.y - (this.size.height / 2), this.size.width, this.size.height);
        }
        // Shows The Hitbox
        // ctx.strokeStyle = "red"
        // ctx.strokeRect(
        //     this.position.x - (this.size.width / 2),
        //     this.position.y - (this.size.height / 2),
        //     this.size.width,
        //     this.size.height
        // )
    }
    // Method For Change The Image
    changeImage(image_set) {
        const MAIN_PATH = "../../textures/doomguy/"; // Defines The Main Path
        switch (image_set) {
            case "move_up":
                this.max_frames = doomguy_sprites.move_up.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + doomguy_sprites.move_up.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = doomguy_sprites.move_up.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
            case "move_left":
                this.max_frames = doomguy_sprites.move_left.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + doomguy_sprites.move_left.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = doomguy_sprites.move_left.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
            case "move_down":
                this.max_frames = doomguy_sprites.move_down.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + doomguy_sprites.move_down.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = doomguy_sprites.move_down.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
            case "move_right":
                this.max_frames = doomguy_sprites.move_right.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + doomguy_sprites.move_right.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = doomguy_sprites.move_right.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
        }
        if (this.current_frame < this.max_frames - 1) {
            if (this.frame_counter % 4 === 0)
                this.current_frame += 1; // Increases The Current Sprite Frame
        }
        else {
            this.current_frame = 0; // Resets The Current Sprite Frame
        }
        this.frame_counter += 1; // Increases The Frame Counter
    }
    // Method For Move Up The Doomguy
    moveUp() {
        this.position.y -= this.velocity.x;
        this.changeImage("move_up");
    }
    // Method For Move Left The Doomguy
    moveLeft() {
        this.position.x -= this.velocity.x;
        this.changeImage("move_left");
    }
    // Method For Move Down The Doomguy
    moveDown() {
        this.position.y += this.velocity.x;
        this.changeImage("move_down");
    }
    // Method For Move Right The Doomguy
    moveRight() {
        this.position.x += this.velocity.x;
        this.changeImage("move_right");
    }
    // Method For Shooting
    shoot() {
        console.log("SHOOT");
    }
}
//# sourceMappingURL=Doomguy.js.map