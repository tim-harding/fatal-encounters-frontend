import { PubSub } from "../shared/PubSub";


export class FilterPlace extends PubSub {

    private cities: number[] = [];
    private states: number[] = [];
    private isCity: boolean = false;

    private get target(): number[] {
        return this.isCity ? this.cities : this.states;
    }

    add(id: number): void {
        this.target.push(id);
        this.publish();
    }

    remove(id: number): void {
        const target = this.target;
        const i = target?.indexOf(id);
        if (i) {
            target?.splice(i, 1);
        }
        this.publish();
    }

}
