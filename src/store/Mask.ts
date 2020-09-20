import { PubSub } from "./shared/PubSub";

export class Mask extends PubSub {

    private _ids: number[] | null = null;

    constructor() {
        super();
    }

    get ids(): number[] | null {
        return this._ids;
    }

    set ids(value: number[] | null) {
        this._ids = value;
        this.publish();
    }
}
