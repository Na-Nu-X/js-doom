import { doomguy as doomguy_sprites } from "./data.js";
import { shot_decal as shot_decal_sprites } from "./data.js";
export class Doomguy {
    position;
    velocity;
    animation_slowdown_level;
    is_moving;
    size;
    is_shooting;
    current_action;
    health;
    scale;
    image;
    current_frame;
    max_frames;
    is_mirrored;
    frames_counter;
    shoot_loops;
    last_image_source;
    constructor({ position, velocity, animation_slowdown_level }) {
        this.position = position;
        this.velocity = velocity;
        this.animation_slowdown_level = animation_slowdown_level; // Sets The Level Of Animation Slowdown
        this.is_moving = false; // Stores The Information If The Doomguy Is Moving
        this.scale = 2;
        this.image = new Image();
        this.image.src = "../../textures/doomguy/PLAYA1.png";
        // Sets The Size
        this.size = {
            width: this.image.width * this.scale,
            height: this.image.height * this.scale
        };
        this.current_frame = 0; // Sets The Initial Current Sprite Frame
        this.max_frames = doomguy_sprites.move_down.frames.length; // Sets The Default Amount Of Maximum Sprite Frames
        this.is_mirrored = false; // Sets The Default Information If The Sprite Is Mirrored
        this.frames_counter = 0; // Sets The Initial Frames Counter Value
        this.current_action = "move_down"; // Stores The Current Used Sprite
        this.is_shooting = false; // Checks If The Doomguy Is Shooting
        this.shoot_loops = 0; // Stores The Amount Of Current Shooting Animation's Repetitions
        this.last_image_source = "../../textures/doomguy/PLAYA1.png"; // Stores The Last Image Source
        this.health = 100; // Stores The Health Amount
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
        // // Shows The Hitbox
        // ctx.strokeStyle = "red"
        // ctx.strokeRect(
        //     this.position.x - this.size.width / 2,
        //     this.position.y - this.size.height / 2,
        //     this.size.width,
        //     this.size.height
        // )
        // Health Bar
        const HEALTH_BAR_WIDTH = 100; // Defines The Width Of The Health Bar
        const HEALTH_BAR_HEIGHT = 5; // Defines The Height Of The Health Bar
        ctx.fillStyle = "black";
        // Creates The Health Bar Background
        ctx.fillRect(this.position.x - HEALTH_BAR_WIDTH / 2, this.position.y - this.size.height / 2 - HEALTH_BAR_HEIGHT - 5, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
        ctx.fillStyle = "red";
        // Creates The Health Bar Indicator
        ctx.fillRect(this.position.x - HEALTH_BAR_WIDTH / 2, this.position.y - this.size.height / 2 - HEALTH_BAR_HEIGHT - 5, this.health, HEALTH_BAR_HEIGHT);
    }
    // Method For Update The Doomguy
    update() {
        const MAIN_PATH = "../../textures/doomguy/"; // Defines The Main Sprite Path
        const sprite_data = doomguy_sprites[this.current_action]; // Loads Sprites For The Current Action
        const next_image_source = `${MAIN_PATH + sprite_data.frames[this.current_frame]}.png`; // Gets The Next Image Source
        this.max_frames = sprite_data.frames.length; // Updates The Amount Of Maximum Sprite Frames
        this.is_mirrored = sprite_data.mirrored; // Updates The Information If The Sprite Is Mirrored
        if (this.last_image_source !== next_image_source) {
            this.image.src = next_image_source; // Updates The Image Source Only If Differs
            this.last_image_source = next_image_source; // Updates The Last Image Source
        }
        // If The Doomguy Is Moving Or Shooting
        if (this.is_moving || this.is_shooting) {
            // Changes The Sprite Frame Only In Every Selected Period
            if (this.frames_counter % this.animation_slowdown_level === 0) {
                this.current_frame += 1; // Increases The Current Sprite Frame
                // When The Sprite Animation Has Finished
                if (this.current_frame >= this.max_frames) {
                    // Handles The Shooting Animation Loop
                    if (this.is_shooting) {
                        const REPEAT_TIMES = 3; // Sets The Amount Of Shooting Animation's Repetitions
                        this.shoot_loops += 1; // Increases The Amount Of Current Shooting Animation's Repetitions
                        // Ends The Shooting Animation When The Shooting Animation Reached The Maximum Amount Of Loops
                        if (this.shoot_loops >= REPEAT_TIMES) {
                            this.is_shooting = false; // Stores The Information That The Doomguy Isn't Shooting
                            this.current_action = this.current_action.replace("shoot", "move"); // Replaces The Shoot Action With The Move Action
                            this.current_frame = 0; // Resets The Current Sprite Frame Value
                        }
                        else
                            this.current_frame = 0; // Resets The Current Sprite Frame Value
                    }
                    else
                        this.current_frame = 0; // Resets The Current Sprite Frame Value
                }
            }
            this.frames_counter += 1; // Increases The Frames Counter Value
        }
        // If The Doomguy Is Standing
        else {
            this.current_frame = 0; // Resets The Current Sprite Frame Value
            this.frames_counter = 0; // Resets The Frames Counter Value
        }
    }
    // Method For Move Up The Doomguy
    moveUp() {
        this.position.y -= this.velocity.x; // Moves Up
        this.is_moving = true; // Stores The Information That The Doomguy Is Moving
        if (!this.is_shooting)
            this.current_action = "move_up"; // Sets The Current Action
    }
    // Method For Move Left The Doomguy
    moveLeft() {
        this.position.x -= this.velocity.x; // Moves To The Left
        this.is_moving = true; // Stores The Information That The Doomguy Is Moving
        if (!this.is_shooting)
            this.current_action = "move_left"; // Sets The Current Action
    }
    // Method For Move Down The Doomguy
    moveDown() {
        this.position.y += this.velocity.x; // Moves Down
        this.is_moving = true; // Stores The Information That The Doomguy Is Moving
        if (!this.is_shooting)
            this.current_action = "move_down"; // Sets The Current Action
    }
    // Method For Move Right The Doomguy
    moveRight() {
        this.position.x += this.velocity.x; // Moves To The Right
        this.is_moving = true; // Stores The Information That The Doomguy Is Moving
        if (!this.is_shooting)
            this.current_action = "move_right"; // Sets The Current Action
    }
    // Method For Shooting
    shoot() {
        // If The Doomguy Isn't Shooting
        if (!this.is_shooting) {
            this.is_shooting = true; // Stores The Information That The Doomguy Is Shooting
            this.shoot_loops = 0; // Resets The Amount Of Current Shooting Animation's Repetitions
            this.current_frame = 0; // Resets The Current Sprite Frame Value
            this.frames_counter = 0; // Resets The Frames Counter Value
            if (this.current_action.startsWith("move"))
                this.current_action = this.current_action.replace("move", "shoot"); // Replaces The Move Action With The Shoot Action
        }
    }
}
export class Bullet {
    position;
    velocity;
    animation_slowdown_level;
    size;
    direction;
    can_be_removed;
    is_colliding;
    scale;
    image;
    current_frame;
    max_frames;
    frames_counter;
    current_action;
    collision_loops;
    last_image_source;
    constructor({ position, animation_slowdown_level, direction }) {
        this.position = position;
        // Sets The Movement Speed
        this.velocity = {
            x: 10,
            y: 10
        },
            this.animation_slowdown_level = animation_slowdown_level; // Sets The Level Of Animation Slowdown
        this.scale = 2;
        this.image = new Image();
        this.image.src = "../../textures/shot_decal/BLUDA0.png";
        this.is_colliding = false; // Stores The Information If The Bullet Is Colliding
        this.direction = direction;
        // Sets The Default Size Of The Flying Bullet
        this.size = {
            width: 0,
            height: 0
        };
        // Sets The Size Of The Horizontally Flying Bullet
        if (this.direction === "shoot_left" || this.direction === "shoot_right") {
            this.size = {
                width: 20,
                height: 3
            };
        }
        // Sets The Size Of The Vertically Flying Bullet
        if (this.direction === "shoot_up" || this.direction === "shoot_down") {
            this.size = {
                width: 3,
                height: 20
            };
        }
        this.current_frame = 0; // Sets The Initial Current Sprite Frame
        this.max_frames = shot_decal_sprites.enemy_hit.frames.length; // Sets The Default Amount Of Maximum Sprite Frames
        this.frames_counter = 0; // Sets The Initial Frames Counter Value
        this.current_action = "enemy_hit"; // Stores The Current Used Sprite
        this.collision_loops = 0; // Stores The Amount Of Current Collision Animation's Repetitions
        this.can_be_removed = false; // Stores The Information If The Bullet Can Be Removed
        this.last_image_source = "../../textures/shot_decal/BLUDA0.png"; // Stores The Last Image Source
    }
    // Method For Draw The Bullet
    draw(ctx) {
        if (!this.is_colliding) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.position.x - this.size.width / 2, this.position.y - this.size.height / 2, this.size.width, this.size.height);
        }
        else {
            ctx.drawImage(this.image, this.position.x - (this.size.width / 2), this.position.y - (this.size.height / 2), this.size.width, this.size.height);
        }
    }
    // Method For Update The Bullet
    update() {
        const MAIN_PATH = "../../textures/shot_decal/"; // Defines The Main Sprite Path
        const sprite_data = shot_decal_sprites[this.current_action]; // Loads Sprites For The Current Action
        const next_image_source = `${MAIN_PATH + sprite_data.frames[this.current_frame]}.png`; // Gets The Next Image Source
        this.max_frames = sprite_data.frames.length; // Updates The Amount Of Maximum Sprite Frames
        if (this.last_image_source !== next_image_source) {
            this.image.src = next_image_source; // Updates The Image Source Only If Differs
            this.last_image_source = next_image_source; // Updates The Last Image Source
        }
        // Moves The Bullet
        if (!this.is_colliding) {
            if (this.direction === "shoot_up")
                this.position.y -= this.velocity.y;
            if (this.direction === "shoot_left")
                this.position.x -= this.velocity.x;
            if (this.direction === "shoot_down")
                this.position.y += this.velocity.y;
            if (this.direction === "shoot_right")
                this.position.x += this.velocity.x;
        }
        // Shows The Enemy Hit Animation
        else {
            // Sets The Size Of The Decal Image
            this.size = {
                width: this.image.width * this.scale,
                height: this.image.height * this.scale
            };
            // Changes The Sprite Frame Only In Every Selected Period
            if (this.frames_counter % this.animation_slowdown_level === 0) {
                this.current_frame += 1; // Increases The Current Sprite Frame
                // When The Sprite Animation Has Finished
                if (this.current_frame >= this.max_frames) {
                    // Handles The Enemy Hit Animation Loop
                    if (this.is_colliding) {
                        const REPEAT_TIMES = 3; // Sets The Amount Of Collision Animation's Repetitions
                        this.collision_loops += 1; // Increases The Amount Of Current Collision Animation's Repetitions
                        // Ends The Collision Animation When The Collision Animation Reached The Maximum Amount Of Loops
                        if (this.collision_loops >= REPEAT_TIMES) {
                            this.can_be_removed = true; // Stores The Information That The Bullet Can Be Removed
                            this.current_frame = 0; // Resets The Current Sprite Frame Value
                        }
                        else
                            this.current_frame = 0; // Resets The Current Sprite Frame Value
                    }
                    else
                        this.current_frame = 0; // Resets The Current Sprite Frame Value
                }
            }
            this.frames_counter += 1; // Increases The Frames Counter Value
        }
    }
    // Method For Make The Bullet Decal
    makeDecal() {
        this.is_colliding = true;
    }
}
//# sourceMappingURL=Doomguy.js.map