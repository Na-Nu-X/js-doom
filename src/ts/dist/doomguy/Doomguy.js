import { doomguy_textures } from "./data.js";
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
        this.max_frames = doomguy_textures.move_backward.frames.length; // Sets The Default Amount Of Maximum Sprite Frames
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
            case "move_forward":
                this.max_frames = doomguy_textures.move_forward.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + doomguy_textures.move_forward.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = doomguy_textures.move_forward.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
            case "move_left":
                this.max_frames = doomguy_textures.move_left.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + doomguy_textures.move_left.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = doomguy_textures.move_left.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
            case "move_backward":
                this.max_frames = doomguy_textures.move_backward.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + doomguy_textures.move_backward.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = doomguy_textures.move_backward.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
            case "move_right":
                this.max_frames = doomguy_textures.move_right.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + doomguy_textures.move_right.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = doomguy_textures.move_right.mirrored; // Stores The Information If The Current Sprite Is Mirrored
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
    // Method For Move Forward The Doomguy
    moveForward() {
        this.position.y -= this.velocity.x;
        this.changeImage("move_forward");
    }
    // Method For Move Left The Doomguy
    moveLeft() {
        this.position.x -= this.velocity.x;
        this.changeImage("move_left");
    }
    // Method For Move Backward The Doomguy
    moveBackward() {
        this.position.y += this.velocity.x;
        this.changeImage("move_backward");
    }
    // Method For Move Right The Doomguy
    moveRight() {
        this.position.x += this.velocity.x;
        this.changeImage("move_right");
    }
}
//# sourceMappingURL=Doomguy.js.map