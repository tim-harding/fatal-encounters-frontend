import MarkerClusterer from "@google/markerclustererplus"
import fromTemplate from "./fromTemplate"

declare global {
  interface Window { initMap: () => void }
}

export default class GMap extends HTMLElement {

    private map: google.maps.Map | null = null
    private clusters: MarkerClusterer | null = null
    private markers: google.maps.Marker[] = []

    static readonly TAG = "fe-gmap"

    constructor() {
        super()
        fromTemplate.bind(this)(GMap.TAG)
        this.loadMaps()
    }

    setMarkers(markers: google.maps.Marker[]) {
        this.markers = markers
        this.update()
    }

    private update(): void {
        this.clusters?.clearMarkers()
        this.clusters?.addMarkers(this.markers)
    }

    private loadMaps(): void {
        var script = document.createElement("script")
        script.src = this.mapsApiUrl()
        script.defer = true;
        window.initMap = () => this.initMap()
        this.shadowRoot?.appendChild(script);
    }

    private mapsApiUrl(): string {
        const url = new URL("https://maps.googleapis.com/maps/api/js")
        const params = url.searchParams
        params.append("key", "AIzaSyBIXn2R13Tf_NpK7AW8Fd-OdQYv58nQK0k")
        params.append("callback", "initMap")
        params.append("v", "weekly")
        const href = url.href
        return href
    }

    private initMap(): void {
        const target = this.shadowRoot?.getElementById("map-target") as HTMLElement
        this.map = new google.maps.Map(target, {
            center: {
                lat: 38.5,
                lng: -95,
            },
            zoom: 4,
        })
        this.clusters = new MarkerClusterer(this.map, [], {
            imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        });
        this.update()
    }

}