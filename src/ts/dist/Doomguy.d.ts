type Position = {
    x: number;
    y: number;
};
type Size = {
    width: number;
    height: number;
};
type Velocity = {
    x: number;
    y: number;
};
type Config = {
    position: Position;
    size: Size;
    velocity: Velocity;
};
export declare class Doomguy {
    position: Position;
    size: Size;
    velocity: Velocity;
    constructor({ position, size, velocity }: Config);
    draw(ctx: CanvasRenderingContext2D): void;
}
export {};
//# sourceMappingURL=Doomguy.d.ts.map