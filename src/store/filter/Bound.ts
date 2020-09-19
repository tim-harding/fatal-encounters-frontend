import { PubSub } from "../shared/PubSub";

export class Bound<T> extends PubSub {

    private _min: T | null = null;

    get min(): T | null {
        return this._min;
    }

    set min(value: T | null) {
        this._min = value;
        this.publish();
    }

    private _max: T | null = null;

    get max(): T | null {
        return this._max;
    }

    set max(value: T | null) {
        this._max = value;
        this.publish();
    }
}
