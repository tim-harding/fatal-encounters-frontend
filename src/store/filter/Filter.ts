import { Bound } from "./Bound";
import { PubSub } from "../shared/PubSub";
import { Gender } from "./Gender";
import { Place } from "./Place";
import { Enums } from "./Enums";
import { Sort } from "./Sort";
import { SortOrder } from "./SortOrder";

export class Filter extends PubSub {

    private _name: string = "";

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
        this.publish();
    }

    private _sort: Sort = Sort.date

    get sort(): Sort {
        return this._sort
    }

    set sort(value: Sort) {
        this._sort = value
        this.publish()
    }

    private _sortOrder: SortOrder = SortOrder.ascending

    get sortOrder(): SortOrder {
        return this._sortOrder
    }

    set sortOrder(value: SortOrder) {
        this._sortOrder = value
        this.publish()
    }

    private _gender: Gender = Gender.either;

    get gender(): Gender {
        return this._gender;
    }

    set gender(value: Gender) {
        this._gender = value;
        this.publish();
    }

    readonly age: Bound<number> = new Bound();
    readonly date: Bound<Date> = new Bound();
    readonly place: Place = new Place();
    readonly enums: Enums = new Enums();

    constructor() {
        super();
        const handler = this.publish.bind(this);
        this.age.listeners.push(handler);
        this.date.listeners.push(handler);
        this.place.listeners.push(handler);
        this.enums.listeners.push(handler);
    }
}
