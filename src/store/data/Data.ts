import { Incident } from "./Incident";
import { State } from "./State";
import { City } from "./City";
import ENUM_TABLES from "../shared/enumTables"
import PubSubMap from "../shared/PubSubMap";
import { PubSub } from "../shared/PubSub";
import { Position } from "./Position";

export type Rows<T> = PubSubMap<number, T>

export class Data extends PubSub {

    readonly incidents: Rows<Incident> = new PubSubMap()
    readonly positions: Rows<Position> = new PubSubMap()
    readonly cities: Rows<City> = new PubSubMap()
    readonly states: Rows<State> = new PubSubMap()
    readonly enums: Map<string, Rows<string>> = new Map()

    constructor() {
        super()
        this.prepareEnums()
        this.prepareHandlers()
    }

    private prepareEnums(): void {
        for (const table of ENUM_TABLES) {
            this.enums.set(table, new PubSubMap());
        }
    }

    private prepareHandlers(): void {
        const handler = this.publish.bind(this)
        this.incidents.listeners.push(handler)
        this.positions.listeners.push(handler)
        this.cities.listeners.push(handler)
        this.states.listeners.push(handler)
        for (const entry of this.enums.entries()) {
            entry[1].listeners.push(handler)
        }
    }

}
