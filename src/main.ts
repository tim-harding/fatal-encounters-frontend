import SelectPill from "./components/SelectPill"
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
    customElements.define(SelectPill.TAG, SelectPill)
    customElements.define(GMap.TAG, GMap)
}

main()