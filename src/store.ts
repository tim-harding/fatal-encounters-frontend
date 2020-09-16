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
    city: number[],
}

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
        city: [],
    }

    private mask: number[] | null = null
    private incidents: Map<number, Incident> = new Map()
    private positions: Map<number, google.maps.Marker> = new Map()
    private cities: Map<number, City> = new Map()
    private states: Map<number, State> = new Map()
    listeners: { (): void } [] = []

    constructor() {
        this.getAllLocations()
    }

    private async getAllLocations() {
        const loc = window.location
        const base = `${loc.protocol}//${loc.host}`;
        const url = new URL("/api/incident", base);
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