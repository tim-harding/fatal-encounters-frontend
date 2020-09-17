import { baseUrl } from "./baseUrl"

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

type Place = State[] | City[]

enum Gender {
    either,
    male,
    female,
}

interface Filter {
    name: string,
    ageMax: number | null,
    ageMin: number | null,
    dateMin: Date | null,
    dateMax: Date | null,
    gender: Gender,
    race: number[],
    county: number[],
    agency: number[],
    cause: number[],
    useOfForce: number[],
    place: Place,
}

type Rows<T> = Map<number, T>
type Enums = Rows<string>

export default class Store {

    filter: Filter = {
        name: "",
        ageMax: null,
        ageMin: null,
        dateMin: null,
        dateMax: null,
        gender: Gender.either,
        race: [],
        county: [],
        agency: [],
        cause: [],
        useOfForce: [],
        place: [],
    }

    readonly mask: number[] | null = null
    readonly incidents: Rows<Incident> = new Map()
    readonly positions: Rows<google.maps.Marker> = new Map()
    readonly cities: Rows<City> = new Map()
    readonly states: Rows<State> = new Map()
    readonly races: Enums = new Map()
    readonly counties: Enums = new Map()
    readonly agencies: Enums = new Map()
    readonly causes: Enums = new Map()
    readonly usesOfForce: Enums = new Map()
    readonly listeners: { (): void } [] = []

    async fetchLocations(): Promise<void> {
        const url = new URL("/api/incident", baseUrl());
        const params = url.searchParams;
        params.append("count", "-1");
        params.append("rowKind", "position");
        const resolved = await fetch(url.href);
        const json = await resolved.json();
        for (const row of json.rows) {
            const { lat, lng } = row.position
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
            })
            this.positions.set(row.id, marker)
        }
        for (const listener of this.listeners) {
            listener()
        }
    }

    get markers(): google.maps.Marker[] {
        const out: google.maps.Marker[] = []
        if (this.mask) {
            for (const id of this.mask) {
                const position = this.positions.get(id)
                if (position) {
                    out.push(position)
                }
            }
        } else {
            for (const marker of this.positions.values()) {
                out.push(marker)
            }
        }
        return out
    }
    
}