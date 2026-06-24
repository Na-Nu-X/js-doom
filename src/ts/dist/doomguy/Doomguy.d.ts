type Position = {
    x: number;
    y: number;
};
type Velocity = {
    x: number;
    y: number;
};
type Config = {
    position: Position;
    velocity: Velocity;
};
export declare class Doomguy {
    position: Position;
    velocity: Velocity;
    private scale;
    private image;
    private size;
    private current_frame;
    private max_frames;
    private is_mirrored;
    private frame_counter;
    constructor({ position, velocity }: Config);
    draw(ctx: CanvasRenderingContext2D): void;
    changeImage(image_set: string): void;
    moveForward(): void;
    moveLeft(): void;
    moveBackward(): void;
    moveRight(): void;
}
export {};
//# sourceMappingURL=Doomguy.d.ts.map