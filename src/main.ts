import SelectPill from "./components/SelectPill"
import Select from "./components/Select"
import Spinner from "./components/Spinner"
import GMap from "./components/GMap"
import Store from "./store"
import { baseUrl } from "./misc"

let store: Store = new Store()

function main() {
    store.listeners.push(handlePositions)
    defineComponents()
    prepareSelectEnumQueries()
}

function handlePositions() {
    const map = document.querySelector("fe-gmap") as GMap
    map.store = store
    map.setMarkers(store.markers)
}

function prepareSelectEnumQueries() {
    const enums = document.querySelectorAll(".enum") as NodeListOf<Select>
    for (const e of enums) {
        e.query = queryForSelectEnumFactory(e)
        e.storeValue = storeValueForSelectEnumFactory(e)
        e.nameForId = nameForIdFactory(e)
        e.removeValue = removeValueFactory(e)
    }
}

function removeValueFactory(s: Select): { (id: number): void } {
    return function(id: number): void {
        store.enums.get(s.name)?.delete(id)
    }
}

function defineComponents() {
    customElements.define(Spinner.TAG, Spinner)
    customElements.define(Select.TAG, Select)
    customElements.define(SelectPill.TAG, SelectPill)
    customElements.define(GMap.TAG, GMap)
}

function queryForSelectEnumFactory(s: Select): { (): string } {
    return function query(): string {
        const name = selectQueryName(s)
        const url = new URL(`/api/${name}`, baseUrl())
        const params = url.searchParams
        params.append("search", s.term)
        params.append("count", "6")
        const ids: number[] = []
        const keys = store.enums.get(s.name)?.keys()
        if (keys) {
            for (const id of keys) {
                ids.push(id)
            }
        }
        const idsString = ids.join(",")
        params.append("ignore", idsString)
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
        const name = store.enums.get(s.name)?.get(id)
        return name || ""
    }
}

function storeValueForSelectEnumFactory(s: Select): { (row: any): void } {
    return function storeValue(row: any): void {
        store.enums.get(s.name)?.set(row.id, row.name)
    }
}

main()