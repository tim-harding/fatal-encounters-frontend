import { baseUrl } from "../misc"
import { Data } from "./data/Data"
import { Bound } from "./filter/Bound"
import { Filter } from "./filter/Filter"
import { Place } from "./filter/Place"
import { Gender } from "./filter/Gender"
import { Sort } from "./filter/Sort"
import { SortOrder } from "./filter/SortOrder"
import { Mask } from "./Mask"

export default class Store {

    readonly mask: Mask = new Mask()
    readonly filter: Filter = new Filter()
    readonly data: Data = new Data()

    constructor() {
        this.fetchPositions()
        this.filter.listeners.push(this.handleFilterChange.bind(this))
    }

    async fetchPositions(): Promise<void> {
        const url = urlWith("position")
        const resolved = await fetch(url.href)
        const json = await resolved.json()
        for (const row of json.rows) {
            // Destructure from Proxy
            const { lat, lng } = row.position
            // Create plain old object
            const position = { lat, lng }
            this.data.positions.set(row.id, position)
        }
    }

    async handleFilterChange(): Promise<void> {
        const url = this.filterUrl()
        console.log(url.href)
        const response = await fetch(url.href)
        const json = await response.json()
        this.mask.ids = json.rows
    }

    filterUrl(): URL {
        const url = urlWith("filter")
        const params = url.searchParams
        const filter = this.filter
        filterBound(params, filter.age, numberToString, "age")
        filterBound(params, filter.date, formatDate, "date")
        if (filter.name.length > 0) {
            params.append("search", filter.name)
        }
        const gender = genderName(filter.gender)
        if (gender) {
            params.append("gender", gender)
        }
        for (const entry of filter.enums.entries) {
            const [table, ids] = entry
            idsFilter(table, ids, params)
        }
        addPlaceFilter(filter.place, params)
        params.append("order", stringifySort(filter.sort))
        if (filter.sortOrder == SortOrder.descending) {
            params.append("orderDirection", "descending")
        }
        return url
    }

}

function addPlaceFilter(place: Place, params: URLSearchParams): void {
    const table = place.isCity ? "city" : "state"
    idsFilter(table, place.ids, params)
}

function idsFilter(table: string, ids: number[], params: URLSearchParams): void {
    if (ids.length > 0) {
        const key = `${table}_id`
        params.append(key, ids.join(","))
    }
}

function stringifySort(sort: Sort): string {
    switch (sort) {
        case Sort.age: {
            return "age"
        }
        case Sort.date: {
            return "date"
        }
        case Sort.name: {
            return "name"
        }
    }
}

function genderName(gender: Gender): string | null {
    switch (gender) {
        case Gender.female: {
            return "female"
        }
        case Gender.male: {
            return "male"
        }
    }
    return null
}

function numberToString(value: number): string {
    return value.toString()
}

type Stringer<T> = { (t: T): string }

function filterBound<T>(params: URLSearchParams, bound: Bound<T>, stringer: Stringer<T>, name: string): void {
    filterBoundInner(params, bound.min, stringer, `${name}Min`)
    filterBoundInner(params, bound.max, stringer, `${name}Max`)
}

function filterBoundInner<T>(params: URLSearchParams, item: T | null, stringer: Stringer<T>, name: string): void {
    if (item) {
        params.append(name, stringer(item))
    }
}

function urlWith(end: string): URL {
    return new URL(`/api/incident/${end}`, baseUrl())
}

function formatDate(date: Date): string {
    const format = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    })
    const [
        {
            value: month,
        },
        ,
        {
            value: day,
        },
        ,
        {
            value: year,
        }
    ] = format.formatToParts(date)
    return `${year}-${month}-${day}`
}