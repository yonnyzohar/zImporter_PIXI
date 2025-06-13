import { ZContainer } from "./ZContainer";
export declare class ZState extends ZContainer {
    private currentState;
    init(): void;
    getCurrentState(): ZContainer | null;
    hasState(str: string): boolean;
    setState(str: string): ZContainer | null;
}
//# sourceMappingURL=ZState.d.ts.map