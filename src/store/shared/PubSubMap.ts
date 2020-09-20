import { PubSub } from "./PubSub";

export default class PubSubMap<T, U> extends PubSub {

    private map: Map<T, U> = new Map()

    set(t: T, u: U): void {
        this.map.set(t, u)
        this.publish();
    }

    delete(t: T): void {
        this.map.delete(t)
        this.publish()
    }

    clear(): void {
        this.map.clear()
        this.publish()
    }

    get(t: T): U | undefined {
        return this.map.get(t);
    }

    get entries(): IterableIterator<[T, U]> {
        return this.map.entries()
    }

    get values(): IterableIterator<U> {
        return this.map.values()
    }

    get keys(): IterableIterator<T> {
        return this.map.keys()
    }

}