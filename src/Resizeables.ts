export class Resizeables {
    static resizeables = new Map<any, boolean>();

    static addResizeable(mc: any) {
        Resizeables.resizeables.set(mc, true);
    }

    static resize() {
        for (const [key] of Resizeables.resizeables) {
            (key as any).resize();
        }
    }

    static removeResizeable(mc: any) {
        Resizeables.resizeables.delete(mc);
    }
}

