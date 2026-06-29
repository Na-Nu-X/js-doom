import type { Position, Size, Velocity } from "../doomguy/Doomguy.js";
export interface FireballConfig {
    position: Position;
    velocity?: Velocity;
    size?: Size;
    direction: string;
    animation_slowdown_level: number;
    target_position?: Position;
}
interface ImpConfig {
    position: Position;
    velocity: Velocity;
    animation_slowdown_level: number;
    is_moving: boolean;
}
export declare class Imp {
    position: Position;
    velocity: Velocity;
    animation_slowdown_level: number;
    is_moving: boolean;
    size: Size;
    is_shooting: boolean;
    current_action: string;
    is_death: boolean;
    private scale;
    private image;
    private current_frame;
    private max_frames;
    private is_mirrored;
    private frames_counter;
    private health;
    private attack_cooldown_counter;
    private attack_cooldown_max;
    constructor({ position, velocity, animation_slowdown_level }: ImpConfig);
    draw(ctx: CanvasRenderingContext2D): void;
    private executeChase;
    private executeAttack;
    update(all_fireballs: Fireball[], player_position: Position, is_player_death: boolean): void;
    gotHit(): void;
}
export declare class Fireball {
    position: Position;
    velocity: Velocity;
    animation_slowdown_level: number;
    size: Size;
    direction: string;
    can_be_removed: boolean;
    is_colliding: boolean;
    private scale;
    private image;
    private current_frame;
    private max_frames;
    private frames_counter;
    private current_action;
    private collision_loops;
    private last_image_source;
    constructor({ position, animation_slowdown_level, direction, target_position }: FireballConfig);
    private draw;
    update(ctx: CanvasRenderingContext2D): void;
    makeDecal(): void;
}
export {};
//# sourceMappingURL=Imp.d.ts.map