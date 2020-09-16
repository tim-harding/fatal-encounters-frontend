interface Position {
    lat: number,
    lng: number,
}

interface Incident {
    position: Position,
    details: Details | null,
}

interface Details {
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

    incidentMask: number[] | null = null

    incidents: Map<number, Incident> = new Map()

    cities: Map<number, City> = new Map()

    states: Map<number, State> = new Map()

}