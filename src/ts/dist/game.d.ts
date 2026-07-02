import type { Position, Size } from "./doomguy/Doomguy.js";
import type { Wall } from "./map/data.js";
export declare function checkCollision(rectangle_1: any, rectangle_2: any, offset?: number): boolean;
export declare function checkWallCollision(rectangle_1: any, rectangle_2: Wall): boolean;
export declare function getBulletPosition(current_action: string, position_of_shooter: Position, size_of_shooter: Size): Position;
//# sourceMappingURL=game.d.ts.map