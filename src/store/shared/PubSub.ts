export class PubSub {

    readonly listeners: { (): void; }[] = [];

    protected publish(): void {
        for (const listener of this.listeners) {
            listener();
        }
    }
}
