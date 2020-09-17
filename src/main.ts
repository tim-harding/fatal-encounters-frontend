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
    prepareSelectElements()
    prepareSelectEnumQueries()
}

function prepareSelectElements() {
    const elements = document.querySelectorAll("fe-select") as NodeListOf<Select>
    for (const element of elements) {
        element.store = store
    }
}

function handlePositions() {
    const map = document.querySelector("fe-gmap") as GMap
    map.store = store
    map.setMarkers(store.markers)
}

function prepareSelectEnumQueries() {
    const enums = document.querySelectorAll(".enum") as NodeListOf<Select>
    for (const e of enums) {
        console.log(`Query for ${e}`)
        e.query = queryForSelectEnumFactory(e)
        e.storeValue = storeValueForSelectEnumFactory(e)
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
        const url = new URL(`/api/${s.name}`, baseUrl())
        const params = url.searchParams
        params.append("search", s.term)
        params.append("count", "6")
        // Todo: filter by exisiting IDs
        const href = url.href
        return href
    }
}

function storeValueForSelectEnumFactory(s: Select): { (row: any): void } {
    return function storeValue(row: any): void {
        store.enums.get(s.name)?.set(row.id, row.name)
    }
}

main()