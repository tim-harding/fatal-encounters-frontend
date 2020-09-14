function main() {
    prepareBody()
    loadMaps()
}

function prepareBody(): void {
    const div = document.createElement("div")
    div.id = "map-target"
    div.style.height = "500px"
    document.body.appendChild(div)
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

let map: google.maps.Map

function initMap(): void {
    const target = document.getElementById("map-target") as HTMLElement
    map = new google.maps.Map(target, {
        center: {
            lat: 38.5,
            lng: -95,
        },
        zoom: 4,
    })
}

main()