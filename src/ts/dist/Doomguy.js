export class Doomguy {
    position;
    size;
    velocity;
    constructor({ position, size, velocity }) {
        this.position = position,
            this.size = size,
            this.velocity = velocity;
    }
    // Method For Draw The Doomguy
    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}
//# sourceMappingURL=Doomguy.js.map