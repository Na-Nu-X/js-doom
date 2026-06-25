import { imp as imp_sprites } from "./data.js";
export class Imp {
    position;
    velocity;
    scale;
    image;
    size;
    current_frame;
    max_frames;
    is_mirrored;
    frames_counter;
    last_used_sprite;
    // private is_shooting:boolean
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.scale = 2;
        this.image = new Image();
        this.image.src = "../../textures/imp/TROOA1.png";
        this.size = {
            width: this.image.width * this.scale,
            height: this.image.height * this.scale
        };
        this.current_frame = 0; // Sets The Initial Current Sprite Frame
        this.max_frames = imp_sprites.move_down.frames.length; // Sets The Default Amount Of Maximum Sprite Frames
        this.is_mirrored = false; // Sets The Default Information If The Sprite Is Mirrored
        this.frames_counter = 0; // Sets The Initial Frames Counter Value
        this.last_used_sprite = ""; // Stores The Last Used Sprite
        // this.is_shooting = false // Checks If The Imp Is Shooting
    }
    // Method For Draw The Imp
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
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.position.x - this.size.width / 2, this.position.y - this.size.height / 2, this.size.width, this.size.height);
    }
    // Method For Change The Image
    changeImage(image_set) {
        const MAIN_PATH = "../../textures/imp/"; // Defines The Main Path
        if (this.last_used_sprite !== image_set) {
            this.current_frame = 0; // Resets The Current Sprite Frame
            this.frames_counter = 0; // Resets The Frame Counter
        }
        this.last_used_sprite = image_set; // Sets The Last Used Sprite
        switch (image_set) {
            case "move_up":
                this.max_frames = imp_sprites.move_up.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + imp_sprites.move_up.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = imp_sprites.move_up.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
            case "move_left":
                this.max_frames = imp_sprites.move_left.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + imp_sprites.move_left.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = imp_sprites.move_left.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
            case "move_down":
                this.max_frames = imp_sprites.move_down.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + imp_sprites.move_down.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = imp_sprites.move_down.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
            case "move_right":
                this.max_frames = imp_sprites.move_right.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + imp_sprites.move_right.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = imp_sprites.move_right.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
            case "shoot_up":
                this.max_frames = imp_sprites.shoot_up.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + imp_sprites.shoot_up.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = imp_sprites.shoot_up.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
            case "shoot_left":
                console.log(this.current_frame);
                this.max_frames = imp_sprites.shoot_left.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + imp_sprites.shoot_left.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = imp_sprites.shoot_left.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
            case "shoot_down":
                this.max_frames = imp_sprites.shoot_down.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + imp_sprites.shoot_down.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = imp_sprites.shoot_down.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
            case "shoot_right":
                this.max_frames = imp_sprites.shoot_right.frames.length; // Sets The Amount Of Maximum Sprite Frames
                this.image.src = `${MAIN_PATH + imp_sprites.shoot_right.frames[this.current_frame]}.png`; // Replaces The Image With A Current Frame
                this.is_mirrored = imp_sprites.shoot_right.mirrored; // Stores The Information If The Current Sprite Is Mirrored
                break;
        }
        if (this.current_frame < this.max_frames - 1) {
            if (this.frames_counter % 4 === 0)
                this.current_frame += 1; // Increases The Current Sprite Frame
        }
        else {
            this.current_frame = 0; // Resets The Current Sprite Frame
        }
        this.frames_counter += 1; // Increases The Frames Counter
    }
    // Method For Move Up The Imp
    moveUp() {
        // this.is_shooting = false // Stores The Information About Imp Isn't Shooting
        this.position.y -= this.velocity.x;
        this.changeImage("move_up");
    }
    // Method For Move Left The Imp
    moveLeft() {
        // this.is_shooting = false // Stores The Information About Imp Isn't Shooting
        this.position.x -= this.velocity.x;
        this.changeImage("move_left");
    }
    // Method For Move Down The Imp
    moveDown() {
        // this.is_shooting = false // Stores The Information About Imp Isn't Shooting
        this.position.y += this.velocity.x;
        this.changeImage("move_down");
    }
    // Method For Move Right The Imp
    moveRight() {
        // this.is_shooting = false // Stores The Information About Imp Isn't Shooting
        this.position.x += this.velocity.x;
        this.changeImage("move_right");
    }
    // Method For Shooting
    shoot() {
        // this.is_shooting = true // Stores The Information About Imp's Shooting
        if (this.last_used_sprite === "move_up" || this.last_used_sprite === "shoot_up")
            this.changeImage("shoot_up");
        if (this.last_used_sprite === "move_left" || this.last_used_sprite === "shoot_left")
            this.changeImage("shoot_left");
        if (this.last_used_sprite === "move_down" || this.last_used_sprite === "shoot_down")
            this.changeImage("shoot_down");
        if (this.last_used_sprite === "move_right" || this.last_used_sprite === "shoot_right")
            this.changeImage("shoot_right");
    }
}
//# sourceMappingURL=Imp.js.map