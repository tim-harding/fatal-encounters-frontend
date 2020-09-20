import { PubSub } from "../shared/PubSub";


export class FilterPlace extends PubSub {

    private cities: number[] = []
    private states: number[] = []

    isCity: boolean = false

    get ids(): number[] {
        return this.isCity ? this.cities : this.states;
    }

    add(id: number): void {
        this.ids.push(id);
        this.publish();
    }

    remove(id: number): void {
        const target = this.ids;
        const i = target?.indexOf(id);
        if (i) {
            target?.splice(i, 1);
        }
        this.publish();
    }

}
