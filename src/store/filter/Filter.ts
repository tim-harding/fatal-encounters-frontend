import { Bound } from "./Bound";
import { PubSub } from "../shared/PubSub";
import { Gender } from "./Gender";
import { FilterPlace } from "./FilterPlace";
import { FilterEnums } from "./FilterEnums";

export class Filter extends PubSub {

    private _name: string = "";

    get name() {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
        this.publish();
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
    readonly place: FilterPlace = new FilterPlace();
    readonly enums: FilterEnums = new FilterEnums();

    constructor() {
        super();
        const handler = this.publish.bind(this);
        this.age.listeners.push(handler);
        this.date.listeners.push(handler);
        this.place.listeners.push(handler);
        this.enums.listeners.push(handler);
    }
}
