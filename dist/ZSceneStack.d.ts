import { ZContainer } from "./ZContainer";
import { ZScene } from "./ZScene";
export declare class ZSceneStack {
    private static stack;
    private static stackSize;
    private static top;
    static push(resource: ZScene): void;
    static pop(): ZScene | null;
    static peek(): ZScene | null;
    static getStackSize(): number;
    static clear(): void;
    static spawn(templateName: string): ZContainer | undefined;
}
//# sourceMappingURL=ZSceneStack.d.ts.map