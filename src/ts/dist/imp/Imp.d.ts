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
export declare class Imp {
    position: Position;
    velocity: Velocity;
    private scale;
    private image;
    private size;
    private current_frame;
    private max_frames;
    private is_mirrored;
    private frames_counter;
    private last_used_sprite;
    constructor({ position, velocity }: Config);
    draw(ctx: CanvasRenderingContext2D): void;
    changeImage(image_set: string): void;
    moveUp(): void;
    moveLeft(): void;
    moveDown(): void;
    moveRight(): void;
    shoot(): void;
}
export {};
//# sourceMappingURL=Imp.d.ts.map