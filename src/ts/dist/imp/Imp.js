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
    attack_cooldown_counter = 0;
    attack_cooldown_max = 500;
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
        // // Shows The Hitbox
        // ctx.strokeStyle = "red"
        // ctx.strokeRect(
        //     this.position.x - this.size.width / 2,
        //     this.position.y - this.size.height / 2,
        //     this.size.width,
        //     this.size.height
        // )
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
    // Metdod For Execute Chase Of The Player
    executeChase(player_dx, player_dy) {
        this.is_shooting = false; // Stores The Information That The Imp Isn't Shooting
        this.is_moving = true; // Stores The Information That The Imp Is Moving
        const BUFFER = 20; // Sets The Distance From Where The Imp's Direction Will Change
        const absolute_player_dx = Math.abs(player_dx); // Gets The Absolute Horizontal Player Distance
        const absolute_player_dy = Math.abs(player_dy); // Gets The Absolute Vertical Player Distance
        const previous_action = this.current_action; // Stores The Previous Action
        // Decides The Move Action
        if (Math.abs(absolute_player_dx - absolute_player_dy) > BUFFER) {
            if (absolute_player_dx > absolute_player_dy) {
                if (player_dx > 0)
                    this.current_action = "move_right"; // Sets The Current Action
                else
                    this.current_action = "move_left"; // Sets The Current Action
            }
            else {
                if (player_dy > 0)
                    this.current_action = "move_down"; // Sets The Current Action
                else
                    this.current_action = "move_up"; // Sets The Current Action
            }
        }
        // If The Action Has Changed
        if (previous_action !== this.current_action) {
            this.current_frame = 0; // Resets The Current Sprite Frame Value
            this.frames_counter = 0; // Resets The Frames Counter Value
        }
        if (this.current_action === "move_up")
            this.position.y -= this.velocity.y; // Moves Up
        if (this.current_action === "move_left")
            this.position.x -= this.velocity.x; // Moves To The Left
        if (this.current_action === "move_down")
            this.position.y += this.velocity.y; // Moves Down
        if (this.current_action === "move_right")
            this.position.x += this.velocity.x; // Moves To The Right
    }
    // Metdod For Execute Attack Of The Player
    executeAttack(all_fireballs, player_dx, player_dy, player_position) {
        this.is_moving = false; // Stores The Information That The Imp Isn't Moving
        this.is_shooting = true; // Stores The Information That The Imp Is Shooting
        if (this.current_action.startsWith("move_")) {
            const absolute_player_dx = Math.abs(player_dx); // Gets The Absolute Horizontal Player Distance
            const absolute_player_dy = Math.abs(player_dy); // Gets The Absolute Vertical Player Distance
            if (absolute_player_dx > absolute_player_dy) {
                if (player_dx > 0)
                    this.current_action = "shoot_right"; // Sets The Current Action
                else
                    this.current_action = "shoot_left"; // Sets The Current Action
            }
            else {
                if (player_dy > 0)
                    this.current_action = "shoot_down"; // Sets The Current Action
                else
                    this.current_action = "shoot_up"; // Sets The Current Action
            }
            this.current_frame = 0; // Resets The Current Sprite Frame Value
            this.frames_counter = 0; // Resets The Frames Counter Value
        }
        // Changes The Sprite Frame Only In Every Selected Period
        if (this.frames_counter % this.animation_slowdown_level === 0) {
            this.current_frame += 1; // Increases The Current Sprite Frame
            // When The Sprite Animation Has Finished
            if (this.current_frame >= this.max_frames) {
                if (this.is_shooting) {
                    this.is_shooting = false; // Stores The Information That The Imp Isn't Shooting
                    let shoot_direction = this.current_action; // Gets The Shoot Direction
                    const current_player_dx = player_position.x - this.position.x; // Gets The Horizontal Player Distance
                    const current_player_dy = player_position.y - this.position.y; // Gets The Vertical Player Distance
                    if (Math.abs(current_player_dx) > Math.abs(current_player_dy)) {
                        shoot_direction = current_player_dx > 0 ? "shoot_right" : "shoot_left"; // Sets The Horizontal Shoot Direction
                    }
                    else {
                        shoot_direction = current_player_dy > 0 ? "shoot_down" : "shoot_up"; // Sets The Vertical Shoot Direction
                    }
                    const fireball_position = getBulletPosition(shoot_direction, this.position, this.size); // Gets The Fireball Position
                    const fireball_direction = shoot_direction.replace("shoot_", "move_"); // Gets The Fireball Direction
                    // Creates The Fireball
                    const fireball = new Fireball({
                        position: fireball_position, // Sets The Spawn Position
                        direction: fireball_direction, // Sets The Fly Direction
                        animation_slowdown_level: 10, // Sets The Timeout Between Sprite Animations (Every 10th Frame)
                        target_position: player_position
                    });
                    all_fireballs.push(fireball); // Stores The New Fireball To All Fireballs
                    this.attack_cooldown_counter = this.attack_cooldown_max; // Resets The Attack Cooldown Counter
                    this.current_action = shoot_direction.replace("shoot_", "move_"); // Replaces The Shoot Action With The Move Action
                    this.current_frame = 0; // Resets The Current Sprite Frame Value
                    this.frames_counter = 0; // Resets The Frames Counter Value
                }
                else
                    this.current_frame = 0; // Resets The Current Sprite Frame Value
            }
        }
        this.frames_counter += 1; // Increases The Frames Counter Value
    }
    // Method For Update The Imp
    update(all_fireballs, player_position, is_player_death) {
        const ATTACK_RANGE = 300; // Defines The Attack Range
        const player_dx = player_position.x - this.position.x; // Gets The Horizontal Player Distance
        const player_dy = player_position.y - this.position.y; // Gets The Vertical Player Distance
        const player_distance = Math.sqrt(player_dx * player_dx + player_dy * player_dy); // Gets The Player Distance
        if (this.attack_cooldown_counter > 0) {
            this.attack_cooldown_counter--;
        }
        // If The Imp Is Dying
        if (this.is_death) {
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
        // If The Player Is Alive
        else if (!is_player_death) {
            // Chases The Player
            if (player_distance > ATTACK_RANGE) {
                this.executeChase(player_dx, player_dy); // Executes The Chase
                // Changes The Sprite Frame Only In Every Selected Period
                if (this.frames_counter % this.animation_slowdown_level === 0) {
                    this.current_frame += 1; // Increases The Current Sprite Frame
                    // When The Sprite Animation Has Finished
                    if (this.current_frame >= this.max_frames) {
                        this.current_frame = 0; // Resets The Current Sprite Frame Value
                    }
                }
                this.frames_counter += 1; // Increases The Frames Counter Value
            }
            // Attacks The Player
            else if (player_distance <= ATTACK_RANGE && this.attack_cooldown_counter === 0) {
                this.executeAttack(all_fireballs, player_dx, player_dy, player_position); // Executes The Attack
            }
        }
        const MAIN_PATH = "../../textures/imp/"; // Defines The Main Sprite Path
        const sprite_data = imp_sprites[this.current_action]; // Loads Sprites For The Current Action
        if (this.current_frame >= sprite_data.frames.length)
            this.current_frame = 0; // Resets The Current Sprite Frame Value
        const next_source = `${MAIN_PATH + sprite_data.frames[this.current_frame]}.png`; // Gets The Next Image Source
        this.max_frames = sprite_data.frames.length; // Updates The Amount Of Maximum Sprite Frames
        this.is_mirrored = sprite_data.mirrored; // Updates The Information If The Sprite Is Mirrored
        // Updates The Image Source Only If Differs
        if (!this.image.src.endsWith(`${sprite_data.frames[this.current_frame]}.png`)) {
            this.image.src = next_source;
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
    constructor({ position, animation_slowdown_level, direction, target_position }) {
        const SPEED = 2; // Defines The Speed
        this.position = position;
        if (target_position) {
            const target_dx = target_position.x - this.position.x; // Gets The Horizontal Target Distance
            const target_dy = target_position.y - this.position.y; // Gets The Vertical Target Distance
            const angle = Math.atan2(target_dy, target_dx); // Gets The Angle To The Target
            // Sets The Movement Speed
            this.velocity = {
                x: Math.cos(angle) * SPEED,
                y: Math.sin(angle) * SPEED
            };
        }
        else {
            // Sets The Fallback Movement Speed (If The Target Position Isn't Defined)
            this.velocity = {
                x: 2,
                y: 2
            };
        }
        // Sets The Default Size Of The Fireball
        this.size = {
            width: 0,
            height: 0
        };
        this.animation_slowdown_level = animation_slowdown_level; // Sets The Level Of Animation Slowdown
        this.scale = 2; // Sets The Size Scale
        this.image = new Image();
        this.image.src = "../../textures/imp_fireball/BAL1A0.png";
        this.is_colliding = false; // Stores The Information If The Fireball Is Colliding
        this.direction = direction; // Sets The Direction
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
        ctx.drawImage(this.image, this.position.x - (this.size.width / 2), this.position.y - (this.size.height / 2), this.size.width, this.size.height);
    }
    // Method For Update The Fireball
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
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
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
        this.frames_counter += 1; // Increases The Frames Counter Value
    }
    // Method For Make The Fireball Decal
    makeDecal() {
        this.is_colliding = true; // Stores The Information That The Fireball Is Colliding
        this.current_action = "impact"; // Sets The Current Action
        this.current_frame = 0; // Resets The Current Sprite Frame Value
    }
}
//# sourceMappingURL=Imp.js.map