import { baseUrl } from "./misc"

interface Incident {
    name: string | null,
    age: number | null,
    isMale: boolean | null,
    race: number | null,
    imageUrl: string | null,
    date: Date,
    address: string | null,
    county: number | null,
    zipcode: number | null,
    agency: number | null,
    cause: number,
    description: string,
    useOfForce: number,
    articleUrl: string | null,
    videoUrl: string | null,
    city: number | null,
}

interface State {
    name: string,
    shortname: string,
}

interface City {
    name: string,
    state: number,
}

enum Gender {
    either,
    male,
    female,
}

class PubSub {

    readonly listeners: { (): void }[] = []

    protected publish(): void {
        for (const listener of this.listeners) {
            listener()
        }
    }
    
}

class Bound<T> extends PubSub {

    private _min: T | null = null

    get min(): T | null {
        return this._min
    }
    
    set min(value: T | null) {
        this._min = value
        this.publish()
    }

    private _max: T | null = null

    get max(): T | null {
        return this._max
    }
    
    set max(value: T | null) {
        this._max = value
        this.publish()
    }

}

class Filter extends PubSub {

    private _name: string = ""

    get name() {
        return this._name;
    }

    set name(value: string) {
        this._name = value
        this.publish()
    }

    private _gender: Gender = Gender.either

    get gender(): Gender {
        return this._gender
    }

    set gender(value: Gender) {
        this._gender = value
        this.publish()
    }

    readonly age: Bound<number> = new Bound()
    readonly date: Bound<Date> = new Bound()
    readonly place: FilterPlace = new FilterPlace()
    readonly enums: FilterEnums = new FilterEnums()

    constructor() {
        super()
        const handler = this.publish.bind(this)
        this.age.listeners.push(handler)
        this.date.listeners.push(handler)
        this.place.listeners.push(handler)
        this.enums.listeners.push(handler)
    }

}

class FilterEnums extends PubSub {

    private enums: Map<string, number[]> = new Map()

    constructor() {
        super()
        for (const table of ENUM_TABLES) {
            this.enums.set(table, [])
        }
    }

    add(e: string, id: number): void {
        this.enums.get(e)?.push(id)
        this.publish()
    }

    remove(e: string, id: number): void {
        const table = this.enums.get(e)
        const i = table?.indexOf(id)
        if (i) {
            table?.splice(i, 1)
        }
        this.publish()
    }

    get(e: string): number[] | undefined {
        return this.enums.get(e)
    }

}

class FilterPlace extends PubSub {

    private cities: number[] = []
    private states: number[] = []
    private isCity: boolean = false

    private get target(): number[] {
        return this.isCity ? this.cities : this.states
    }

    add(id: number): void {
        this.target.push(id)
        this.publish()
    }

    remove(id: number): void {
        const target = this.target
        const i = target?.indexOf(id)
        if (i) {
            target?.splice(i, 1)
        }
        this.publish()
    }

}

type Rows<T> = Map<number, T>
type Enums = Rows<string>

class Data {

    readonly incidents: Rows<Incident> = new Map()
    readonly positions: Rows<google.maps.Marker> = new Map()
    readonly cities: Rows<City> = new Map()
    readonly states: Rows<State> = new Map()
    readonly enums: Map<string, Enums> = new Map()

    constructor() {
        this.prepareEnums()
    }

    prepareEnums() {
        for (const table of ENUM_TABLES) {
            this.enums.set(table, new Map())
        }
    }

}

export default class Store extends PubSub {

    private mask: number[] | null = null
    readonly filter: Filter = new Filter()
    readonly data: Data = new Data()

    constructor() {
        super()
        this.fetchPositions()
    }

    async fetchPositions(): Promise<void> {
        const url = new URL("/api/incident/position", baseUrl());
        const resolved = await fetch(url.href);
        const json = await resolved.json();
        for (const row of json.rows) {
            const { lat, lng } = row.position
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
            })
            this.data.positions.set(row.id, marker)
        }
        this.publish()
    }

    get markers(): google.maps.Marker[] {
        const out: google.maps.Marker[] = []
        const positions = this.data.positions
        if (this.mask) {
            for (const id of this.mask) {
                const position = positions.get(id)
                if (position) {
                    out.push(position)
                }
            }
        } else {
            for (const marker of positions.values()) {
                out.push(marker)
            }
        }
        return out
    }

}

const ENUM_TABLES: string[] = [
    "race",
    "county",
    "agency",
    "cause",
    "useOfForce",
]