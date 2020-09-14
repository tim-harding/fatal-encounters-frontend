import MarkerClusterer from "@google/markerclustererplus"
import "./style.css"

declare global {
  interface Window { initMap: () => void }
}

let map: google.maps.Map | null
let people: any[] | null
let clusterer: MarkerClusterer | null

function main() {
    loadMaps()
    getAllLocations()
}

function loadMaps(): void {
    var script = document.createElement("script")
    script.src = mapsApiUrl()
    script.defer = true;
    window.initMap = initMap
    document.head.appendChild(script);
}

function mapsApiUrl(): string {
    const url = new URL("https://maps.googleapis.com/maps/api/js")
    const params = url.searchParams
    params.append("key", "AIzaSyBIXn2R13Tf_NpK7AW8Fd-OdQYv58nQK0k")
    params.append("callback", "initMap")
    params.append("v", "weekly")
    const href = url.href
    return href
}

function initMap(): void {
    const target = document.getElementById("map-target") as HTMLElement
    map = new google.maps.Map(target, {
        center: {
            lat: 38.5,
            lng: -95,
        },
        zoom: 4,
    })
    setMapLocations()
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
    people = json.rows;
    setMapLocations();
}

function setMapLocations() {
    if (map && people) {
        console.log("Setting map locations");
        const markers = people.map(personToLocation);
        clusterer = new MarkerClusterer(map, markers, {
            imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        });
    }
}

function personToLocation(person: any): google.maps.Marker {
    const { lat, lng } = person.position
    const marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
    })
    return marker
}

main()