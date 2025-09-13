import { ZState } from "./ZState";
export declare class ZToggle extends ZState {
    private callback?;
    init(): void;
    setCallback(func: (t: boolean) => void): void;
    removeCallback(): void;
    getType(): string;
}
//# sourceMappingURL=ZToggle.d.ts.map