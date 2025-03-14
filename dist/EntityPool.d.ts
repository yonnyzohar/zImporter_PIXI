export declare class EntityPool {
    private dict;
    private static instance;
    private constructor();
    static getInstance(): EntityPool;
    init(_numElements: number, symbolTemplate: string, type: string): void;
    clear(type: string): void;
    get(type: string): any;
    putBack(e: any, type: string): void;
}
