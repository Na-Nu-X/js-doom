export interface Position {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}
export interface Velocity {
    x: number;
    y: number;
}
interface DoomguyConfig {
    position: Position;
    velocity: Velocity;
    animation_slowdown_level: number;
    is_moving: boolean;
}
interface BulletConfig {
    position: Position;
    velocity?: Velocity;
    animation_slowdown_level: number;
    size?: Size;
    direction: string;
}
export declare class Doomguy {
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
    constructor({ position, velocity, animation_slowdown_level }: DoomguyConfig);
    draw(ctx: CanvasRenderingContext2D): void;
    update(): void;
    moveUp(): void;
    moveLeft(): void;
    moveDown(): void;
    moveRight(): void;
    shoot(): void;
}
export declare class Bullet {
    position: Position;
    velocity: Velocity;
    animation_slowdown_level: number;
    size: Size;
    direction: string;
    private image;
    private current_frame;
    private max_frames;
    private frames_counter;
    private is_colliding;
    private current_action;
    constructor({ position, animation_slowdown_level, direction }: BulletConfig);
    draw(ctx: CanvasRenderingContext2D): void;
    update(): void;
    makeDecal(): void;
}
export {};
//# sourceMappingURL=Doomguy.d.ts.map