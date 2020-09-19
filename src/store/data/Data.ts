import { Incident } from "./Incident";
import { State } from "./State";
import { City } from "./City";
import ENUM_TABLES from "../shared/enumTables"

export type Rows<T> = Map<number, T>
export type Enums = Rows<string>

export class Data {

    readonly incidents: Rows<Incident> = new Map();
    readonly positions: Rows<google.maps.Marker> = new Map();
    readonly cities: Rows<City> = new Map();
    readonly states: Rows<State> = new Map();
    readonly enums: Map<string, Enums> = new Map();

    constructor() {
        this.prepareEnums();
    }

    prepareEnums() {
        for (const table of ENUM_TABLES) {
            this.enums.set(table, new Map());
        }
    }
}
