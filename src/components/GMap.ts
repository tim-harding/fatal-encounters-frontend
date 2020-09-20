import MarkerClusterer from "@google/markerclustererplus"
import Store from "../store/Store"
import fromTemplate from "./fromTemplate"

declare global {
    interface Window { initMap: () => void }
}

export default class GMap extends HTMLElement {

    private map: google.maps.Map | null = null
    private clusters: MarkerClusterer | null = null
    private markers: Map<number, google.maps.Marker> = new Map()

    private initialized: boolean = false

    private _store: Store | null = null

    get store(): Store | null {
        return this._store
    }

    set store(value: Store | null) {
        this._store = value
        value?.mask.listeners.push(this.updateMarkers.bind(this))
        value?.data.positions.listeners.push(this.translatePositions.bind(this))
    }

    static readonly TAG = "fe-gmap"

    constructor() {
        super()
        fromTemplate.bind(this)(GMap.TAG)
        this.loadMaps()
    }

    private updateMarkers(): void {
        this.clusters?.clearMarkers()
        this.clusters?.addMarkers(this.filteredMarkers)
    }

    private loadMaps(): void {
        var script = document.createElement("script")
        script.src = this.mapsApiUrl
        script.defer = true
        window.initMap = this.initMap.bind(this)
        this.shadowRoot?.appendChild(script);
    }

    private get mapsApiUrl(): string {
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
        })
        this.initialized = true
        this.translatePositions()
    }

    private translatePositions() {
        const positions = this.store?.data.positions
        if (this.initialized && positions && this.markers.size == 0) {
            const entries = positions.entries
            if (entries) {
                for (const entry of entries) {
                    const [id, position] = entry
                    const marker = new google.maps.Marker({
                        position,
                    })
                    this.markers.set(id, marker)
                }
            }
            this.updateMarkers()
        }
    }

    private get filteredMarkers(): google.maps.Marker[] {
        const out: google.maps.Marker[] = []
        const mask = this.store?.mask.ids
        if (mask) {
            for (const id of mask) {
                const position = this.markers.get(id)
                if (position) {
                    out.push(position)
                }
            }
        } else {
            for (const marker of this.markers.values()) {
                out.push(marker)
            }
        }
        return out
    }

}