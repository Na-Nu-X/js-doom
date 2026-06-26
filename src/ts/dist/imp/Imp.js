import { imp as imp_sprites } from "./data.js";
import { imp_fireball as imp_fireball_sprites } from "./data.js";
import { getBulletPosition } from "../game.js";
export class Imp {
    position;
    velocity;
    animation_slowdown_level;
    is_moving;
    size;
    is_shooting;
    current_action;
    is_death;
    scale;
    image;
    current_frame;
    max_frames;
    is_mirrored;
    frames_counter;
    health;
    constructor({ position, velocity, animation_slowdown_level }) {
        this.position = position;
        this.velocity = velocity;
        this.animation_slowdown_level = animation_slowdown_level; // Sets The Level Of Animation Slowdown
        this.is_moving = false; // Stores The Information If The Imp Is Moving
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
        this.current_action = "move_up"; // Stores The Current Used Sprite
        this.is_shooting = false; // Checks If The Imp Is Shooting
        this.health = 100; // Stores The Health Amount
        this.is_death = false; // Checks If The Imp Is Dying
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
        // Health Bar
        if (!this.is_death) {
            const HEALTH_BAR_WIDTH = 100; // Defines The Width Of The Health Bar
            const HEALTH_BAR_HEIGHT = 5; // Defines The Height Of The Health Bar
            ctx.fillStyle = "black";
            // Creates The Health Bar Background
            ctx.fillRect(this.position.x - HEALTH_BAR_WIDTH / 2, this.position.y - this.size.height / 2 - HEALTH_BAR_HEIGHT - 5, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
            ctx.fillStyle = "red";
            // Creates The Health Bar Indicator
            ctx.fillRect(this.position.x - HEALTH_BAR_WIDTH / 2, this.position.y - this.size.height / 2 - HEALTH_BAR_HEIGHT - 5, this.health, HEALTH_BAR_HEIGHT);
        }
    }
    // Method For Update The Imp
    update(all_fireballs) {
        const MAIN_PATH = "../../textures/imp/"; // Defines The Main Sprite Path
        const sprite_data = imp_sprites[this.current_action]; // Loads Sprites For The Current Action
        const next_source = `${MAIN_PATH + sprite_data.frames[this.current_frame]}.png`; // Gets The Next Image Source
        this.max_frames = sprite_data.frames.length; // Updates The Amount Of Maximum Sprite Frames
        this.is_mirrored = sprite_data.mirrored; // Updates The Information If The Sprite Is Mirrored
        if (this.image.src !== next_source)
            this.image.src = next_source; // Updates The Image Source Only If Differs
        // If The Imp Is Moving Or Shooting
        if (this.is_moving || this.is_shooting) {
            // Changes The Sprite Frame Only In Every Selected Period
            if (this.frames_counter % this.animation_slowdown_level === 0) {
                this.current_frame += 1; // Increases The Current Sprite Frame
                // When The Sprite Animation Has Finished
                if (this.current_frame >= this.max_frames) {
                    // Handles The Shooting Animation Loop
                    if (this.is_shooting) {
                        this.is_shooting = false; // Stores The Information That The Imp Isn't Shooting
                        this.current_action = this.current_action.replace("shoot", "move"); // Replaces The Shoot Action With The Move Action
                        this.current_frame = 0; // Resets The Current Sprite Frame Value
                        const fireball_position = getBulletPosition(this.current_action, this.position); // Gets The Fireball Position
                        // Creates The Fireball
                        const fireball = new Fireball({
                            position: fireball_position, // Sets The Spawn Position
                            direction: this.current_action, // Sets The Fly Direction
                            animation_slowdown_level: 30 // Sets The Timeout Between Sprite Animations (Every 30th Frame)
                        });
                        all_fireballs.push(fireball); // Stores The New Fireball To All Fireballs
                    }
                    else
                        this.current_frame = 0; // Resets The Current Sprite Frame Value
                }
            }
            this.frames_counter += 1; // Increases The Frames Counter Value
        }
        // If The Imp Is Dying
        else if (this.is_death) {
            // Changes The Sprite Frame Only In Every Selected Period
            if (this.frames_counter % this.animation_slowdown_level === 0) {
                this.current_frame += 1; // Increases The Current Sprite Frame
                // When The Sprite Animation Has Finished
                if (this.current_frame >= this.max_frames) {
                    this.current_frame = this.max_frames - 1; // Stays At The Last Frame
                }
            }
            this.frames_counter += 1; // Increases The Frames Counter Value
        }
        // If The Imp Is Standing
        else {
            this.current_frame = 0; // Resets The Current Sprite Frame Value
            this.frames_counter = 0; // Resets The Frames Counter Value
        }
    }
    // Method For Move Up The Imp
    moveUp() {
        this.position.y -= this.velocity.x; // Moves Up
        this.is_moving = true; // Stores The Information That The Imp Is Moving
        if (!this.is_shooting)
            this.current_action = "move_up"; // Sets The Current Action
    }
    // Method For Move Left The Imp
    moveLeft() {
        this.position.x -= this.velocity.x; // Moves To The Left
        this.is_moving = true; // Stores The Information That The Imp Is Moving
        if (!this.is_shooting)
            this.current_action = "move_left"; // Sets The Current Action
    }
    // Method For Move Down The Imp
    moveDown() {
        this.position.y += this.velocity.x; // Moves Down
        this.is_moving = true; // Stores The Information That The Imp Is Moving
        if (!this.is_shooting)
            this.current_action = "move_down"; // Sets The Current Action
    }
    // Method For Move Right The Imp
    moveRight() {
        this.position.x += this.velocity.x; // Moves To The Right
        this.is_moving = true; // Stores The Information That The Imp Is Moving
        if (!this.is_shooting)
            this.current_action = "move_right"; // Sets The Current Action
    }
    // Method For Shooting
    shoot() {
        // If The Imp Isn't Shooting
        if (!this.is_shooting) {
            this.is_shooting = true; // Stores The Information That The Imp Is Shooting
            this.current_frame = 0; // Resets The Current Sprite Frame Value
            this.frames_counter = 0; // Resets The Frames Counter Value
            if (this.current_action.startsWith("move"))
                this.current_action = this.current_action.replace("move", "shoot"); // Replaces The Move Action With The Shoot Action
        }
    }
    // Method For Obtain The Hit
    gotHit() {
        this.health -= 25; // Decreases The Health
        // When The Health Gets To 0
        if (this.health <= 0) {
            const DEATHS = ["death", "explode_death"]; // Stores The Possible Death Actions
            this.is_moving = false; // Stores The Information That The Imp Isn't Moving
            this.is_shooting = false; // Stores The Information That The Imp Isn't Shooting
            this.is_death = true; // Stores The Information That The Imp Is Dying
            this.current_frame = 0; // Resets The Current Sprite Frame Value
            this.frames_counter = 0; // Resets The Frames Counter Value
            this.current_action = DEATHS[Math.floor(Math.random() * DEATHS.length)]; // Sets The Current Action
        }
    }
}
export class Fireball {
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
            x: 3,
            y: 3
        },
            this.animation_slowdown_level = animation_slowdown_level; // Sets The Level Of Animation Slowdown
        this.scale = 2;
        this.image = new Image();
        this.image.src = "../../textures/imp_fireball/BAL1A0.png";
        this.is_colliding = false; // Stores The Information If The Fireball Is Colliding
        this.direction = direction;
        // Sets The Size Of The Flying Fireball
        this.size = {
            width: this.image.width,
            height: this.image.height
        };
        this.current_frame = 0; // Sets The Initial Current Sprite Frame
        this.max_frames = imp_fireball_sprites.fly.frames.length; // Sets The Default Amount Of Maximum Sprite Frames
        this.frames_counter = 0; // Sets The Initial Frames Counter Value
        this.current_action = "fly"; // Stores The Current Used Sprite
        this.collision_loops = 0; // Stores The Amount Of Current Collision Animation's Repetitions
        this.can_be_removed = false; // Stores The Information If The Fireball Can Be Removed
        this.last_image_source = "../../textures/imp_fireball/BAL1A0.png"; // Stores The Last Image Source
    }
    // Method For Draw The Fireball
    draw(ctx) {
        if (!this.is_colliding) {
            ctx.drawImage(this.image, this.position.x - (this.size.width / 2), this.position.y - (this.size.height / 2), this.size.width, this.size.height);
        }
        else {
            ctx.drawImage(this.image, this.position.x - (this.size.width / 2), this.position.y - (this.size.height / 2), this.size.width, this.size.height);
        }
    }
    update() {
        const MAIN_PATH = "../../textures/imp_fireball/"; // Defines The Main Sprite Path
        const sprite_data = imp_fireball_sprites[this.current_action]; // Loads Sprites For The Current Action
        const next_image_source = `${MAIN_PATH + sprite_data.frames[this.current_frame]}.png`; // Gets The Next Image Source
        this.max_frames = sprite_data.frames.length; // Updates The Amount Of Maximum Sprite Frames
        if (this.last_image_source !== next_image_source) {
            this.image.src = next_image_source; // Updates The Image Source Only If Differs
            this.last_image_source = next_image_source; // Updates The Last Image Source
        }
        // Sets The Size Of The Decal Image
        if (this.image.width > 0) {
            this.size = {
                width: this.image.width * this.scale,
                height: this.image.height * this.scale
            };
        }
        // Moves The Fireball
        if (!this.is_colliding) {
            if (this.direction === "move_up")
                this.position.y -= this.velocity.y;
            if (this.direction === "move_left")
                this.position.x -= this.velocity.x;
            if (this.direction === "move_down")
                this.position.y += this.velocity.y;
            if (this.direction === "move_right")
                this.position.x += this.velocity.x;
        }
        // Changes The Sprite Frame Only In Every Selected Period
        if (this.frames_counter % this.animation_slowdown_level === 0) {
            this.current_frame += 1; // Increases The Current Sprite Frame
            // When The Sprite Animation Has Finished
            if (this.current_frame >= this.max_frames) {
                // Handles The Hit Animation Loop
                if (this.is_colliding) {
                    const REPEAT_TIMES = 3; // Sets The Amount Of Collision Animation's Repetitions
                    this.collision_loops += 1; // Increases The Amount Of Current Collision Animation's Repetitions
                    // Ends The Collision Animation When The Collision Animation Reached The Maximum Amount Of Loops
                    if (this.collision_loops >= REPEAT_TIMES) {
                        this.can_be_removed = true; // Stores The Information That The Fireball Can Be Removed
                    }
                }
                this.current_frame = 0; // Resets The Current Sprite Frame Value
            }
        }
        this.frames_counter += 1; // Increases The Frames Counter Value (TOTO TERAZ BEŽÍ VŽDY)
    }
    // Method For Make The Fireball Decal
    makeDecal() {
        this.is_colliding = true;
        this.current_action = "impact"; // Sets The Current Action
        this.current_frame = 0; // Resets The Current Sprite Frame Value
    }
}
//# sourceMappingURL=Imp.js.map