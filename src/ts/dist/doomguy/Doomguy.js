import { doomguy as doomguy_sprites } from "./data.js";
export class Doomguy {
    position;
    velocity;
    is_moving;
    scale;
    image;
    size;
    current_frame;
    max_frames;
    is_mirrored;
    frames_counter;
    current_action;
    last_used_sprite;
    is_shooting;
    shoot_loops;
    constructor({ position, velocity, is_moving }) {
        this.position = position;
        this.velocity = velocity;
        this.is_moving = false; // Checks If The Doomguy Is Moving
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
        this.frames_counter = 0; // Sets The Initial Frames Counter Value
        this.current_action = "move_down"; // Stores The Current Used Sprite
        this.last_used_sprite = ""; // Stores The Last Used Sprite
        this.is_shooting = false; // Checks If The Doomguy Is Shooting
        this.shoot_loops = 0; // Stores The Amount Of Current Shooting Animation's Repetitions
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
    }
    update() {
        const MAIN_PATH = "../../textures/doomguy/";
        // Načítame dáta pre aktuálne nastavenú akciu
        const sprite_data = doomguy_sprites[this.current_action];
        this.max_frames = sprite_data.frames.length;
        this.is_mirrored = sprite_data.mirrored;
        // 🔥 OPRAVA: src prepíšeme IBA vtedy, ak sa reálne zmenil reťazec (cesta k obrázku)
        const next_src = `${MAIN_PATH + sprite_data.frames[this.current_frame]}.png`;
        if (this.image.src !== next_src) {
            this.image.src = next_src;
        }
        // Animáciu posúvame, ak sa strieľa, alebo ak sa postava hýbe
        if (this.is_shooting || this.is_moving) {
            if (this.frames_counter % 30 === 0) {
                this.current_frame += 1;
                if (this.current_frame >= this.max_frames) {
                    if (this.is_shooting) {
                        this.shoot_loops += 1;
                        const REPEAT_TIMES = 3;
                        if (this.shoot_loops >= REPEAT_TIMES) {
                            this.is_shooting = false;
                            // Po skončení streľby vrátime akciu automaticky na chôdzu
                            this.current_action = this.current_action.replace("shoot", "move");
                            this.current_frame = 0;
                        }
                        else {
                            this.current_frame = 0; // Opakovanie streľby od znova
                        }
                    }
                    else {
                        this.current_frame = 0; // Zacyklenie chôdze
                    }
                }
            }
            this.frames_counter += 1;
        }
        else {
            // Ak postava stojí a nestrieľa, vynútime nultý (stojaci) frame chôdze
            this.current_frame = 0;
            this.frames_counter = 0;
        }
    }
    // Method For Move Up The Doomguy
    moveUp() {
        this.position.y -= this.velocity.x;
        this.is_moving = true; // Stores The Information That The Doomguy Is Moving
        if (!this.is_shooting)
            this.current_action = "move_up";
    }
    // Method For Move Left The Doomguy
    moveLeft() {
        this.position.x -= this.velocity.x;
        this.is_moving = true; // Stores The Information That The Doomguy Is Moving
        if (!this.is_shooting)
            this.current_action = "move_left";
    }
    // Method For Move Down The Doomguy
    moveDown() {
        this.position.y += this.velocity.x;
        this.is_moving = true; // Stores The Information That The Doomguy Is Moving
        if (!this.is_shooting)
            this.current_action = "move_down";
    }
    // Method For Move Right The Doomguy
    moveRight() {
        this.position.x += this.velocity.x;
        this.is_moving = true; // Stores The Information That The Doomguy Is Moving
        if (!this.is_shooting)
            this.current_action = "move_right";
    }
    // Method For Shooting
    shoot() {
        if (!this.is_shooting) {
            this.is_shooting = true;
            this.shoot_loops = 0;
            this.current_frame = 0;
            this.frames_counter = 0;
            if (this.current_action.startsWith("move")) {
                this.current_action = this.current_action.replace("move", "shoot");
            }
        }
    }
}
//# sourceMappingURL=Doomguy.js.map