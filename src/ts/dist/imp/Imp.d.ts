import type { Position, Size, Velocity } from "../doomguy/Doomguy.js";
interface ImpConfig {
    position: Position;
    velocity: Velocity;
    animation_slowdown_level: number;
    is_moving: boolean;
}
interface FireballConfig {
    position: Position;
    velocity?: Velocity;
    size?: Size;
    direction: string;
}
export declare class Imp {
    position: Position;
    velocity: Velocity;
    animation_slowdown_level: number;
    is_moving: boolean;
    size: Size;
    is_shooting: boolean;
    current_action: string;
    private scale;
    private image;
    private current_frame;
    private max_frames;
    private is_mirrored;
    private frames_counter;
    private shoot_loops;
    constructor({ position, velocity, animation_slowdown_level }: ImpConfig);
    draw(ctx: CanvasRenderingContext2D): void;
    update(): void;
    moveUp(): void;
    moveLeft(): void;
    moveDown(): void;
    moveRight(): void;
    shoot(): void;
    gotHit(): void;
}
export declare class Fireball {
    position: Position;
    velocity: Velocity;
    size: Size;
    direction: string;
    constructor({ position, velocity, size, direction }: FireballConfig);
    draw(ctx: CanvasRenderingContext2D): void;
    update(): void;
}
export {};
//# sourceMappingURL=Imp.d.ts.map