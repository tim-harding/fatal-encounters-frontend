import SelectPill from "./components/SelectPill"
import Select from "./components/Select"
import Spinner from "./components/Spinner"
import GMap from "./components/GMap"
import Store from "./store"

let store: Store = new Store()

function main() {
    store.listeners.push(handlePositions)
    defineComponents()
}

function handlePositions() {
    const map = document.querySelector("fe-gmap") as GMap
    map.setMarkers(store.markers)
}

function defineComponents() {
    customElements.define(Spinner.TAG, Spinner)
    customElements.define(Select.TAG, Select)
    customElements.define(SelectPill.TAG, SelectPill)
    customElements.define(GMap.TAG, GMap)
}

main()