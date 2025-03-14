import { GameContainer } from "./GameContainer";
import { GameScene } from "./GameScene";
export declare class GameSceneStack {
    private static stack;
    private static stackSize;
    private static top;
    static push(resource: GameScene): void;
    static pop(): GameScene | null;
    static peek(): GameScene | null;
    static getStackSize(): number;
    static clear(): void;
    static spawn(templateName: string): GameContainer | undefined;
}
