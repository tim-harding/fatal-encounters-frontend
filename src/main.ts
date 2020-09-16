import SelectPill from "./components/SelectPill"
import GMap from "./components/GMap"

function main() {
    defineComponents()
    getAllLocations()
}

function defineComponents() {
    customElements.define(SelectPill.TAG, SelectPill)
    customElements.define(GMap.TAG, GMap)
}


async function getAllLocations() {
    const loc = window.location
    const base = `${loc.protocol}//${loc.host}`;
    const url = new URL("/api/incident", base);
    const params = url.searchParams;
    params.append("count", "-1");
    params.append("rowKind", "mapping");
    const resolved = await fetch(url.href);
    const json = await resolved.json();
    const people = json.rows;
    const markers = people.map(personToLocation)
    const map = document.querySelector("fe-gmap") as GMap
    map.setMarkers(markers)
}

function personToLocation(person: any): google.maps.Marker {
    const { lat, lng } = person.position
    const marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
    })
    return marker
}

main()