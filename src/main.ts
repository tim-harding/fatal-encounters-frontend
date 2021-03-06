import SelectPill from "./components/SelectPill"
import Select from "./components/Select"
import GMap from "./components/GMap"
import Store from "./store/Store"
import { baseUrl } from "./misc"
import Bound from "./components/Bound"

let store: Store = new Store()

function main() {
    defineComponents()
    initializeMap()
    prepareSelectEnumQueries()
    prepareBoundsElements()
}

function initializeMap() {
    const map = document.querySelector("fe-gmap") as GMap
    map.store = store
}

function prepareSelectEnumQueries() {
    const enums = document.querySelectorAll(".enum") as NodeListOf<Select>
    for (const e of enums) {
        const delegate = {
            query : queryForSelectEnumFactory(e),
            storeValue : storeValueForSelectEnumFactory(e),
            nameForId : nameForIdFactory(e),
            removeFromFilter : removeFromFilterFactory(e),
            addToFilter : addToFilterFactory(e),
        }
        e.delegate = delegate
    }
}

function prepareBoundsElements() {
    const age = document.getElementById("filter-age") as Bound
    age.callbacks = {
        setMin: setMinAge,
        setMax: setMaxAge,
    }
    const date = document.getElementById("filter-date") as Bound
    date.callbacks = {
        setMin: setMinDate,
        setMax: setMaxDate,
    }
}

function setMinDate(value: string): void {
    store.filter.date.min = parseDate(value)
}

function setMaxDate(value: string): void {
    store.filter.date.max = parseDate(value)
}

function parseDate(value: string): Date | null {
    const parts = value.split("-")
    const partInts = parts.map(part => parseInt(part))
    const valid = partInts.reduce(partIntsReduce, true)
    if (valid) {
        const [year, month, day] = partInts
        return new Date(year, month, day)
    }
    return null
}

function partIntsReduce(previous: boolean, current: number): boolean {
    return previous && !isNaN(current)
}

function setMinAge(value: string): void {
    store.filter.age.min = toInt(value)
}

function setMaxAge(value: string): void {
    store.filter.age.max = toInt(value)
}

function toInt(value: string): number | null {
    const int = parseInt(value)
    return isNaN(int) ? null : int
}

function addToFilterFactory(s: Select): { (id: number): void } {
    return function(id: number): void {
        store.filter.enums.add(s.name, id)
    }
}

function removeFromFilterFactory(s: Select): { (id: number): void } {
    return function(id: number): void {
        store.filter.enums.remove(s.name, id)
    }
}

function defineComponents() {
    customElements.define(Select.TAG, Select)
    customElements.define(SelectPill.TAG, SelectPill)
    customElements.define(GMap.TAG, GMap)
    customElements.define(Bound.TAG, Bound)
}

function queryForSelectEnumFactory(s: Select): { (): string } {
    return function query(): string {
        const name = selectQueryName(s)
        const url = new URL(`/api/${name}`, baseUrl())
        const params = url.searchParams
        params.append("search", s.term)
        params.append("count", "6")
        const ids = store.filter.enums.get(s.name)
        const idsString = ids?.join(",")
        if (idsString) {
            params.append("ignore", idsString)
        }
        const href = url.href
        return href
    }
}

function selectQueryName(s: Select): string {
    const nameParts = s.name.split("-")
    for (let i = 1; i < nameParts.length; i++) {
        const part = nameParts[i]
        const firstLetter = part[0].toUpperCase()
        const rest = part.slice(1)
        nameParts[i] = `${firstLetter}${rest}`
    }
    const name = nameParts.join("")
    return name
}

function nameForIdFactory(s: Select): { (id: number): string } {
    return function nameForId(id: number): string {
        const name = store.data.enums.get(s.name)?.get(id)
        return name || ""
    }
}

function storeValueForSelectEnumFactory(s: Select): { (row: any): void } {
    return function storeValue(row: any): void {
        store.data.enums.get(s.name)?.set(row.id, row.name)
    }
}

main()