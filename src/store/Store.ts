import { baseUrl } from "../misc"
import { Data } from "./data/Data"
import { Filter } from "./filter/Filter"
import { PubSub } from "./shared/PubSub"

export default class Store extends PubSub {

    private mask: number[] | null = null
    readonly filter: Filter = new Filter()
    readonly data: Data = new Data()

    constructor() {
        super()
        this.fetchPositions()
    }

    async fetchPositions(): Promise<void> {
        const url = new URL("/api/incident/position", baseUrl());
        const resolved = await fetch(url.href);
        const json = await resolved.json();
        for (const row of json.rows) {
            const { lat, lng } = row.position
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
            })
            this.data.positions.set(row.id, marker)
        }
        this.publish()
    }

    get markers(): google.maps.Marker[] {
        const out: google.maps.Marker[] = []
        const positions = this.data.positions
        if (this.mask) {
            for (const id of this.mask) {
                const position = positions.get(id)
                if (position) {
                    out.push(position)
                }
            }
        } else {
            for (const marker of positions.values()) {
                out.push(marker)
            }
        }
        return out
    }

}

