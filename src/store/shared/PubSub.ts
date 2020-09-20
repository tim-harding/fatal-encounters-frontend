export class PubSub {

    readonly listeners: { (): void; }[] = [];

    private dirty: boolean = false

    protected publish(): void {
        if (!this.dirty) {
            this.dirty = true
            window.requestAnimationFrame(this.publishImmediate.bind(this))
        }
    }

    private publishImmediate(): void {
        this.dirty = false
        for (const listener of this.listeners) {
            listener()
        }
    }

}
